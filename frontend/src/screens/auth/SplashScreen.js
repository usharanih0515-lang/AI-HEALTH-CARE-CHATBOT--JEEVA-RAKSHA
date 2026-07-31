import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LanguageSelection');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Jeeva Raksha</Text>
      <Text style={styles.subtitle}>Protection of Life</Text>
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: FONT_SIZES.h1, fontFamily: FONTS.bold, color: COLORS.primary },
  subtitle: { fontSize: FONT_SIZES.md, fontFamily: FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },
});

export default SplashScreen;
