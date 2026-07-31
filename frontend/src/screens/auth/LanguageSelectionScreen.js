import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../utils/theme';

const LanguageSelectionScreen = ({ navigation }) => {
  const selectLanguage = (lang) => {
    // In future, set global language context here
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Language</Text>
      <Text style={styles.subtitle}>Select your preferred language to continue</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => selectLanguage('en')}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => selectLanguage('hi')}>
        <Text style={styles.buttonText}>हिंदी (Hindi)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: SPACING.xl },
  title: { fontSize: FONT_SIZES.h2, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginBottom: SPACING.xl, textAlign: 'center' },
  button: { width: '100%', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, marginBottom: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  buttonText: { fontSize: FONT_SIZES.md, fontFamily: FONTS.medium, color: COLORS.textPrimary },
});

export default LanguageSelectionScreen;
