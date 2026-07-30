/**
 * =============================================================================
 * Jeeva Raksha — Global Error Handler Middleware (middleware/errorHandler.js)
 * =============================================================================
 * Description : Catches all errors propagated via next(err) throughout the
 *               application. Returns a consistent JSON error response.
 *               Masks internal error details in production to avoid leaking
 *               sensitive stack traces to clients.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const logger     = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

/**
 * errorHandler — Global Express error handling middleware.
 * Must have 4 parameters (err, req, res, next) for Express to recognise it.
 *
 * @param {Error}  err  - Error object passed via next(err)
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Determine status code — default to 500 if not set on the error
  const status = err.status || err.statusCode || 500;

  // Log the full error internally (always)
  logger.error(`[ErrorHandler] ${req.method} ${req.path} — ${status}: ${err.message}`, {
    stack  : err.stack,
    body   : req.body,
    params : req.params,
    query  : req.query,
    userId : req.user?.id || null,
  });

  // In production, don't expose internal error details to the client
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && status === 500
    ? 'An internal server error occurred. Please try again later.'
    : err.message;

  return sendError(res, status, message, isProduction ? null : err.stack);
};

/**
 * notFound — Handle requests to undefined routes.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const notFound = (req, res) => {
  logger.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = { errorHandler, notFound };
