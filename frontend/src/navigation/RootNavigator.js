/**
 * =============================================================================
 * Jeeva Raksha — Root Navigator (navigation/RootNavigator.js)
 * =============================================================================
 * Description : Master navigator that observes Firebase auth state and the
 *               internal backend token to route users to either the Auth
 *               flow, or the role-specific App flows (Patient, Doctor, Admin).
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { FullScreenLoader } from '../components/common/Loader';
import { STORAGE_KEYS } from '../utils/constants';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // 1. Listen for Firebase Auth state changes
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // 2. If Firebase user exists, check for our internal token and role
        try {
          const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
          const userInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
          
          if (token && userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            setRole(userInfo.role); // 'patient', 'doctor', or 'admin'
            setUser(firebaseUser);
          } else {
            // User registered in Firebase but hasn't completed backend setup
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error('Failed to load session details', error);
          setUser(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      
      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  if (initializing) return <FullScreenLoader message="Initializing Jeeva Raksha..." />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user && role ? (
        // For Module 01, we route all authenticated users to the generic AppNavigator placeholder.
        // In future modules, this will branch to PatientNavigator, DoctorNavigator, AdminNavigator.
        <Stack.Screen name="AppCore" component={AppNavigator} />
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
