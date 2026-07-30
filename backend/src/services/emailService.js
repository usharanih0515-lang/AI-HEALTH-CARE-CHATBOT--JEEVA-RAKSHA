/**
 * =============================================================================
 * Jeeva Raksha — Email Service (services/emailService.js)
 * =============================================================================
 * Description : Sends transactional emails (OTPs, Verification) using Nodemailer.
 *               Currently set up with a dummy/test transport. Needs real
 *               SMTP credentials in production (.env).
 * =============================================================================
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a transporter using SMTP or Ethereal for testing
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'testpass',
  },
});

/**
 * Sends an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Jeeva Raksha" <${process.env.SMTP_FROM || 'no-reply@jeevaraksha.com'}>`,
      to,
      subject,
      html,
    });
    logger.info(`[EmailService] Sent email to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`[EmailService] Failed to send email to ${to}: ${error.message}`);
    // Non-blocking error for development, return false so the caller knows it failed
    return false;
  }
};

/**
 * Sends an OTP email for verification/reset
 * @param {string} to - Recipient email
 * @param {string} otp - The OTP string
 */
const sendOtpEmail = async (to, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Jeeva Raksha Verification</h2>
      <p>Your One Time Password (OTP) is:</p>
      <h1 style="color: #4A90D9; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail(to, 'Your Jeeva Raksha Verification Code', html);
};

module.exports = {
  sendEmail,
  sendOtpEmail,
};
