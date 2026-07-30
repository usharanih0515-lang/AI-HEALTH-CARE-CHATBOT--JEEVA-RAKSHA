/**
 * =============================================================================
 * Jeeva Raksha — Main Entry Point (App.js)
 * =============================================================================
 * Description : Root component for the React Native application. Sets up
 *               React Native Paper theme provider, React Navigation, and
 *               global Toast messages.
 * =============================================================================
 */

import 'react-native-gesture-handler'; // MUST BE FIRST IMPORT
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Localization
import './src/utils/i18n';

// Navigators
import RootNavigator from './src/navigation/RootNavigator';

// Ignore specific warnings
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

// ─── Theme Configuration (React Native Paper) ────────────────────────────────
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A90D9',       // Jeeva Raksha Primary Blue
    secondary: '#50C878',     // Emerald Green
    tertiary: '#9B59B6',      // Amethyst
    error: '#E74C3C',         // Red
    background: '#F8F9FA',    // Light gray background
    surface: '#FFFFFF',       // Card surface
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
