/**
 * =============================================================================
 * Jeeva Raksha — Dashboard Screen (screens/app/DashboardScreen.js)
 * =============================================================================
 * Description : Placeholder for the detailed health analytics dashboard.
 *               This screen will display charts, health trends, and vitals
 *               when the healthcare modules are implemented.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const DashboardScreen = ({ navigation }) => (
  <View style={styles.flex}>
    <Header title="Health Dashboard" showBack onBack={() => navigation.goBack()} />
    <View style={styles.content}>
      <Text style={styles.icon}>📊</Text>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>
        Health analytics, charts, and vitals will be displayed here
        when healthcare modules are implemented.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  flex   : { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  icon   : { fontSize: 64, marginBottom: SPACING.lg },
  title  : { fontSize: FONT_SIZES.h3, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  subtitle: { fontSize: FONT_SIZES.md, fontFamily: FONTS.regular, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
});

export default DashboardScreen;
