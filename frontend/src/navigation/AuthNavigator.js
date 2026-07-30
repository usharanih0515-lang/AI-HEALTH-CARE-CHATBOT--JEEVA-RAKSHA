/**
 * =============================================================================
 * Jeeva Raksha — Auth Navigator (navigation/AuthNavigator.js)
 * =============================================================================
 * Description : Stack navigator for unauthenticated screens.
 *               Covers the complete pre-login flow:
 *                 Onboarding → Login → Register → Forgot Password
 *
 * Screen Map  :
 *   Onboarding  — App introduction / language selection
 *   Login       — Email + password sign-in
 *   Register    — New user registration
 *   ForgotPassword — Password reset via Firebase
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ─── Auth Screens ─────────────────────────────────────────────────────────────
import OnboardingScreen    from '../screens/auth/OnboardingScreen';
import LoginScreen         from '../screens/auth/LoginScreen';
import RegisterScreen      from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// ─── Route Name Constants ────────────────────────────────────────────────────
export const AUTH_ROUTES = {
  ONBOARDING     : 'Onboarding',
  LOGIN          : 'Login',
  REGISTER       : 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
};

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator — Stack navigator for authentication screens.
 * No header is shown; each screen manages its own header/back button.
 *
 * @returns {React.JSX.Element}
 */
const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName={AUTH_ROUTES.ONBOARDING}
    screenOptions={{
      headerShown        : false,       // All auth screens use custom headers
      animation          : 'slide_from_right',
      contentStyle       : { backgroundColor: '#0f0e17' },
    }}
  >
    <Stack.Screen name={AUTH_ROUTES.ONBOARDING}      component={OnboardingScreen} />
    <Stack.Screen name={AUTH_ROUTES.LOGIN}           component={LoginScreen} />
    <Stack.Screen name={AUTH_ROUTES.REGISTER}        component={RegisterScreen} />
    <Stack.Screen name={AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
