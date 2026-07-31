/**
 * =============================================================================
 * Jeeva Raksha — OTP Service (services/otpService.js)
 * =============================================================================
 * Description : Handles generating, hashing, storing, and verifying OTPs.
 * =============================================================================
 */

const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Generates a numeric OTP
 * @param {number} length - Length of OTP
 */
const generateOtp = (length = 6) => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
};

/**
 * Creates and stores an OTP for a user
 * @param {number} userId - The ID of the user
 * @returns {string} The plain OTP string (to send via email)
 */
const createAndStoreOtp = async (userId) => {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  
  // Set expiry to 10 minutes from now
  const expiry = new Date(Date.now() + 10 * 60000);

  // Invalidate any existing unverified OTPs for this user
  await db.pool.query(
    'UPDATE otp_verifications SET verified = 1 WHERE user_id = ? AND verified = 0',
    [userId]
  );

  // Store new OTP
  await db.pool.query(
    'INSERT INTO otp_verifications (user_id, otp, expiry) VALUES (?, ?, ?)',
    [userId, hashedOtp, expiry]
  );

  logger.info(`[OtpService] Created OTP for user ${userId}`);
  return otp;
};

/**
 * Verifies a submitted OTP against the database
 * @param {number} userId - User ID
 * @param {string} submittedOtp - The OTP entered by user
 * @returns {boolean} - True if valid, false otherwise
 */
const verifyOtp = async (userId, submittedOtp) => {
  const [rows] = await db.pool.query(
    'SELECT * FROM otp_verifications WHERE user_id = ? AND verified = 0 AND expiry > NOW() ORDER BY created_at DESC LIMIT 1',
    [userId]
  );

  if (!rows || rows.length === 0) {
    return false; // No valid active OTP found
  }

  const record = rows[0];
  const isValid = await bcrypt.compare(submittedOtp, record.otp);

  if (isValid) {
    // Mark as verified so it can't be used again
    await db.pool.query('UPDATE otp_verifications SET verified = 1 WHERE otp_id = ?', [record.otp_id]);
    return true;
  }

  return false;
};

module.exports = {
  generateOtp,
  createAndStoreOtp,
  verifyOtp,
};
