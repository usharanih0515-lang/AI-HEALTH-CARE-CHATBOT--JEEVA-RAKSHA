/**
 * =============================================================================
 * Jeeva Raksha — 404 Not Found Middleware (middleware/notFound.js)
 * =============================================================================
 * Description : Catches requests to routes that are not defined in the app
 *               and returns a standardised 404 JSON response.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const logger        = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

/**
 * notFound — Middleware for unhandled routes.
 *
 * @type {import('express').RequestHandler}
 */
const notFound = (req, res) => {
  logger.warn(`[404] Not Found: ${req.method} ${req.originalUrl}`);
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = { notFound };
