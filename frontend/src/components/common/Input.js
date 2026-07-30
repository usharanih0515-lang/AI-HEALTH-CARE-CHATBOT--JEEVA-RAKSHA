/**
 * =============================================================================
 * Jeeva Raksha — Reusable Input Component (components/common/Input.js)
 * =============================================================================
 * Description : Accessible, styled text input with label, error message,
 *               left/right icon support, and password toggle functionality.
 *
 * Props       :
 *   label       {string}   — Label displayed above the input
 *   error       {string}   — Validation error message (shown in red below)
 *   leftIcon    {element}  — Icon element rendered on the left side
 *   rightIcon   {element}  — Icon element rendered on the right side
 *   isPassword  {boolean}  — Adds eye-toggle for password visibility
 *   style       {object}   — Additional container style
 *   ...rest                — Any TextInput props (value, onChangeText, etc.)
 *
 * Usage       :
 *   <Input
 *     label="Email"
 *     placeholder="Enter your email"
 *     value={email}
 *     onChangeText={setEmail}
 *     error={emailError}
 *     keyboardType="email-address"
 *   />
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';

/**
 * Input — Reusable form input component.
 */
const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword  = false,
  style,
  containerStyle,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused]                 = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error     && styles.errorBorder,
        style,
      ]}>
        {/* Left Icon */}
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            leftIcon  && { paddingLeft: 0 },
            rightIcon && { paddingRight: 0 },
          ]}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label}
          {...rest}
        />

        {/* Right Icon or Password Toggle */}
        {isPassword ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={togglePasswordVisibility}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {/* Replace with an actual Eye icon from react-native-vector-icons */}
            <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
              {isPasswordVisible ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize    : FONT_SIZES.sm,
    fontFamily  : FONTS.medium,
    color       : COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  labelError: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection  : 'row',
    alignItems     : 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius   : RADIUS.md,
    borderWidth    : 1.5,
    borderColor    : COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  focused: {
    borderColor: COLORS.primary,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  input: {
    flex      : 1,
    height    : 52,
    fontSize  : FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color     : COLORS.textPrimary,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    fontSize  : FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color     : COLORS.error,
    marginTop : SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default Input;
