/**
 * =============================================================================
 * Jeeva Raksha — OTP Input Component (components/forms/OtpInput.js)
 * =============================================================================
 * Description : Specific input format for the 6-digit OTP verification code.
 * =============================================================================
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';

const OtpInput = ({ control, name = 'otp', label = '6-Digit OTP Code' }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            placeholder="123456"
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            left={<TextInput.Icon icon="shield-key-outline" />}
          />
          {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
  }
});

export default OtpInput;
