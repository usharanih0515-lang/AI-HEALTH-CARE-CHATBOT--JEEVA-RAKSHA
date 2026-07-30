/**
 * =============================================================================
 * Jeeva Raksha — Email Input Component (components/forms/EmailInput.js)
 * =============================================================================
 * Description : React Native Paper TextInput wrapper specifically for emails,
 *               integrated with React Hook Form's Controller.
 * =============================================================================
 */
import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';

const EmailInput = ({ control, name = 'email', label = 'Email Address', placeholder = 'Enter your email' }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            label={label}
            placeholder={placeholder}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            left={<TextInput.Icon icon="email-outline" />}
          />
          {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
        </View>
      )}
    />
  );
};

export default EmailInput;
