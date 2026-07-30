/**
 * =============================================================================
 * Jeeva Raksha — Password Input Component (components/forms/PasswordInput.js)
 * =============================================================================
 * Description : React Native Paper TextInput for passwords with toggle visibility,
 *               integrated with React Hook Form.
 * =============================================================================
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';

const PasswordInput = ({ control, name = 'password', label = 'Password' }) => {
  const [secureText, setSecureText] = useState(true);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            label={label}
            mode="outlined"
            secureTextEntry={secureText}
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={secureText ? 'eye-off' : 'eye'}
                onPress={() => setSecureText(!secureText)}
              />
            }
          />
          {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
        </View>
      )}
    />
  );
};

export default PasswordInput;
