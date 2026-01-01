import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../constants/theme';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useProgressStore } from '../store/useProgressStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { BADGES, getLevelInfo } from '../data/gamificationData';

type ProfileStackParamList = {
  ProfileHome: undefined;
  NotificationSettings: undefined;
  PrayerSettings: undefined;
  About: undefined;
};

type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const onboardingStore = useOnboardingStore();
  const progressStore = useProgressStore();
  const { user, signOut, isTrialActive, getTrialDaysRemaining } = useAuthStore();
  const { isSubscribed, getSubscriptionExpiration } = useSubscriptionStore();

  const { name, getDaysSinceShadaha } = onboardingStore;
  const { 
    xp, 
    level, 
    streak, 
    longestStreak, 
    completedDays, 
    prayersCompleted,
    unlockedBadges,
    totalDaysActive,
    joinedAt,
    resetProgress,
  } = progressStore;

  const levelInfo = getLevelInfo(level);
  const daysSinceShadaha = getDaysSinceShadaha();

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Progress Reset', 'Your progress has been reset.');
          }
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  // Subscription status helpers
  const trialActive = isTrialActive();
  const trialDaysRemaining = getTrialDaysRemaining();
  const expirationDate = getSubscriptionExpiration();

  const unlockedBadgeDetails = BADGES.filter(b => unlockedBadges.includes(b.id));

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{name || 'Muslim'}</Text>
        <Text style={styles.subtitle}>
          {(daysSinceShadaha ?? 0) > 0
            ? `Day ${daysSinceShadaha} of your journey`
            : 'Welcome to Islam'
          }
        </Text>
      </View>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelIcon}>{levelInfo.icon}</Text>
          <View>
            <Text style={styles.levelTitle}>Level {level}: {levelInfo.title}</Text>
            <Text style={styles.levelArabic}>{levelInfo.titleArabic}</Text>
          </View>
        </View>
        <View style={styles.xpBar}>
          <View 
            style={[
              styles.xpFill, 
              { width: `${((xp - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedDays.length}</Text>
          <Text style={styles.statLabel}>Days Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{prayersCompleted}</Text>
          <Text style={styles.statLabel}>Prayers Logged</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalDaysActive}</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{unlockedBadges.length}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges ({unlockedBadges.length})</Text>
        {unlockedBadgeDetails.length > 0 ? (
          <View style={styles.badgesGrid}>
            {unlockedBadgeDetails.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyBadges}>
            <Text style={styles.emptyText}>Complete days to earn badges!</Text>
          </View>
        )}
      </View>

      {/* Locked Badges Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges to Earn</Text>
        <View style={styles.badgesGrid}>
          {BADGES.filter(b => !unlockedBadges.includes(b.id)).slice(0, 6).map((badge) => (
            <View key={badge.id} style={[styles.badgeItem, styles.badgeLocked]}>
              <Text style={[styles.badgeIcon, styles.badgeIconLocked]}>🔒</Text>
              <Text style={[styles.badgeName, styles.badgeNameLocked]}>{badge.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subscription Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.subscriptionCard}>
          {isSubscribed ? (
            <>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionIcon}>✨</Text>
                <Text style={styles.subscriptionStatus}>Premium Member</Text>
              </View>
              {expirationDate && (
                <Text style={styles.subscriptionDetail}>
                  Renews: {new Date(expirationDate).toLocaleDateString()}
                </Text>
              )}
              <Text style={styles.charityNote}>
                50% of your subscription supports Muslim charities
              </Text>
            </>
          ) : trialActive ? (
            <>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionIcon}>🎁</Text>
                <Text style={styles.subscriptionStatus}>Free Trial</Text>
              </View>
              <Text style={styles.subscriptionDetail}>
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
              </Text>
            </>
          ) : (
            <>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionIcon}>⏰</Text>
                <Text style={styles.subscriptionStatus}>Trial Ended</Text>
              </View>
              <Text style={styles.subscriptionDetail}>
                Subscribe to continue your journey
              </Text>
            </>
          )}
        </View>
        {user?.email && (
          <Text style={styles.emailText}>Signed in as {user.email}</Text>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('PrayerSettings')}
        >
          <Text style={styles.settingText}>Prayer Time Settings</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.settingText}>About The Revert</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, styles.dangerItem]}
          onPress={handleResetProgress}
        >
          <Text style={styles.dangerText}>Reset Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Member Since */}
      <View style={styles.memberSince}>
        <Text style={styles.memberSinceText}>
          Member since {new Date(joinedAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  name: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  levelCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  levelIcon: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  levelTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  levelArabic: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
  },
  xpBar: {
    height: 8,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  xpText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    width: '31%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badgeItem: {
    width: '31%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: theme.colors.textMuted,
  },
  emptyBadges: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  settingItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  settingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  settingArrow: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  dangerItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginTop: theme.spacing.md,
  },
  dangerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
  },
  signOutText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  subscriptionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  subscriptionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  subscriptionStatus: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  subscriptionDetail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  charityNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  emailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  memberSince: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  memberSinceText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;
