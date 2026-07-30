/**
 * =============================================================================
 * Jeeva Raksha — App Navigator (navigation/AppNavigator.js)
 * =============================================================================
 * Description : Bottom-tab navigator for the authenticated app experience.
 *               Each tab root is a stack navigator allowing sub-screens within
 *               each tab (e.g., Home → Appointment Detail).
 *
 * Tabs        :
 *   Home       — Dashboard / overview
 *   Health     — Health records / vitals (future modules)
 *   Chat       — AI health assistant chat (future module)
 *   Profile    — User profile settings
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// ─── App Screens ──────────────────────────────────────────────────────────────
import HomeScreen    from '../screens/app/HomeScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import DashboardScreen from '../screens/app/DashboardScreen';

// ─── Theme ───────────────────────────────────────────────────────────────────
import { COLORS, FONTS } from '../utils/theme';

// ─── Route Name Constants ────────────────────────────────────────────────────
export const APP_ROUTES = {
  // Tabs
  HOME_TAB   : 'HomeTab',
  HEALTH_TAB : 'HealthTab',
  CHAT_TAB   : 'ChatTab',
  PROFILE_TAB: 'ProfileTab',
  // Screens
  HOME       : 'Home',
  DASHBOARD  : 'Dashboard',
  PROFILE    : 'Profile',
};

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Tab Icon Mapping ─────────────────────────────────────────────────────────
const TAB_ICONS = {
  [APP_ROUTES.HOME_TAB]   : { active: 'home',          inactive: 'home-outline'          },
  [APP_ROUTES.HEALTH_TAB] : { active: 'heart',         inactive: 'heart-outline'         },
  [APP_ROUTES.CHAT_TAB]   : { active: 'chatbubbles',   inactive: 'chatbubbles-outline'   },
  [APP_ROUTES.PROFILE_TAB]: { active: 'person-circle', inactive: 'person-circle-outline' },
};

/** Home Stack — allows navigating to sub-screens from Home tab */
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={APP_ROUTES.HOME}      component={HomeScreen} />
    <Stack.Screen name={APP_ROUTES.DASHBOARD} component={DashboardScreen} />
  </Stack.Navigator>
);

/**
 * AppNavigator — Bottom tab navigator for authenticated users.
 *
 * @returns {React.JSX.Element}
 */
const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName={APP_ROUTES.HOME_TAB}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
      tabBarActiveTintColor  : COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,

      tabBarIcon: ({ focused, color, size }) => {
        const icons = TAB_ICONS[route.name];
        const name  = focused ? icons.active : icons.inactive;
        return <Icon name={name} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name={APP_ROUTES.HOME_TAB}
      component={HomeStack}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name={APP_ROUTES.HEALTH_TAB}
      component={HomeScreen} // Placeholder — replace with HealthScreen
      options={{ tabBarLabel: 'Health' }}
    />
    <Tab.Screen
      name={APP_ROUTES.CHAT_TAB}
      component={HomeScreen} // Placeholder — replace with ChatScreen
      options={{ tabBarLabel: 'AI Chat' }}
    />
    <Tab.Screen
      name={APP_ROUTES.PROFILE_TAB}
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor : COLORS.border,
    borderTopWidth : 1,
    height         : 60,
    paddingBottom  : 8,
    paddingTop     : 6,
    elevation      : 10,
    shadowColor    : '#000',
    shadowOffset   : { width: 0, height: -2 },
    shadowOpacity  : 0.15,
    shadowRadius   : 6,
  },
  tabLabel: {
    fontSize  : 11,
    fontFamily: FONTS.medium,
  },
});

export default AppNavigator;
