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
import PatientDashboardScreen from '../screens/app/PatientDashboardScreen';
import DoctorDashboardScreen from '../screens/app/DoctorDashboardScreen';
import AdminDashboardScreen from '../screens/app/AdminDashboardScreen';
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
        role === 'patient' ? (
          <Stack.Screen name="PatientDashboard" component={PatientDashboardScreen} />
        ) : role === 'doctor' ? (
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
        ) : (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        )
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
