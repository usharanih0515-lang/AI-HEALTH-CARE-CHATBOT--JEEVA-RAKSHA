/**
 * =============================================================================
 * Jeeva Raksha — MySQL Database Configuration (config/database.js)
 * =============================================================================
 * Description : Creates and exports a mysql2 connection pool for efficient,
 *               reusable database connections throughout the application.
 *               Provides a helper function to verify connectivity on startup.
 *
 * Usage       :
 *   const { pool, connectDB } = require('./config/database');
 *   const [rows] = await pool.execute('SELECT 1');
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const mysql  = require('mysql2/promise');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────────────────────
// Build MySQL Connection Pool
// Uses environment variables for all credentials (never hardcode credentials).
// ─────────────────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host              : process.env.DB_HOST             || 'localhost',
  port              : parseInt(process.env.DB_PORT    || '3306', 10),
  user              : process.env.DB_USER             || 'root',
  password          : process.env.DB_PASSWORD         || '',
  database          : process.env.DB_NAME             || 'jeeva_raksha',
  connectionLimit   : parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit        : parseInt(process.env.DB_QUEUE_LIMIT      || '0',  10),
  waitForConnections: true,

  // Enable timezone-aware date handling (store/retrieve UTC)
  timezone          : '+00:00',

  // MySQL supports multiple statements per query — disabled for security
  multipleStatements: false,

  // Use named placeholders instead of positional ? for readability
  namedPlaceholders : false,

  // Automatically re-connect if the connection drops
  enableKeepAlive   : true,
  keepAliveInitialDelay: 0,
});

/**
 * connectDB — Verifies the MySQL connection pool is working.
 * Called once during server startup to fail fast if DB is unavailable.
 *
 * @returns {Promise<void>}
 * @throws  {Error} If the connection test fails
 */
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info(`[Database] ✅ Connected to MySQL: "${process.env.DB_NAME}"`);
    connection.release();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('[Database] ⚠️  MySQL not connected (running without DB). Set DB_PASSWORD in .env');
      logger.warn(`[Database]    Error: ${error.message}`);
      // Non-fatal in development — server still boots, DB-dependent routes return 503
    } else {
      logger.error('[Database] ❌ Connection failed:', error.message);
      process.exit(1); // Fatal in production
    }
  }
};


/**
 * executeQuery — A convenience wrapper around pool.execute().
 * Logs the query in development mode for debugging.
 *
 * @param {string}  sql    - SQL query string with placeholders
 * @param {Array}   params - Array of values to bind to placeholders
 * @returns {Promise<Array>} - [rows, fields] from mysql2
 */
const executeQuery = async (sql, params = []) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`[Database] Query: ${sql.trim()} | Params: ${JSON.stringify(params)}`);
    }
    const [rows, fields] = await pool.execute(sql, params);
    return [rows, fields];
  } catch (error) {
    logger.error(`[Database] Query Error: ${error.message} | SQL: ${sql}`);
    throw error;
  }
};

module.exports = { pool, connectDB, executeQuery };
