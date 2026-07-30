/**
 * =============================================================================
 * Jeeva Raksha — Authentication Controller (controllers/auth.controller.js)
 * =============================================================================
 * Description : Handles all auth flows including registration, login, OTP, 
 *               password reset, and profile management.
 * =============================================================================
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const admin = require('../config/firebase');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');
const otpService = require('../services/otpService');
const emailService = require('../services/emailService');

// ─── Utility: Generate Internal JWT ──────────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

// ─── 1. Register (Patient only) ──────────────────────────────────────────────
exports.register = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const {
      firebaseToken, fullName, email, password, phone, gender, dob, language,
      address, emergencyContact, bloodGroup, height, weight, allergies, medicalHistory
    } = req.body;

    // Verify Firebase token to get UID
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    // Check if user already exists
    const [existing] = await connection.query('SELECT user_id FROM users WHERE email = ? OR firebase_uid = ?', [email, firebaseUid]);
    if (existing.length > 0) return sendError(res, 'User already exists', 400);

    // Hash password for local fallback
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    // Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (firebase_uid, role, full_name, email, phone, password_hash, language) 
       VALUES (?, 'patient', ?, ?, ?, ?, ?)`,
      [firebaseUid, fullName, email, phone || null, passwordHash, language || 'en']
    );
    const userId = userResult.insertId;

    // Insert into patients table
    await connection.query(
      `INSERT INTO patients (user_id, blood_group, height, weight, allergies, medical_history)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, bloodGroup, height, weight, allergies, medicalHistory]
    );

    // Send Verification Email via OTP
    const otp = await otpService.createAndStoreOtp(userId);
    await emailService.sendOtpEmail(email, otp);

    await connection.commit();

    const token = generateToken(userId, 'patient');
    sendSuccess(res, { token, user: { id: userId, email, role: 'patient' } }, 'Registration successful. Verify email with OTP.', 201);
  } catch (error) {
    await connection.rollback();
    logger.error(`[Auth] Register error: ${error.message}`);
    sendError(res, error.message, 500);
  } finally {
    connection.release();
  }
};

// ─── 2. Login (Email/Password or Firebase Token) ─────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, firebaseToken, device } = req.body;
    let user;

    if (firebaseToken) {
      const decoded = await admin.auth().verifyIdToken(firebaseToken);
      const [rows] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [decoded.uid]);
      user = rows[0];
    } else if (email && password) {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      user = rows[0];
      if (user && !(await bcrypt.compare(password, user.password_hash))) user = null;
    }

    if (!user) return sendError(res, 'Invalid credentials', 401);
    if (user.status === 'suspended') return sendError(res, 'Account suspended', 403);

    const token = generateToken(user.user_id, user.role);

    // Record session
    await db.query('INSERT INTO user_sessions (user_id, jwt_token, device) VALUES (?, ?, ?)', [user.user_id, token, device || 'Unknown']);

    sendSuccess(res, { token, user: { id: user.user_id, email: user.email, role: user.role, name: user.full_name } }, 'Login successful');
  } catch (error) {
    logger.error(`[Auth] Login error: ${error.message}`);
    sendError(res, 'Login failed', 500);
  }
};

// ─── 3. Logout ───────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await db.query('UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE jwt_token = ?', [token]);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    sendError(res, 'Logout failed', 500);
  }
};

// ─── 4. OTP Workflow (Send, Verify, Reset) ───────────────────────────────────
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return sendError(res, 'User not found', 404);

    const otp = await otpService.createAndStoreOtp(rows[0].user_id);
    await emailService.sendOtpEmail(email, otp);

    sendSuccess(res, null, 'OTP sent to email');
  } catch (error) {
    sendError(res, 'Failed to send OTP', 500);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [rows] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return sendError(res, 'User not found', 404);

    const isValid = await otpService.verifyOtp(rows[0].user_id, otp);
    if (!isValid) return sendError(res, 'Invalid or expired OTP', 400);

    // If verifying for registration, update status
    await db.query('UPDATE users SET email_verified = TRUE WHERE user_id = ?', [rows[0].user_id]);

    // Issue a temporary token to allow password reset or login
    const tempToken = jwt.sign({ id: rows[0].user_id, otpVerified: true }, process.env.JWT_SECRET || 'fallback', { expiresIn: '15m' });
    sendSuccess(res, { tempToken }, 'OTP verified successfully');
  } catch (error) {
    sendError(res, 'Failed to verify OTP', 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback');
    
    if (!decoded.otpVerified) return sendError(res, 'Invalid token', 403);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, decoded.id]);
    
    // Invalidate all active sessions for security
    await db.query('UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE user_id = ? AND logout_time IS NULL', [decoded.id]);

    sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    sendError(res, 'Failed to reset password', 500);
  }
};

// ─── 5. Profile Management ───────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT user_id, email, full_name, role, phone, profile_photo, language, email_verified FROM users WHERE user_id = ?', [req.user.user_id]);
    let details = {};

    if (users[0].role === 'patient') {
      const [pts] = await db.query('SELECT * FROM patients WHERE user_id = ?', [req.user.user_id]);
      details = pts[0] || {};
    } else if (users[0].role === 'doctor') {
      const [docs] = await db.query('SELECT * FROM doctors WHERE user_id = ?', [req.user.user_id]);
      details = docs[0] || {};
    }

    sendSuccess(res, { user: { ...users[0], details } }, 'Profile fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch profile', 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, language } = req.body;
    await db.query('UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), language = COALESCE(?, language) WHERE user_id = ?', 
      [fullName, phone, language, req.user.user_id]);
    sendSuccess(res, null, 'Profile updated');
  } catch (error) {
    sendError(res, 'Failed to update profile', 500);
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await db.query('UPDATE users SET status = "inactive" WHERE user_id = ?', [req.user.user_id]);
    await db.query('UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE user_id = ?', [req.user.user_id]);
    sendSuccess(res, null, 'Account deleted (deactivated)');
  } catch (error) {
    sendError(res, 'Failed to delete account', 500);
  }
};

exports.getSession = async (req, res) => {
  sendSuccess(res, { user: req.user }, 'Session active');
};
