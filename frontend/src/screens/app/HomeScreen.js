/**
 * =============================================================================
 * Jeeva Raksha — Home Screen (screens/app/HomeScreen.js)
 * =============================================================================
 * Description : Main dashboard home screen for authenticated users.
 *               Shows a welcome greeting, quick-action cards, and recent activity.
 *               Fetches the user profile from the backend on mount.
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../../services/apiService';
import Card       from '../../components/common/Card';
import { InlineLoader } from '../../components/common/Loader';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';

// ─── Quick Action Definitions ────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { id: 'symptom',     label: 'Symptom\nChecker',  icon: '🩺', color: '#4A90D9' },
  { id: 'appointment', label: 'Book\nAppointment', icon: '📅', color: '#50C878' },
  { id: 'records',     label: 'Health\nRecords',   icon: '📋', color: '#9B59B6' },
  { id: 'ai-chat',     label: 'AI Health\nChat',   icon: '🤖', color: '#F39C12' },
];

const HomeScreen = ({ navigation }) => {
  const { t }   = useTranslation();
  const insets  = useSafeAreaInsets();
  const [user,        setUser]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await apiService.get('/users/me');
      setUser(data.data?.user || null);
    } catch (err) {
      console.error('[HomeScreen] Failed to fetch profile:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchProfile(); };

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.flex}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greeting}>
              {loading ? '...' : t('home.greeting', { name: firstName })} 👋
            </Text>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          </View>
          {loading && <InlineLoader />}
        </View>

        {/* ── Quick Actions ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderColor: action.color + '40' }]}
                activeOpacity={0.8}
                onPress={() => {
                  // Future: navigate to the relevant module screen
                  console.log(`Navigate to ${action.id}`);
                }}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionLabel, { color: action.color }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Recent Activity Placeholder ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
          <Card>
            <Text style={styles.emptyText}>
              Your recent health activity will appear here.
            </Text>
          </Card>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  headerSection: {
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
    padding        : SPACING.lg,
    paddingBottom  : SPACING.md,
  },
  greeting: {
    fontSize  : FONT_SIZES.h3,
    fontFamily: FONTS.bold,
    color     : COLORS.textPrimary,
  },
  subtitle: {
    fontSize  : FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color     : COLORS.textSecondary,
    marginTop : SPACING.xs,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom     : SPACING.lg,
  },
  sectionTitle: {
    fontSize    : FONT_SIZES.md,
    fontFamily  : FONTS.semiBold,
    color       : COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection : 'row',
    flexWrap      : 'wrap',
    gap           : SPACING.sm,
  },
  actionCard: {
    width          : '47%',
    backgroundColor: COLORS.surface,
    borderRadius   : RADIUS.lg,
    padding        : SPACING.md,
    alignItems     : 'center',
    borderWidth    : 1,
  },
  actionIcon: {
    fontSize    : 36,
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize  : FONT_SIZES.sm,
    fontFamily: FONTS.semiBold,
    textAlign : 'center',
    lineHeight : 18,
  },
  emptyText: {
    fontSize  : FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color     : COLORS.textMuted,
    textAlign : 'center',
    padding   : SPACING.md,
  },
});

export default HomeScreen;
