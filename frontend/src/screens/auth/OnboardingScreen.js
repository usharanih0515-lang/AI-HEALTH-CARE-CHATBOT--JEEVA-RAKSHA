/**
 * =============================================================================
 * Jeeva Raksha — Onboarding Screen (screens/auth/OnboardingScreen.js)
 * =============================================================================
 * Description : Introductory screen shown to first-time users.
 *               Displays key app features and allows language selection.
 *               On completion, navigates to the Login screen.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { AUTH_ROUTES } from '../navigation/AuthNavigator';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const OnboardingScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏥</Text>
      <Text style={styles.title}>{t('common.appName')}</Text>
      <Text style={styles.tagline}>
        AI-Powered Healthcare{'\n'}in Your Language
      </Text>
      <Button
        title={t('common.next')}
        onPress={() => navigation.replace(AUTH_ROUTES.LOGIN)}
        style={styles.button}
        size="lg"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: COLORS.background,
    justifyContent : 'center',
    alignItems     : 'center',
    padding        : SPACING.xl,
  },
  logo: {
    fontSize   : 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize  : FONT_SIZES.h1,
    fontFamily: FONTS.bold,
    color     : COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize  : FONT_SIZES.lg,
    fontFamily: FONTS.regular,
    color     : COLORS.textSecondary,
    textAlign : 'center',
    lineHeight : 26,
    marginBottom: SPACING.xxl,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
