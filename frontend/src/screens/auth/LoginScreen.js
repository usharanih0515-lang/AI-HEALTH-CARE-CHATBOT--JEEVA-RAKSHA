/**
 * =============================================================================
 * Jeeva Raksha — Login Screen (screens/auth/LoginScreen.js)
 * =============================================================================
 * Description : Login flow utilizing React Hook Form + Yup for validation,
 *               React Native Paper for UI, and Firebase + Custom API.
 * =============================================================================
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

import EmailInput from '../../components/forms/EmailInput';
import PasswordInput from '../../components/forms/PasswordInput';
import LoadingButton from '../../components/forms/LoadingButton';
import { loginSchema } from '../../utils/validators';
import FirebaseService from '../../services/firebaseService';
import authService from '../../services/authService'; // We will create this

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // 1. Firebase Auth (optional depending on flow, let's use Custom backend first)
      const fbCred = await FirebaseService.signIn(data.email, data.password);
      const token = await fbCred.user.getIdToken();
      
      // 2. Custom Backend Auth
      await authService.loginWithFirebase(token);
      
      // RootNavigator will detect token change and navigate automatically
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="displaySmall" style={styles.title}>Welcome Back</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Sign in to your Jeeva Raksha account</Text>

      <View style={styles.form}>
        <EmailInput control={control} />
        <PasswordInput control={control} />
        
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot}>
          <Text variant="labelLarge" style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <LoadingButton title="Sign In" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.footer}>
        <Text variant="bodyMedium">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text variant="labelLarge" style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F8F9FA' },
  title: { fontWeight: 'bold', color: '#4A90D9', textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#6c757d', marginBottom: 32 },
  form: { marginBottom: 24 },
  forgot: { alignSelf: 'flex-end', marginBottom: 24 },
  link: { color: '#4A90D9', fontWeight: 'bold' },
  divider: { marginVertical: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
});

export default LoginScreen;
