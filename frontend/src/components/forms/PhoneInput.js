/**
 * =============================================================================
 * Jeeva Raksha — Phone Input Component (components/forms/PhoneInput.js)
 * =============================================================================
 * Description : React Native Paper TextInput wrapper specifically for phone numbers.
 * =============================================================================
 */
import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';

const PhoneInput = ({ control, name = 'phone', label = 'Phone Number (Optional)' }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            label={label}
            placeholder="+919876543210"
            mode="outlined"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            left={<TextInput.Icon icon="phone-outline" />}
          />
          {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
        </View>
      )}
    />
  );
};

export default PhoneInput;
