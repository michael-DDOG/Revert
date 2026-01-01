import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { useProgressStore } from '../store/useProgressStore';

export const StreakProtectionCard: React.FC = () => {
  const {
    streak,
    freezeDaysAvailable,
    activeFreeze,
    lastStreakValue,
    xp,
    useStreakFreeze,
    endStreakFreeze,
    recoverStreak,
    canRecoverStreak,
  } = useProgressStore();

  const showRecovery = canRecoverStreak();

  const handleFreeze = () => {
    if (activeFreeze) {
      Alert.alert(
        'End Streak Freeze?',
        'Your streak will continue from where you left off.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'End Freeze',
            onPress: () => endStreakFreeze(),
          },
        ]
      );
    } else if (streak > 0 && freezeDaysAvailable > 0) {
      Alert.alert(
        'Freeze Your Streak?',
        `This will protect your ${streak}-day streak for 24 hours. You have ${freezeDaysAvailable} freeze day${freezeDaysAvailable > 1 ? 's' : ''} available.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Freeze Streak',
            onPress: () => {
              const success = useStreakFreeze();
              if (success) {
                Alert.alert('Streak Frozen!', 'Your streak is protected for 24 hours.');
              }
            },
          },
        ]
      );
    } else if (streak === 0) {
      Alert.alert('No Active Streak', 'Complete a day to start building your streak!');
    } else {
      Alert.alert('No Freeze Days', 'You don\'t have any freeze days available. Earn more by maintaining long streaks!');
    }
  };

  const handleRecover = () => {
    const cost = freezeDaysAvailable > 0 ? '1 freeze day' : '100 XP';

    Alert.alert(
      'Recover Your Streak?',
      `Restore your ${lastStreakValue}-day streak for ${cost}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recover',
          onPress: () => {
            const success = recoverStreak();
            if (success) {
              Alert.alert('Streak Recovered!', `Your ${lastStreakValue}-day streak has been restored!`);
            } else {
              Alert.alert('Recovery Failed', 'Unable to recover streak. You may not have enough resources.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Streak Protection</Text>
        <View style={styles.freezeBadge}>
          <Text style={styles.freezeCount}>{freezeDaysAvailable}</Text>
          <Text style={styles.freezeLabel}>freeze days</Text>
        </View>
      </View>

      {activeFreeze && (
        <View style={styles.activeFreeze}>
          <Text style={styles.activeFreezeIcon}>FROZEN</Text>
          <Text style={styles.activeFreezeText}>
            Streak frozen! Your {streak}-day streak is protected.
          </Text>
        </View>
      )}

      {showRecovery && (
        <View style={styles.recoveryAlert}>
          <Text style={styles.recoveryIcon}>!</Text>
          <View style={styles.recoveryContent}>
            <Text style={styles.recoveryTitle}>Streak Lost!</Text>
            <Text style={styles.recoveryText}>
              You can recover your {lastStreakValue}-day streak within 24 hours.
            </Text>
            <TouchableOpacity style={styles.recoverButton} onPress={handleRecover}>
              <Text style={styles.recoverButtonText}>
                Recover ({freezeDaysAvailable > 0 ? '1 freeze day' : '100 XP'})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.freezeButton,
            activeFreeze && styles.freezeButtonActive,
            (streak === 0 || freezeDaysAvailable === 0) && !activeFreeze && styles.freezeButtonDisabled,
          ]}
          onPress={handleFreeze}
        >
          <Text style={[
            styles.freezeButtonText,
            (streak === 0 || freezeDaysAvailable === 0) && !activeFreeze && styles.freezeButtonTextDisabled,
          ]}>
            {activeFreeze ? 'End Freeze' : 'Freeze Streak'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Freeze days protect your streak when you can't use the app. Earn more freeze days by maintaining long streaks!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  freezeBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  freezeCount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  freezeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
  },
  activeFreeze: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activeFreezeIcon: {
    fontSize: 10,
    marginRight: theme.spacing.sm,
    color: '#3b82f6',
  },
  activeFreezeText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: '#3b82f6',
  },
  recoveryAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  recoveryIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  recoveryContent: {
    flex: 1,
  },
  recoveryTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
    marginBottom: 4,
  },
  recoveryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  recoverButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  recoverButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: '#fff',
  },
  actions: {
    marginBottom: theme.spacing.md,
  },
  freezeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  freezeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  freezeButtonDisabled: {
    backgroundColor: theme.colors.cardElevated,
  },
  freezeButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  freezeButtonTextDisabled: {
    color: theme.colors.textMuted,
  },
  info: {
    paddingTop: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default StreakProtectionCard;
