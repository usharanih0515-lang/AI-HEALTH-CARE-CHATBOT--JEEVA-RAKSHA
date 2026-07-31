import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const AdminDashboardScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Admin Dashboard</Text>
    <Text style={styles.subtitle}>Welcome Admin. System overview and management.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: FONT_SIZES.h2, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, fontFamily: FONTS.regular, color: COLORS.textSecondary },
});

export default AdminDashboardScreen;
