/**
 * =============================================================================
 * Jeeva Raksha — Reusable Header Component (components/common/Header.js)
 * =============================================================================
 * Description : App screen header with optional back button, title,
 *               subtitle, and right-side action slot.
 *
 * Props       :
 *   title      {string}   — Primary header title
 *   subtitle   {string}   — Optional subtitle below the title
 *   showBack   {boolean}  — Show a back button (default: false)
 *   onBack     {function} — Handler for back button press
 *   rightAction {element} — Optional element on the right side (e.g., icon button)
 *
 * Usage       :
 *   <Header title="My Profile" showBack onBack={() => navigation.goBack()} />
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

/**
 * Header — Screen header component with back navigation and action slot.
 */
const Header = ({
  title,
  subtitle,
  showBack    = false,
  onBack,
  rightAction = null,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

      {/* Back Button */}
      <View style={styles.leftSlot}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {/* Arrow ← using unicode; replace with an Icon component for production */}
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Title Block */}
      <View style={styles.titleBlock}>
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Action Slot */}
      <View style={styles.rightSlot}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection  : 'row',
    alignItems     : 'center',
    backgroundColor: COLORS.surface,
    paddingBottom  : SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSlot: {
    width: 44,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize  : FONT_SIZES.xl,
    color     : COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  titleBlock: {
    flex     : 1,
    alignItems: 'center',
  },
  title: {
    fontSize  : FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color     : COLORS.textPrimary,
  },
  subtitle: {
    fontSize  : FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color     : COLORS.textSecondary,
    marginTop : 2,
  },
  rightSlot: {
    width     : 44,
    alignItems: 'flex-end',
  },
});

export default Header;
