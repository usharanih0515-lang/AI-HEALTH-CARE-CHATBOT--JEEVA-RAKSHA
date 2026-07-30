/**
 * =============================================================================
 * Jeeva Raksha — Profile Screen (screens/app/ProfileScreen.js)
 * =============================================================================
 * Description : User profile screen showing personal info and settings options.
 *               Fetches the user's profile from the backend and provides
 *               a logout option via FirebaseService.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService      from '../../services/apiService';
import FirebaseService from '../../services/firebaseService';
import Card            from '../../components/common/Card';
import { InlineLoader }  from '../../components/common/Loader';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';

// ─── Profile Menu Items ───────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: 'language',      label: 'Language',           icon: '🌐' },
  { id: 'notifications', label: 'Notifications',      icon: '🔔' },
  { id: 'privacy',       label: 'Privacy & Security', icon: '🔒' },
  { id: 'help',          label: 'Help & Support',     icon: '❓' },
  { id: 'about',         label: 'About Jeeva Raksha', icon: 'ℹ️' },
];

const ProfileScreen = () => {
  const { t }  = useTranslation();
  const insets = useSafeAreaInsets();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.get('/users/me')
      .then((data) => setUser(data.data?.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      'Are you sure you want to log out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text   : t('common.logout'),
          style  : 'destructive',
          onPress: async () => {
            try {
              await apiService.post('/auth/logout');
              await FirebaseService.signOut();
              // RootNavigator auto-redirects to AuthNavigator
            } catch (err) {
              console.error('[Profile] Logout failed:', err);
              await FirebaseService.signOut();
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {/* ── Profile Header ──────────────────────────────────────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          {loading ? <InlineLoader /> : (
            <>
              <Text style={styles.name}>{user?.full_name || '—'}</Text>
              <Text style={styles.email}>{user?.email || '—'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'PATIENT'}</Text>
              </View>
            </>
          )}
        </View>

        {/* ── Menu Items ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Card>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuDivider]}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* ── Logout ──────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>🚪 {t('common.logout')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { alignItems: 'center', padding: SPACING.xl, paddingBottom: SPACING.lg },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: { fontSize: FONT_SIZES.h2, fontFamily: FONTS.bold, color: '#FFF' },
  name  : { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  email : { fontSize: FONT_SIZES.sm, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginTop: SPACING.xs },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.primary + '50',
  },
  roleText: { fontSize: FONT_SIZES.xs, fontFamily: FONTS.bold, color: COLORS.primary },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon  : { fontSize: 20, marginRight: SPACING.md },
  menuLabel : { flex: 1, fontSize: FONT_SIZES.md, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  menuArrow : { fontSize: FONT_SIZES.xl, color: COLORS.textMuted },
  logoutButton: {
    backgroundColor: COLORS.error + '15',
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.error + '40',
    padding: SPACING.md,
    alignItems: 'center',
  },
  logoutText: { fontSize: FONT_SIZES.md, fontFamily: FONTS.semiBold, color: COLORS.error },
});

export default ProfileScreen;
