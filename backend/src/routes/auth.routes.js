/**
 * =============================================================================
 * Jeeva Raksha — Auth Routes (routes/auth.routes.js)
 * =============================================================================
 * Description : Registers all authentication related endpoints and validates
 *               input bodies using express-validator.
 * =============================================================================
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authenticate');
const { sendError } = require('../utils/apiResponse');

// Middleware to check validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, errors.array()[0].msg);
  }
  next();
};

// ─── Validation Schemas ──────────────────────────────────────────────────────
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('firebaseToken').notEmpty().withMessage('Firebase token is required'),
];

const loginValidation = [
  body('email').optional().isEmail().withMessage('Valid email required if no firebase token'),
];

const otpValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

// ─── Public Routes ───────────────────────────────────────────────────────────
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/google', authController.login); // Same endpoint handles Firebase token
router.post('/forgot-password', authController.sendOtp);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', otpValidation, validateRequest, authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// ─── Protected Routes (Requires JWT or Firebase Token) ───────────────────────
router.use(authenticate);

router.post('/logout', authController.logout);
router.get('/session', authController.getSession);
router.get('/profile', userController.getMyProfile);
router.put('/profile', userController.updateMyProfile);
router.put('/change-password', authController.resetPassword); // Assuming internal reset utilizes similar logic
router.delete('/account', userController.deleteMyAccount);

module.exports = router;
