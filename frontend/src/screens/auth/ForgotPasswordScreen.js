/**
 * =============================================================================
 * Jeeva Raksha — Forgot Password Screen (screens/auth/ForgotPasswordScreen.js)
 * =============================================================================
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import EmailInput from '../../components/forms/EmailInput';
import LoadingButton from '../../components/forms/LoadingButton';
import { forgotPasswordSchema } from '../../utils/validators';
import authService from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.sendOtp(data.email);
      Toast.show({ type: 'success', text1: 'OTP Sent', text2: 'Please check your email' });
      navigation.navigate('OtpVerification', { email: data.email });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Request Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>Forgot Password?</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Enter your email address and we'll send you an OTP to reset your password.</Text>

      <View style={styles.form}>
        <EmailInput control={control} />
        <LoadingButton title="Send OTP" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F8F9FA' },
  title: { fontWeight: 'bold', color: '#4A90D9', textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#6c757d', marginBottom: 32 },
  form: { marginBottom: 24 },
});

export default ForgotPasswordScreen;
