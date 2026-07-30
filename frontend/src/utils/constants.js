/**
 * =============================================================================
 * Jeeva Raksha — Constants (utils/constants.js)
 * =============================================================================
 * Description : Centralized constants for roles, async storage keys, and enums.
 * =============================================================================
 */

export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_INFO: '@user_info',
  APP_LANGUAGE: '@app_language',
  HAS_SEEN_ONBOARDING: '@has_seen_onboarding',
};

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
];
