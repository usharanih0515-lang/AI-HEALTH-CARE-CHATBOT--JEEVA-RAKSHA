/**
 * =============================================================================
 * Jeeva Raksha — User Controller (controllers/user.controller.js)
 * =============================================================================
 * Description : Handles user profile CRUD operations.
 *               All methods expect `authenticate` middleware to have run first,
 *               so req.user contains the current user's MySQL record.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const { executeQuery }      = require('../config/database');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');
const logger                = require('../utils/logger');

/**
 * getMyProfile — Return the authenticated user's full profile.
 *
 * @type {import('express').RequestHandler}
 */
const getMyProfile = async (req, res) => {
  try {
    const [rows] = await executeQuery(
      `SELECT id, firebase_uid, full_name, email, phone, date_of_birth,
              gender, language, profile_photo, role, is_active, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return sendError(res, 404, 'User not found.');
    }

    return sendSuccess(res, 200, 'Profile fetched successfully.', { user: rows[0] });
  } catch (error) {
    logger.error('[User] getMyProfile error:', error);
    return sendError(res, 500, 'Failed to fetch profile.');
  }
};

/**
 * updateMyProfile — Update the authenticated user's editable profile fields.
 * Only whitelisted fields are updated; SQL injection is prevented by parameterised queries.
 *
 * @type {import('express').RequestHandler}
 */
const updateMyProfile = async (req, res) => {
  try {
    const allowed = ['full_name', 'phone', 'date_of_birth', 'gender', 'language', 'profile_photo'];

    // Build a dynamic SET clause from only the allowed fields present in the body
    const updates = [];
    const values  = [];

    for (const field of allowed) {
      // Convert camelCase body fields to snake_case DB column names
      const bodyKey = field.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      if (req.body[bodyKey] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[bodyKey]);
      }
    }

    if (updates.length === 0) {
      return sendError(res, 400, 'No valid fields to update.');
    }

    values.push(req.user.id);
    await executeQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    logger.info(`[User] Profile updated for user ID: ${req.user.id}`);
    return sendSuccess(res, 200, 'Profile updated successfully.');
  } catch (error) {
    logger.error('[User] updateMyProfile error:', error);
    return sendError(res, 500, 'Failed to update profile.');
  }
};

/**
 * deleteMyAccount — Soft-delete the authenticated user's account.
 * Sets is_active = 0 rather than removing the row to preserve data integrity.
 *
 * @type {import('express').RequestHandler}
 */
const deleteMyAccount = async (req, res) => {
  try {
    await executeQuery('UPDATE users SET is_active = 0 WHERE id = ?', [req.user.id]);
    logger.info(`[User] Account deactivated for user ID: ${req.user.id}`);
    return sendSuccess(res, 200, 'Account deactivated successfully.');
  } catch (error) {
    logger.error('[User] deleteMyAccount error:', error);
    return sendError(res, 500, 'Failed to deactivate account.');
  }
};

/**
 * listUsers — Return a paginated list of all users. Admin only.
 * Query params: ?page=1&limit=20&role=patient
 *
 * @type {import('express').RequestHandler}
 */
const listUsers = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
    const role  = req.query.role;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params    = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    // Count total matching records
    const [countRows] = await executeQuery(
      `SELECT COUNT(*) AS total FROM users ${whereClause}`,
      params,
    );
    const total      = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch the page
    const [rows] = await executeQuery(
      `SELECT id, full_name, email, phone, role, language, is_active, created_at
       FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return sendPaginated(res, rows, { page, limit, total, totalPages }, 'Users fetched.');
  } catch (error) {
    logger.error('[User] listUsers error:', error);
    return sendError(res, 500, 'Failed to fetch users.');
  }
};

/**
 * getUserById — Return a specific user by MySQL ID. Admin only.
 *
 * @type {import('express').RequestHandler}
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return sendError(res, 400, 'Invalid user ID.');
    }

    const [rows] = await executeQuery(
      'SELECT id, firebase_uid, full_name, email, phone, role, language, is_active, created_at FROM users WHERE id = ?',
      [id],
    );

    if (rows.length === 0) {
      return sendError(res, 404, 'User not found.');
    }

    return sendSuccess(res, 200, 'User fetched.', { user: rows[0] });
  } catch (error) {
    logger.error('[User] getUserById error:', error);
    return sendError(res, 500, 'Failed to fetch user.');
  }
};

module.exports = { getMyProfile, updateMyProfile, deleteMyAccount, listUsers, getUserById };
