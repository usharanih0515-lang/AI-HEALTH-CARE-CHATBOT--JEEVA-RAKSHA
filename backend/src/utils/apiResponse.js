/**
 * =============================================================================
 * Jeeva Raksha — API Response Helper (utils/apiResponse.js)
 * =============================================================================
 * Description : Standardises all API responses across the application.
 *               Ensures every response follows a consistent JSON envelope:
 *               { success, message, data, meta, error }.
 *
 * Usage       :
 *   const { sendSuccess, sendError } = require('../utils/apiResponse');
 *   sendSuccess(res, 200, 'User fetched', { user });
 *   sendError(res, 404, 'User not found');
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

/**
 * sendSuccess — Send a successful JSON response.
 *
 * @param {import('express').Response} res      - Express response object
 * @param {number}                     status   - HTTP status code (e.g., 200, 201)
 * @param {string}                     message  - Human-readable success message
 * @param {*}                          [data]   - Response payload (object, array, etc.)
 * @param {object}                     [meta]   - Optional metadata (pagination, totals)
 */
const sendSuccess = (res, status = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(response);
};

/**
 * sendError — Send a standardised error JSON response.
 *
 * @param {import('express').Response} res      - Express response object
 * @param {number}                     status   - HTTP status code (e.g., 400, 404, 500)
 * @param {string}                     message  - Human-readable error message
 * @param {*}                          [errors] - Optional detailed error info (validation errors)
 */
const sendError = (res, status = 500, message = 'An error occurred', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(response);
};

/**
 * sendPaginated — Send a paginated list response.
 *
 * @param {import('express').Response} res       - Express response object
 * @param {Array}                      data      - Array of items for the current page
 * @param {object}                     pagination - { page, limit, total, totalPages }
 * @param {string}                     [message] - Optional message
 */
const sendPaginated = (res, data, pagination, message = 'Data fetched successfully') => {
  return sendSuccess(res, 200, message, data, { pagination });
};

module.exports = { sendSuccess, sendError, sendPaginated };
