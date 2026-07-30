/**
 * =============================================================================
 * Jeeva Raksha — Loader / Activity Indicator Component (components/common/Loader.js)
 * =============================================================================
 * Description : Full-screen and inline loading indicator components.
 *               - FullScreenLoader : Covers the entire screen with a semi-
 *                                    transparent overlay and a spinner.
 *               - InlineLoader     : A small spinner for embedding in views.
 *
 * Usage       :
 *   import { FullScreenLoader, InlineLoader } from '../components/common/Loader';
 *   {isLoading && <FullScreenLoader message="Please wait..." />}
 *   <InlineLoader size="small" />
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';

/**
 * FullScreenLoader — Displays a modal overlay with a loading spinner.
 * Prevents user interaction while loading is in progress.
 *
 * @param {object} props
 * @param {string} [props.message] — Optional message shown below the spinner
 */
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <Modal transparent animationType="fade" visible statusBarTranslucent>
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </View>
  </Modal>
);

/**
 * InlineLoader — Small spinner for inline use within screens.
 *
 * @param {object} props
 * @param {'small'|'large'} [props.size]  — Spinner size
 * @param {string}          [props.color] — Spinner colour
 */
export const InlineLoader = ({ size = 'small', color = COLORS.primary }) => (
  <View style={styles.inline}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex           : 1,
    backgroundColor: COLORS.overlay,
    justifyContent : 'center',
    alignItems     : 'center',
  },
  loaderBox: {
    backgroundColor: COLORS.surface,
    borderRadius   : RADIUS.lg,
    padding        : SPACING.xl,
    alignItems     : 'center',
    minWidth       : 140,
  },
  message: {
    marginTop : SPACING.md,
    fontSize  : FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    color     : COLORS.textSecondary,
    textAlign : 'center',
  },
  inline: {
    justifyContent: 'center',
    alignItems    : 'center',
    padding       : SPACING.sm,
  },
});
