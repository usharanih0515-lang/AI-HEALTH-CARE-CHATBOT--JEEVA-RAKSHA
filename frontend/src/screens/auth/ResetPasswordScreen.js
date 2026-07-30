/**
 * =============================================================================
 * Jeeva Raksha — Reset Password Screen (screens/auth/ResetPasswordScreen.js)
 * =============================================================================
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import PasswordInput from '../../components/forms/PasswordInput';
import LoadingButton from '../../components/forms/LoadingButton';
import { resetPasswordSchema } from '../../utils/validators';
import authService from '../../services/authService';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { tempToken } = route.params || {};
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.resetPassword(tempToken, data.newPassword);
      Toast.show({ type: 'success', text1: 'Password Reset!', text2: 'You can now log in.' });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Reset Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>Create New Password</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Your new password must be different from previous passwords.</Text>

      <View style={styles.form}>
        <PasswordInput control={control} name="newPassword" label="New Password" />
        <PasswordInput control={control} name="confirmPassword" label="Confirm New Password" />
        <LoadingButton title="Reset Password" onPress={handleSubmit(onSubmit)} loading={loading} />
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

export default ResetPasswordScreen;
