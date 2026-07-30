/**
 * =============================================================================
 * Jeeva Raksha — Winston Logger Utility (utils/logger.js)
 * =============================================================================
 * Description : Centralised application logger built with Winston.
 *               Logs to the console in development and to rotating log files
 *               in production. All log levels (error, warn, info, http, debug)
 *               are supported.
 *
 * Usage       :
 *   const logger = require('./utils/logger');
 *   logger.info('Server started');
 *   logger.error('Something went wrong', error);
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs   = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// Ensure the log directory exists
// ─────────────────────────────────────────────────────────────────────────────
const LOG_DIR = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Log Format Definitions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * consoleFormat — Colourised, human-readable format for development.
 * Includes timestamp, log level, and message.
 */
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

/**
 * fileFormat — Structured JSON format for log files.
 * Machine-readable and compatible with log aggregation tools (e.g., ELK Stack).
 */
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  format.errors({ stack: true }),
  format.json(),
);

// ─────────────────────────────────────────────────────────────────────────────
// Winston Logger Instance
// ─────────────────────────────────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',

  transports: [
    // ── Console Transport ──────────────────────────────────────────────────
    new transports.Console({
      format: consoleFormat,
      silent: process.env.NODE_ENV === 'test', // Silence logs during tests
    }),

    // ── Error Log File (rotating daily) ────────────────────────────────────
    new transports.DailyRotateFile({
      filename    : path.join(LOG_DIR, 'error-%DATE%.log'),
      datePattern : 'YYYY-MM-DD',
      level       : 'error',
      format      : fileFormat,
      maxSize     : '20m',   // Rotate after 20 MB
      maxFiles    : '14d',   // Keep logs for 14 days
      zippedArchive: true,
    }),

    // ── Combined Log File (all levels, rotating daily) ─────────────────────
    new transports.DailyRotateFile({
      filename    : path.join(LOG_DIR, 'combined-%DATE%.log'),
      datePattern : 'YYYY-MM-DD',
      format      : fileFormat,
      maxSize     : '20m',
      maxFiles    : '14d',
      zippedArchive: true,
    }),
  ],

  // Capture unhandled exceptions and unhandled promise rejections
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename    : path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern : 'YYYY-MM-DD',
      format      : fileFormat,
      maxSize     : '20m',
      maxFiles    : '30d',
    }),
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename    : path.join(LOG_DIR, 'rejections-%DATE%.log'),
      datePattern : 'YYYY-MM-DD',
      format      : fileFormat,
      maxSize     : '20m',
      maxFiles    : '30d',
    }),
  ],
});

module.exports = logger;
