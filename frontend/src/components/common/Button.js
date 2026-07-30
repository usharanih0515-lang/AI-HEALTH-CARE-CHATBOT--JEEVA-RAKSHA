/**
 * =============================================================================
 * Jeeva Raksha — Reusable Button Component (components/common/Button.js)
 * =============================================================================
 * Description : A highly customisable, accessible button component.
 *               Supports variants (primary, secondary, outline, ghost),
 *               sizes (sm, md, lg), loading state, and disabled state.
 *
 * Props       :
 *   title       {string}   — Button label text
 *   onPress     {function} — Press handler
 *   variant     {string}   — 'primary' | 'secondary' | 'outline' | 'ghost'
 *   size        {string}   — 'sm' | 'md' | 'lg'
 *   loading     {boolean}  — Show activity indicator
 *   disabled    {boolean}  — Disable interaction
 *   style       {object}   — Additional container styles
 *   textStyle   {object}   — Additional text styles
 *   icon        {element}  — Optional icon element rendered before the label
 *
 * Usage       :
 *   <Button title="Get Started" onPress={handlePress} variant="primary" />
 *   <Button title="Loading" loading={true} />
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../utils/theme';

// ─── Variant Style Maps ───────────────────────────────────────────────────────
const VARIANT_STYLES = {
  primary  : { container: { backgroundColor: COLORS.primary }, text: { color: '#FFF' } },
  secondary: { container: { backgroundColor: COLORS.secondary }, text: { color: '#FFF' } },
  outline  : { container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary }, text: { color: COLORS.primary } },
  ghost    : { container: { backgroundColor: 'transparent' }, text: { color: COLORS.primary } },
  danger   : { container: { backgroundColor: COLORS.error }, text: { color: '#FFF' } },
};

// ─── Size Style Maps ──────────────────────────────────────────────────────────
const SIZE_STYLES = {
  sm: { container: { paddingVertical: SPACING.xs,  paddingHorizontal: SPACING.md }, text: { fontSize: FONT_SIZES.sm } },
  md: { container: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg }, text: { fontSize: FONT_SIZES.md } },
  lg: { container: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl }, text: { fontSize: FONT_SIZES.lg } },
};

/**
 * Button — Reusable, accessible button component.
 */
const Button = ({
  title,
  onPress,
  variant    = 'primary',
  size       = 'md',
  loading    = false,
  disabled   = false,
  style,
  textStyle,
  icon,
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeStyle    = SIZE_STYLES[size]        || SIZE_STYLES.md;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        variant === 'primary' && SHADOWS.button,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : '#FFF'}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {/* Optional leading icon */}
          {icon && <View style={styles.iconWrapper}>{icon}</View>}

          <Text style={[styles.baseText, variantStyle.text, sizeStyle.text, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius  : RADIUS.md,
    alignItems    : 'center',
    justifyContent: 'center',
    flexDirection : 'row',
  },
  baseText: {
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection : 'row',
    alignItems    : 'center',
  },
  iconWrapper: {
    marginRight: SPACING.xs,
  },
});

export default Button;
