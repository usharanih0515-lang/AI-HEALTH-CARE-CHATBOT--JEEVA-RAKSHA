/**
 * =============================================================================
 * Jeeva Raksha — Firebase Admin SDK Configuration (config/firebase.js)
 * =============================================================================
 * Description : Initialises the Firebase Admin SDK once (singleton pattern).
 *               Used server-side to verify Firebase ID tokens issued by the
 *               React Native frontend, and to manage Firebase users.
 *
 * Usage       :
 *   const { admin, auth } = require('./config/firebase');
 *   const decodedToken = await auth.verifyIdToken(idToken);
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

'use strict';

const admin  = require('firebase-admin');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────────────────────
// Guard: Only initialise Firebase Admin once (singleton).
// If the app is already initialised (e.g., hot reload), skip re-initialisation.
// ─────────────────────────────────────────────────────────────────────────────
// ─── Detect placeholder / missing credentials ─────────────────────────────────
const projectId    = process.env.FIREBASE_PROJECT_ID    || '';
const clientEmail  = process.env.FIREBASE_CLIENT_EMAIL  || '';
const privateKey   = (process.env.FIREBASE_PRIVATE_KEY  || '').replace(/\\n/g, '\n');

const isConfigured =
  projectId   && !projectId.includes('your-firebase') &&
  clientEmail && !clientEmail.includes('your-project') &&
  privateKey  && privateKey.includes('BEGIN PRIVATE KEY');

if (!admin.apps.length) {
  if (!isConfigured) {
    /**
     * ── Development Fallback ──────────────────────────────────────────────────
     * Firebase credentials are not set (still using placeholder values).
     * In development the server will boot successfully but Firebase-dependent
     * routes (Google login, token verification) will return a 503 error.
     * 
     * ➜ Fill in FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
     *   in backend/.env with your real Firebase service account credentials.
     * ─────────────────────────────────────────────────────────────────────────
     */
    logger.warn('[Firebase] ⚠️  Credentials not configured. Firebase features disabled.');
    logger.warn('[Firebase] Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      logger.info('[Firebase] ✅ Admin SDK initialised successfully.');
    } catch (error) {
      logger.error('[Firebase] Failed to initialise Admin SDK:', error.message);
      // Non-fatal: server continues booting, Firebase routes return 503
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Export Firebase Admin services
// ─────────────────────────────────────────────────────────────────────────────

/** firebase-admin root instance (null if not configured) */
const firebaseAdmin = admin.apps.length ? admin : null;

/** Firebase Authentication service (null if not configured) */
const firebaseAuth  = admin.apps.length ? admin.auth() : null;

module.exports = {
  admin  : firebaseAdmin,
  auth   : firebaseAuth,
  isConfigured: !!admin.apps.length,
};
