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
  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();
    const {
      firebaseToken, fullName, email, password, phone, gender, dob, language,
      address, emergencyContact, bloodGroup, height, weight, allergies, medicalHistory
    } = req.body;

    // Verify Firebase token to get UID
    let firebaseUid;
    if (firebaseToken === 'TEST_TOKEN_PATIENT' && process.env.NODE_ENV !== 'production') {
      firebaseUid = 'test-uid-' + Date.now();
    } else {
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      firebaseUid = decodedToken.uid;
    }

    // Check if user already exists
    const [existing] = await connection.query('SELECT user_id FROM users WHERE email = ? OR firebase_uid = ?', [email, firebaseUid]);
    if (existing.length > 0) return sendError(res, 400, 'User already exists');

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
    sendSuccess(res, 201, 'Registration successful. Verify email with OTP.', { token, user: { id: userId, email, role: 'patient' } });
  } catch (error) {
    await connection.rollback();
    logger.error(`[Auth] Register error: ${error.message}`);
    sendError(res, 500, error.message);
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
      if (firebaseToken === 'TEST_TOKEN_PATIENT' && process.env.NODE_ENV !== 'production') {
        const [rows] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email || 'test@example.com']);
        user = rows[0];
      } else {
        const decoded = await admin.auth().verifyIdToken(firebaseToken);
        const [rows] = await db.pool.query('SELECT * FROM users WHERE firebase_uid = ?', [decoded.uid]);
        user = rows[0];
      }
    } else if (email && password) {
      const [rows] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
      user = rows[0];
      if (user && !(await bcrypt.compare(password, user.password_hash))) user = null;
    }

    if (!user) return sendError(res, 401, 'Invalid credentials');
    if (user.status === 'suspended') return sendError(res, 403, 'Account suspended');

    const token = generateToken(user.user_id, user.role);

    // Record session
    await db.pool.query('INSERT INTO user_sessions (user_id, jwt_token, device) VALUES (?, ?, ?)', [user.user_id, token, device || 'Unknown']);

    sendSuccess(res, 200, 'Login successful', { token, user: { id: user.user_id, email: user.email, role: user.role, name: user.full_name } });
  } catch (error) {
    logger.error(`[Auth] Login error: ${error.message}`);
    sendError(res, 500, 'Login failed');
  }
};

// ─── 3. Logout ───────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await db.pool.query('UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE jwt_token = ?', [token]);
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    sendError(res, 500, 'Logout failed');
  }
};

// ─── 4. OTP Workflow (Send, Verify, Reset) ───────────────────────────────────
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await db.pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return sendError(res, 404, 'User not found');

    const otp = await otpService.createAndStoreOtp(rows[0].user_id);
    await emailService.sendOtpEmail(email, otp);

    sendSuccess(res, 200, 'OTP sent to email');
  } catch (error) {
    sendError(res, 500, 'Failed to send OTP');
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [rows] = await db.pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return sendError(res, 404, 'User not found');

    const isValid = await otpService.verifyOtp(rows[0].user_id, otp);
    if (!isValid) return sendError(res, 400, 'Invalid or expired OTP');

    // If verifying for registration, update status
    await db.pool.query('UPDATE users SET email_verified = TRUE WHERE user_id = ?', [rows[0].user_id]);

    // Issue a temporary token to allow password reset or login
    const tempToken = jwt.sign({ id: rows[0].user_id, otpVerified: true }, process.env.JWT_SECRET || 'fallback', { expiresIn: '15m' });
    sendSuccess(res, 200, 'OTP verified successfully', { tempToken });
  } catch (error) {
    sendError(res, 500, 'Failed to verify OTP');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback');
    
    if (!decoded.otpVerified) return sendError(res, 403, 'Invalid token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, decoded.id]);
    
    // Invalidate all active sessions for security
    await db.pool.query('UPDATE user_sessions SET logout_time = CURRENT_TIMESTAMP WHERE user_id = ? AND logout_time IS NULL', [decoded.id]);

    sendSuccess(res, 200, 'Password reset successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to reset password');
  }
};

exports.getSession = async (req, res) => {
  sendSuccess(res, 200, 'Session active', { user: req.user });
};
