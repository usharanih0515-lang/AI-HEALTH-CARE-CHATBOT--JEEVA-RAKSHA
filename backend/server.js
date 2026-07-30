/**
 * =============================================================================
 * Jeeva Raksha — Express Backend Entry Point (server.js)
 * =============================================================================
 * Description : Main server file. Bootstraps the Express application,
 *               connects to MySQL, initialises Firebase Admin, and starts
 *               listening for HTTP requests.
 *
 * Author      : Jeeva Raksha Dev Team
 * Version     : 1.0.0
 * =============================================================================
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Load environment variables FIRST — before any other imports
// ─────────────────────────────────────────────────────────────────────────────
require('dotenv').config();

const http    = require('http');
const app     = require('./src/app');
const { connectDB } = require('./src/config/database');
const logger  = require('./src/utils/logger');

// ─────────────────────────────────────────────────────────────────────────────
// Environment Configuration
// ─────────────────────────────────────────────────────────────────────────────
const PORT    = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─────────────────────────────────────────────────────────────────────────────
// Create HTTP server from Express app
// ─────────────────────────────────────────────────────────────────────────────
const server = http.createServer(app);

/**
 * Gracefully shut down the server on termination signals.
 * Ensures MySQL pool is drained before process exits.
 *
 * @param {string} signal - OS signal (SIGINT / SIGTERM)
 */
const shutdown = (signal) => {
  logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('[Server] HTTP server closed.');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('[Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap: connect to DB then start the HTTP server
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  try {
    // 1. Connect to MySQL
    await connectDB();
    logger.info('[Server] MySQL connection pool established.');

    // 2. Start HTTP server
    server.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('  🏥  Jeeva Raksha — Backend API Server');
      logger.info(`  ➤  Environment : ${NODE_ENV}`);
      logger.info(`  ➤  Listening on: http://localhost:${PORT}`);
      logger.info(`  ➤  API Base    : http://localhost:${PORT}/api/v1`);
      logger.info(`  ➤  Health Check: http://localhost:${PORT}/health`);
      logger.info('═══════════════════════════════════════════════════════');
    });
  } catch (error) {
    logger.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
})();
