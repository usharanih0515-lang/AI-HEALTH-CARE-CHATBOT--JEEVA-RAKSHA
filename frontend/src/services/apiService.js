/**
 * =============================================================================
 * Jeeva Raksha — Axios API Service (services/apiService.js)
 * =============================================================================
 * Description : Configures and exports an Axios instance pre-configured for
 *               the Jeeva Raksha backend API. Handles:
 *               - Base URL and timeout from environment variables
 *               - Request interceptor: attaches Firebase ID token automatically
 *               - Response interceptor: normalises responses and handles errors
 *               - Token refresh: refreshes expired Firebase tokens transparently
 *
 * Usage       :
 *   import apiService from '../services/apiService';
 *   const response = await apiService.get('/users/me');
 *   const response = await apiService.post('/auth/register', { ... });
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import axios from 'axios';
import auth  from '@react-native-firebase/auth';
import Config from 'react-native-config';

// ─────────────────────────────────────────────────────────────────────────────
// Create Axios Instance
// ─────────────────────────────────────────────────────────────────────────────
const apiService = axios.create({
  baseURL        : Config.API_BASE_URL || 'http://10.0.2.2:5000/api/v1',
  timeout        : parseInt(Config.API_TIMEOUT || '15000', 10),
  headers        : {
    'Content-Type': 'application/json',
    'Accept'      : 'application/json',
    'X-App-Name'  : 'JeevaRaksha-Mobile',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Automatically attach the current user's Firebase ID token to every request.
// ─────────────────────────────────────────────────────────────────────────────
apiService.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        /**
         * getIdToken(true) — If true, forces a token refresh even if the
         * cached token is still valid. Pass false for normal use (Firebase
         * will auto-refresh when it expires — every hour).
         */
        const idToken = await currentUser.getIdToken(false);
        config.headers['Authorization'] = `Bearer ${idToken}`;
      }
    } catch (error) {
      // If token retrieval fails, proceed without the token.
      // The backend will return 401, which the response interceptor handles.
      console.warn('[API] Failed to get Firebase ID token:', error.message);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Normalise successful responses and handle errors globally.
// ─────────────────────────────────────────────────────────────────────────────
apiService.interceptors.response.use(
  /**
   * SUCCESS HANDLER (2xx responses)
   * Return just the response data (unwrap Axios's response envelope).
   */
  (response) => response.data,

  /**
   * ERROR HANDLER
   * Provide meaningful error messages extracted from the API or network layer.
   */
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // ── 401 Unauthorized — try refreshing the Firebase token once ──────────
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const currentUser = auth().currentUser;
          if (currentUser) {
            const newToken = await currentUser.getIdToken(true); // Force refresh
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiService(originalRequest); // Retry the original request
          }
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError.message);
          // Optionally: dispatch a sign-out action here
        }
      }

      // Return a structured error with the API's message
      const message = data?.message || `Request failed with status ${status}`;
      return Promise.reject(new Error(message));
    }

    // Network error (no response from server)
    if (error.request) {
      return Promise.reject(
        new Error('Network error: Unable to reach the server. Check your connection.'),
      );
    }

    // Other errors (e.g., bad request configuration)
    return Promise.reject(new Error(error.message || 'An unexpected error occurred.'));
  },
);

export default apiService;
