/**
 * =============================================================================
 * Jeeva Raksha — Design System / Theme (utils/theme.js)
 * =============================================================================
 * Description : Centralised design tokens for the entire app.
 *               All colours, typography, spacing, and shadow values are
 *               defined here so they can be changed in one place.
 *
 *               Import what you need:
 *                 import { COLORS, FONTS, SPACING } from '../utils/theme';
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Colour Palette — Dark healthcare theme with vibrant accents
// ─────────────────────────────────────────────────────────────────────────────
export const COLORS = {
  // Brand
  primary  : '#4A90D9',  // Calm medical blue
  secondary: '#50C878',  // Health green
  accent   : '#FF6B6B',  // Alert / emergency red-coral

  // Backgrounds
  background: '#0f0e17',  // Deep dark background
  surface   : '#1a1a2e',  // Card / panel background
  surfaceAlt: '#16213e',  // Alternate surface (slightly lighter)

  // Text
  textPrimary: '#FFFFFE',  // High-contrast white
  textSecondary: '#A7A9BE', // Muted secondary text
  textMuted   : '#6B7280',  // Very muted / placeholder

  // Borders
  border    : '#2a2a4a',  // Subtle border colour

  // Status Colours
  success : '#50C878',
  warning : '#F59E0B',
  error   : '#EF4444',
  info    : '#3B82F6',

  // Transparency helpers
  overlay   : 'rgba(0, 0, 0, 0.6)',
  cardShadow: 'rgba(74, 144, 217, 0.15)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Typography — Font family names
// Ensure these fonts are installed and linked in your project.
// Using Inter from Google Fonts is recommended.
// ─────────────────────────────────────────────────────────────────────────────
export const FONTS = {
  regular  : 'Inter-Regular',
  medium   : 'Inter-Medium',
  semiBold : 'Inter-SemiBold',
  bold     : 'Inter-Bold',
  light    : 'Inter-Light',
};

// ─────────────────────────────────────────────────────────────────────────────
// Font Sizes — Modular type scale
// ─────────────────────────────────────────────────────────────────────────────
export const FONT_SIZES = {
  xs  : 11,
  sm  : 13,
  md  : 15,
  lg  : 17,
  xl  : 20,
  xxl : 24,
  h1  : 32,
  h2  : 28,
  h3  : 22,
};

// ─────────────────────────────────────────────────────────────────────────────
// Spacing — 4-point grid system
// ─────────────────────────────────────────────────────────────────────────────
export const SPACING = {
  xs  : 4,
  sm  : 8,
  md  : 16,
  lg  : 24,
  xl  : 32,
  xxl : 48,
};

// ─────────────────────────────────────────────────────────────────────────────
// Border Radius
// ─────────────────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm  : 6,
  md  : 12,
  lg  : 20,
  xl  : 28,
  full: 9999,
};

// ─────────────────────────────────────────────────────────────────────────────
// Shadow Presets (for cards and elevated elements)
// ─────────────────────────────────────────────────────────────────────────────
export const SHADOWS = StyleSheet.create({
  card: {
    shadowColor  : '#000',
    shadowOffset : { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius : 8,
    elevation    : 6,
  },
  button: {
    shadowColor  : COLORS.primary,
    shadowOffset : { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius : 8,
    elevation    : 8,
  },
});
