/**
 * =============================================================================
 * Jeeva Raksha — OTP Verification Screen (screens/auth/OtpVerificationScreen.js)
 * =============================================================================
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import OtpInput from '../../components/forms/OtpInput';
import LoadingButton from '../../components/forms/LoadingButton';
import { otpSchema } from '../../utils/validators';
import authService from '../../services/authService';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(email, data.otp);
      
      // Navigate to Reset Password if temp token exists, or login if successful reg
      if (res.data?.tempToken) {
        navigation.navigate('ResetPassword', { tempToken: res.data.tempToken });
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Verification Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>Verify Email</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        We've sent a 6-digit OTP to {email}. Please enter it below.
      </Text>

      <View style={styles.form}>
        <OtpInput control={control} />
        <LoadingButton title="Verify OTP" onPress={handleSubmit(onSubmit)} loading={loading} />
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

export default OtpVerificationScreen;
