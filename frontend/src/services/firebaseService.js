/**
 * =============================================================================
 * Jeeva Raksha — Firebase Service (services/firebaseService.js)
 * =============================================================================
 * Description : Encapsulates all Firebase Authentication operations.
 *               Provides a clean, reusable interface for auth actions
 *               so screens and components are not coupled to the Firebase SDK.
 *
 * Usage       :
 *   import FirebaseService from '../services/firebaseService';
 *   await FirebaseService.signIn(email, password);
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import auth from '@react-native-firebase/auth';

/**
 * FirebaseService — Static class wrapping Firebase Auth operations.
 * All methods return a Promise and may throw on failure.
 */
const FirebaseService = {
  /**
   * signIn — Sign in with email and password.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('@firebase/auth').UserCredential>}
   */
  signIn: (email, password) =>
    auth().signInWithEmailAndPassword(email.trim().toLowerCase(), password),

  /**
   * register — Create a new user account with email and password.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('@firebase/auth').UserCredential>}
   */
  register: (email, password) =>
    auth().createUserWithEmailAndPassword(email.trim().toLowerCase(), password),

  /**
   * signOut — Sign the current user out.
   *
   * @returns {Promise<void>}
   */
  signOut: () => auth().signOut(),

  /**
   * sendPasswordResetEmail — Send a password reset email to the given address.
   *
   * @param {string} email
   * @returns {Promise<void>}
   */
  sendPasswordResetEmail: (email) =>
    auth().sendPasswordResetEmail(email.trim().toLowerCase()),

  /**
   * getCurrentUser — Return the currently signed-in Firebase user.
   *
   * @returns {import('@firebase/auth').User | null}
   */
  getCurrentUser: () => auth().currentUser,

  /**
   * getIdToken — Get the current user's ID token for backend API calls.
   *
   * @param {boolean} [forceRefresh=false] - Force a fresh token from Firebase
   * @returns {Promise<string | null>}
   */
  getIdToken: async (forceRefresh = false) => {
    const user = auth().currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  },

  /**
   * updateDisplayName — Update the current user's display name in Firebase.
   *
   * @param {string} displayName
   * @returns {Promise<void>}
   */
  updateDisplayName: (displayName) => {
    const user = auth().currentUser;
    if (!user) throw new Error('No user is currently signed in.');
    return user.updateProfile({ displayName });
  },

  /**
   * onAuthStateChanged — Subscribe to authentication state changes.
   * Returns the unsubscribe function.
   *
   * @param {function} callback - Called with (user) when auth state changes
   * @returns {function} unsubscribe
   */
  onAuthStateChanged: (callback) => auth().onAuthStateChanged(callback),
};

export default FirebaseService;
