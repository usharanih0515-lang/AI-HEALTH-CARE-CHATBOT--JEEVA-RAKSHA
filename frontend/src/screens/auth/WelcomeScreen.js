import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Jeeva Raksha</Text>
      <Text style={styles.subtitle}>Your AI-Powered Healthcare Companion</Text>
      
      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: SPACING.xl },
  title: { fontSize: FONT_SIZES.h2, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZES.md, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginBottom: SPACING.xxl, textAlign: 'center' },
  button: { width: '100%', padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, alignItems: 'center' },
  primaryButton: { backgroundColor: COLORS.primary },
  primaryButtonText: { fontSize: FONT_SIZES.md, fontFamily: FONTS.bold, color: '#fff' },
  buttonText: { fontSize: FONT_SIZES.md, fontFamily: FONTS.medium, color: COLORS.primary },
});

export default WelcomeScreen;
