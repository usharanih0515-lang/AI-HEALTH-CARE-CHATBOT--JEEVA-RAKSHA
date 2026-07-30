/**
 * =============================================================================
 * Jeeva Raksha — Express Application Configuration (app.js)
 * =============================================================================
 * Description : Configures and exports the Express application instance.
 *               Registers all middleware, route groups, and error handlers.
 *               Keeps server.js clean — concerns are separated here.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const compression    = require('compression');
const rateLimit      = require('express-rate-limit');

const logger              = require('./utils/logger');
const { errorHandler }    = require('./middleware/errorHandler');
const { notFound }        = require('./middleware/notFound');

// ─── Route Imports ────────────────────────────────────────────────────────────
const healthRoutes  = require('./routes/health.routes');
const authRoutes    = require('./routes/auth.routes');
const userRoutes    = require('./routes/user.routes');

// ─────────────────────────────────────────────────────────────────────────────
// Initialise Express App
// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helmet sets security-related HTTP headers to protect from common attacks
 * (XSS, clickjacking, MIME sniffing, etc.)
 */
app.use(helmet());

/**
 * CORS — Cross-Origin Resource Sharing configuration.
 * Controls which origins are allowed to access this API.
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
};
app.use(cors(corsOptions));

/**
 * Rate limiting — prevents brute-force and DDoS attacks.
 * Limits each IP to MAX_REQUESTS per WINDOW_MS milliseconds.
 */
const limiter = rateLimit({
  windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS  || '900000', 10),
  max      : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders  : false,
  message: {
    status : 429,
    message: 'Too many requests. Please try again later.',
  },
});
app.use('/api', limiter);

// ─────────────────────────────────────────────────────────────────────────────
// General Middleware
// ─────────────────────────────────────────────────────────────────────────────

/** Parse incoming JSON request bodies (max 10mb) */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded request bodies (form submissions) */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/** Compress response bodies for improved performance */
app.use(compression());

/**
 * HTTP request logger using Morgan.
 * In production, logs a concise format; in development, uses colorised 'dev'.
 */
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Health check route — publicly accessible, no auth required.
 * Used by load balancers and monitoring systems.
 */
app.use('/health', healthRoutes);

/**
 * API Version 1 Routes
 * All business logic routes are namespaced under /api/v1
 */
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/users', userRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling Middleware (must be registered LAST)
// ─────────────────────────────────────────────────────────────────────────────

/** Handle requests to routes that don't exist */
app.use(notFound);

/** Global error handler — catches errors passed via next(err) */
app.use(errorHandler);

module.exports = app;
