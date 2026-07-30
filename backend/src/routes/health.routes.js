/**
 * =============================================================================
 * Jeeva Raksha — Health Check Routes (routes/health.routes.js)
 * =============================================================================
 * Description : Publicly accessible health check endpoint. Used by load
 *               balancers, uptime monitors, and CI pipelines to verify the
 *               server is running and the database is reachable.
 *
 * Endpoints   :
 *   GET /health           — Basic server liveness check
 *   GET /health/db        — Database connectivity check
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const express        = require('express');
const { pool }       = require('../config/database');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const router = express.Router();

/**
 * GET /health
 * Returns server status, uptime, and environment info.
 */
router.get('/', (req, res) => {
  return sendSuccess(res, 200, 'Jeeva Raksha API is running.', {
    service    : 'jeeva-raksha-backend',
    version    : process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime     : `${Math.floor(process.uptime())}s`,
    timestamp  : new Date().toISOString(),
  });
});

/**
 * GET /health/db
 * Verifies MySQL database connectivity by running a lightweight query.
 */
router.get('/db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return sendSuccess(res, 200, 'Database connection is healthy.', {
      database: process.env.DB_NAME,
      status  : 'connected',
    });
  } catch (error) {
    return sendError(res, 503, 'Database connection failed.', error.message);
  }
});

module.exports = router;
