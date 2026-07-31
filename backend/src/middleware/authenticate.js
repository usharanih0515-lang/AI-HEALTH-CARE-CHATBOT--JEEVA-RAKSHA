/**
 * =============================================================================
 * Jeeva Raksha — Authentication Middleware (middleware/authenticate.js)
 * =============================================================================
 * Description : Verifies JWT tokens (or Firebase tokens) and sets req.user.
 *               Includes Role-Based Access Control (RBAC) wrapper.
 * =============================================================================
 */

const jwt = require('jsonwebtoken');
const { auth: firebaseAuth } = require('../config/firebase');
const { pool } = require('../config/database');
const { sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Protect routes by verifying JWT token
 */
const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized, no token provided');
  }

  try {
    // 1. Try to verify as our internal JWT first
    let decoded;
    let userId;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      userId = decoded.id;
    } catch (err) {
      if (!firebaseAuth) throw new Error('Firebase not configured');
      const firebaseDecoded = await firebaseAuth.verifyIdToken(token);
      
      // Look up user by firebase_uid
      const [rows] = await pool.query('SELECT user_id FROM users WHERE firebase_uid = ?', [firebaseDecoded.uid]);
      if (rows.length > 0) {
        userId = rows[0].user_id;
      } else {
        throw new Error('User not registered in database');
      }
    }

    // 3. Fetch user details and attach to request
    const [users] = await pool.query('SELECT user_id, firebase_uid, role, full_name, email, status FROM users WHERE user_id = ?', [userId]);
    
    if (users.length === 0) {
      return sendError(res, 401, 'User no longer exists');
    }

    if (users[0].status === 'suspended') {
      return sendError(res, 403, 'Account suspended. Contact admin.');
    }

    req.user = users[0];
    next();
  } catch (error) {
    logger.error(`[Auth Middleware] Token failed: ${error.message}`);
    return sendError(res, 401, 'Not authorized, invalid token');
  }
};

/**
 * Role-Based Access Control Middleware
 * @param  {...string} roles - Array of allowed roles ('patient', 'doctor', 'admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Role (${req.user.role}) is not allowed to access this resource.`);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
};
