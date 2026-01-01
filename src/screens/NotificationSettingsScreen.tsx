import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { useSettingsStore } from '../store/useSettingsStore';

const REMINDER_OPTIONS = [5, 10, 15, 20, 30];
const TIME_OPTIONS = ['06:00', '07:00', '08:00', '09:00', '10:00'];

export const NotificationSettingsScreen: React.FC = () => {
  const { notifications, updateNotificationSettings } = useSettingsStore();
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleToggle = (key: keyof typeof notifications) => {
    if (typeof notifications[key] === 'boolean') {
      updateNotificationSettings({ [key]: !notifications[key] });
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Notification Permission',
      'To receive prayer reminders and daily notifications, please enable notifications in your device settings.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Prayer Reminders Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prayer Reminders</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Prayer Time Reminders</Text>
            <Text style={styles.settingDescription}>
              Get notified before each prayer time
            </Text>
          </View>
          <Switch
            value={notifications.prayerReminders}
            onValueChange={() => handleToggle('prayerReminders')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {notifications.prayerReminders && (
          <>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowReminderPicker(!showReminderPicker)}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reminder Time</Text>
                <Text style={styles.settingDescription}>
                  {notifications.reminderMinutesBefore} minutes before prayer
                </Text>
              </View>
              <Text style={styles.settingValue}>
                {notifications.reminderMinutesBefore}m
              </Text>
            </TouchableOpacity>

            {showReminderPicker && (
              <View style={styles.optionsContainer}>
                {REMINDER_OPTIONS.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.optionButton,
                      notifications.reminderMinutesBefore === minutes && styles.optionButtonActive,
                    ]}
                    onPress={() => {
                      updateNotificationSettings({ reminderMinutesBefore: minutes });
                      setShowReminderPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        notifications.reminderMinutesBefore === minutes && styles.optionTextActive,
                      ]}
                    >
                      {minutes} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Adhan Sound</Text>
                <Text style={styles.settingDescription}>
                  Play adhan with prayer notification
                </Text>
              </View>
              <Switch
                value={notifications.adhanSound}
                onValueChange={() => handleToggle('adhanSound')}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}
      </View>

      {/* Daily Content Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Content</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Daily Reminder</Text>
            <Text style={styles.settingDescription}>
              Remind me to complete today's journey content
            </Text>
          </View>
          <Switch
            value={notifications.dailyContentReminder}
            onValueChange={() => handleToggle('dailyContentReminder')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {notifications.dailyContentReminder && (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowTimePicker(!showTimePicker)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reminder Time</Text>
              <Text style={styles.settingDescription}>
                When to send daily content reminder
              </Text>
            </View>
            <Text style={styles.settingValue}>
              {formatTime(notifications.dailyContentTime)}
            </Text>
          </TouchableOpacity>
        )}

        {showTimePicker && (
          <View style={styles.optionsContainer}>
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.optionButton,
                  notifications.dailyContentTime === time && styles.optionButtonActive,
                ]}
                onPress={() => {
                  updateNotificationSettings({ dailyContentTime: time });
                  setShowTimePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    notifications.dailyContentTime === time && styles.optionTextActive,
                  ]}
                >
                  {formatTime(time)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Streaks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streaks</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Streak Reminder</Text>
            <Text style={styles.settingDescription}>
              Get reminded if you're about to lose your streak
            </Text>
          </View>
          <Switch
            value={notifications.streakReminder}
            onValueChange={() => handleToggle('streakReminder')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Permission Help */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={showPermissionAlert}
      >
        <Text style={styles.helpButtonText}>
          Not receiving notifications? Check permissions
        </Text>
      </TouchableOpacity>

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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  settingValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  optionButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: theme.fontWeight.medium,
  },
  helpButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  helpButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
  bottomPadding: {
    height: 40,
  },
});

export default NotificationSettingsScreen;
