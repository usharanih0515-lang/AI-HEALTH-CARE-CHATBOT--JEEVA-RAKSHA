/**
 * =============================================================================
 * Jeeva Raksha — User Routes (routes/user.routes.js)
 * =============================================================================
 * Description : REST API routes for user profile management.
 *               All routes require Firebase token authentication.
 *
 * Base Path   : /api/v1/users
 * Endpoints   :
 *   GET    /api/v1/users/me           — Get own profile
 *   PUT    /api/v1/users/me           — Update own profile
 *   DELETE /api/v1/users/me           — Delete own account
 *   GET    /api/v1/users/:id          — Get user by ID (admin only)
 *   GET    /api/v1/users              — List all users (admin only)
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const express              = require('express');
const { authenticate, authorizeRoles } = require('../middleware/authenticate');
const userController        = require('../controllers/user.controller');

const router = express.Router();

// ── All routes below require a valid Firebase token ──────────────────────────
router.use(authenticate);

/**
 * GET /api/v1/users/me
 * Returns the currently authenticated user's full profile from MySQL.
 */
router.get('/me', userController.getMyProfile);

/**
 * PUT /api/v1/users/me
 * Updates the authenticated user's profile fields.
 * Body: { fullName?, phone?, dateOfBirth?, gender?, language?, profilePhoto? }
 */
router.put('/me', userController.updateMyProfile);

/**
 * DELETE /api/v1/users/me
 * Soft-deletes the authenticated user's account (sets is_active = 0).
 */
router.delete('/me', userController.deleteMyAccount);

/**
 * GET /api/v1/users
 * Returns a paginated list of all users. Admin only.
 * Query params: ?page=1&limit=20&role=patient
 */
router.get('/', authorizeRoles('admin'), userController.listUsers);

/**
 * GET /api/v1/users/:id
 * Returns a specific user by their MySQL ID. Admin only.
 */
router.get('/:id', authorizeRoles('admin'), userController.getUserById);

module.exports = router;
