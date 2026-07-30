/**
 * =============================================================================
 * Jeeva Raksha — Register Screen (screens/auth/RegisterScreen.js)
 * =============================================================================
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import EmailInput from '../../components/forms/EmailInput';
import PasswordInput from '../../components/forms/PasswordInput';
import PhoneInput from '../../components/forms/PhoneInput';
import LoadingButton from '../../components/forms/LoadingButton';
import { registerSchema } from '../../utils/validators';
import FirebaseService from '../../services/firebaseService';
import authService from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', phone: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const fbCred = await FirebaseService.register(data.email, data.password);
      const token = await fbCred.user.getIdToken();
      
      await authService.registerPatient({
        firebaseToken: token,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });
      
      // The backend creates an OTP and sends email. Send user to OTP screen.
      navigation.navigate('OtpVerification', { email: data.email });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>Create Patient Account</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={{ marginBottom: 12 }}>
              <TextInput label="Full Name" mode="outlined" onBlur={onBlur} onChangeText={onChange} value={value} error={!!error} left={<TextInput.Icon icon="account-outline" />} />
            </View>
          )}
        />
        <EmailInput control={control} />
        <PhoneInput control={control} />
        <PasswordInput control={control} name="password" label="Password" />
        <PasswordInput control={control} name="confirmPassword" label="Confirm Password" />

        <LoadingButton title="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>

      <View style={styles.footer}>
        <Text variant="bodyMedium">Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text variant="labelLarge" style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F8F9FA' },
  title: { fontWeight: 'bold', color: '#4A90D9', textAlign: 'center', marginBottom: 24 },
  form: { marginBottom: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  link: { color: '#4A90D9', fontWeight: 'bold' },
});

export default RegisterScreen;
