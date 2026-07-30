/**
 * =============================================================================
 * Jeeva Raksha — Loading Button Component (components/forms/LoadingButton.js)
 * =============================================================================
 * Description : Reusable React Native Paper Button with loading state handling.
 * =============================================================================
 */
import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const LoadingButton = ({
  mode = 'contained',
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  icon,
  ...props
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[styles.button, style]}
      contentStyle={styles.content}
      icon={icon}
      {...props}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  content: {
    paddingVertical: 6,
  },
});

export default LoadingButton;
