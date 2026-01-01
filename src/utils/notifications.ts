// Notifications Utility
// Schedule local push notifications for prayer times

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimes } from '../services/prayerTimesService';
import { logger } from './logger';

const NOTIFICATION_STORAGE_KEY = 'revert-notification-ids';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    logger.error('Failed to get notification permissions:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

/**
 * Schedule a single prayer notification
 */
const schedulePrayerNotification = async (
  prayerName: string,
  prayerTime: string,
  minutesBefore: number = 10
): Promise<string | null> => {
  try {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    
    // Calculate notification time (minutesBefore the actual prayer)
    const now = new Date();
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes - minutesBefore, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (prayerDate <= now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const trigger = prayerDate;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${prayerName} Prayer`,
        body: `${prayerName} prayer time is in ${minutesBefore} minutes. Time to prepare for salah.`,
        data: { prayer: prayerName.toLowerCase() },
        sound: true,
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    logger.error(`Failed to schedule ${prayerName} notification:`, error);
    return null;
  }
};

/**
 * Schedule an immediate notification (for when prayer time arrives)
 */
const schedulePrayerTimeNotification = async (
  prayerName: string,
  prayerTime: string
): Promise<string | null> => {
  try {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    
    const now = new Date();
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (prayerDate <= now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${prayerName} Time`,
        body: `It's time for ${prayerName} prayer. Allahu Akbar!`,
        data: { prayer: prayerName.toLowerCase(), isAdhan: true },
        sound: true,
      },
      trigger: prayerDate,
    });

    return notificationId;
  } catch (error) {
    logger.error(`Failed to schedule ${prayerName} time notification:`, error);
    return null;
  }
};

/**
 * Cancel all scheduled prayer notifications
 */
export const cancelAllPrayerNotifications = async (): Promise<void> => {
  try {
    // Get stored notification IDs
    const storedIds = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    
    if (storedIds) {
      const ids: string[] = JSON.parse(storedIds);
      
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }
    
    // Clear stored IDs
    await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  } catch (error) {
    logger.error('Failed to cancel notifications:', error);
  }
};

/**
 * Schedule all prayer notifications for the day
 */
export const schedulePrayerNotifications = async (
  prayerTimes: PrayerTimes,
  options: {
    minutesBefore?: number;
    includeFajr?: boolean;
    includeDhuhr?: boolean;
    includeAsr?: boolean;
    includeMaghrib?: boolean;
    includeIsha?: boolean;
    includeAtTime?: boolean; // Also notify when prayer time arrives
  } = {}
): Promise<void> => {
  const {
    minutesBefore = 10,
    includeFajr = true,
    includeDhuhr = true,
    includeAsr = true,
    includeMaghrib = true,
    includeIsha = true,
    includeAtTime = true,
  } = options;

  // First, cancel existing notifications
  await cancelAllPrayerNotifications();

  // Check permissions
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    logger.info('Notification permissions not granted');
    return;
  }

  const notificationIds: string[] = [];

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, enabled: includeFajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, enabled: includeDhuhr },
    { name: 'Asr', time: prayerTimes.asr, enabled: includeAsr },
    { name: 'Maghrib', time: prayerTimes.maghrib, enabled: includeMaghrib },
    { name: 'Isha', time: prayerTimes.isha, enabled: includeIsha },
  ];

  for (const prayer of prayers) {
    if (!prayer.enabled) continue;

    // Schedule reminder before prayer
    const reminderId = await schedulePrayerNotification(
      prayer.name,
      prayer.time,
      minutesBefore
    );
    if (reminderId) {
      notificationIds.push(reminderId);
    }

    // Schedule notification at prayer time
    if (includeAtTime) {
      const atTimeId = await schedulePrayerTimeNotification(prayer.name, prayer.time);
      if (atTimeId) {
        notificationIds.push(atTimeId);
      }
    }
  }

  // Store notification IDs for later cancellation
  await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationIds));
  
  logger.info(`Scheduled ${notificationIds.length} prayer notifications`);
};

/**
 * Schedule a streak reminder notification
 */
export const scheduleStreakReminder = async (
  streakCount: number,
  hour: number = 20, // 8 PM default
  minute: number = 0
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hour, minute, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Keep Your Streak!',
        body: `You have a ${streakCount} day streak! Complete today's lesson to keep it going.`,
        data: { type: 'streak_reminder' },
        sound: true,
      },
      trigger: reminderDate,
    });

    return notificationId;
  } catch (error) {
    logger.error('Failed to schedule streak reminder:', error);
    return null;
  }
};

/**
 * Schedule daily lesson reminder
 */
export const scheduleDailyLessonReminder = async (
  hour: number = 9, // 9 AM default
  minute: number = 0
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Daily Lesson Ready',
        body: "Your next lesson is waiting. Let's continue your journey!",
        data: { type: 'daily_lesson' },
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    logger.error('Failed to schedule daily reminder:', error);
    return null;
  }
};

/**
 * Get all scheduled notifications (for debugging)
 */
export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

// Storage key for midnight reschedule notification
const MIDNIGHT_RESCHEDULE_KEY = 'revert-midnight-notification-id';

/**
 * Schedule a silent notification at midnight to trigger rescheduling
 * This notification will remind the app to update prayer times and reschedule notifications
 */
export const scheduleMidnightReschedule = async (): Promise<string | null> => {
  try {
    // Cancel existing midnight notification
    const existingId = await AsyncStorage.getItem(MIDNIGHT_RESCHEDULE_KEY);
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }

    // Calculate next midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 5, 0, 0); // 12:05 AM to avoid exact midnight edge cases

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prayer Times Updated',
        body: 'Your prayer times have been updated for today.',
        data: { type: 'midnight_reschedule', silent: true },
        sound: false,
      },
      trigger: midnight,
    });

    await AsyncStorage.setItem(MIDNIGHT_RESCHEDULE_KEY, notificationId);
    return notificationId;
  } catch (error) {
    logger.error('Failed to schedule midnight reschedule:', error);
    return null;
  }
};

/**
 * Schedule daily recurring midnight reschedule
 * Uses repeating trigger for consistent daily updates
 */
export const scheduleRecurringMidnightReschedule = async (): Promise<string | null> => {
  try {
    // Cancel existing
    const existingId = await AsyncStorage.getItem(MIDNIGHT_RESCHEDULE_KEY);
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prayer Times',
        body: 'Tap to view today\'s prayer times',
        data: { type: 'daily_update' },
        sound: false,
      },
      trigger: {
        hour: 0,
        minute: 5,
        repeats: true,
      },
    });

    await AsyncStorage.setItem(MIDNIGHT_RESCHEDULE_KEY, notificationId);
    return notificationId;
  } catch (error) {
    logger.error('Failed to schedule recurring midnight reschedule:', error);
    return null;
  }
};

/**
 * Handle the midnight reschedule notification
 * Call this when the app opens or when the notification is received
 */
export const handleMidnightReschedule = async (
  fetchPrayerTimesCallback: () => Promise<PrayerTimes | null>,
  notificationOptions?: {
    minutesBefore?: number;
    includeFajr?: boolean;
    includeDhuhr?: boolean;
    includeAsr?: boolean;
    includeMaghrib?: boolean;
    includeIsha?: boolean;
    includeAtTime?: boolean;
  }
): Promise<boolean> => {
  try {
    // Fetch fresh prayer times
    const prayerTimes = await fetchPrayerTimesCallback();

    if (!prayerTimes) {
      logger.error('Could not fetch prayer times for rescheduling');
      return false;
    }

    // Reschedule all prayer notifications
    await schedulePrayerNotifications(prayerTimes, notificationOptions);

    // Schedule next midnight reschedule
    await scheduleMidnightReschedule();

    logger.info('Successfully rescheduled prayer notifications');
    return true;
  } catch (error) {
    logger.error('Failed to handle midnight reschedule:', error);
    return false;
  }
};

/**
 * Check if it's time to reschedule (used when app opens)
 * Returns true if notifications should be rescheduled
 */
export const shouldRescheduleNotifications = async (): Promise<boolean> => {
  try {
    const lastScheduledKey = 'revert-last-notification-schedule';
    const lastScheduled = await AsyncStorage.getItem(lastScheduledKey);

    if (!lastScheduled) {
      return true;
    }

    const lastDate = new Date(lastScheduled).toDateString();
    const today = new Date().toDateString();

    return lastDate !== today;
  } catch {
    return true;
  }
};

/**
 * Mark notifications as scheduled for today
 */
export const markNotificationsScheduled = async (): Promise<void> => {
  const lastScheduledKey = 'revert-last-notification-schedule';
  await AsyncStorage.setItem(lastScheduledKey, new Date().toISOString());
};

/**
 * Initialize notification system
 * Call this when the app starts
 */
export const initializeNotifications = async (
  fetchPrayerTimesCallback: () => Promise<PrayerTimes | null>,
  notificationOptions?: {
    minutesBefore?: number;
    includeFajr?: boolean;
    includeDhuhr?: boolean;
    includeAsr?: boolean;
    includeMaghrib?: boolean;
    includeIsha?: boolean;
    includeAtTime?: boolean;
  }
): Promise<void> => {
  // Request permissions
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    logger.info('Notifications not enabled');
    return;
  }

  // Check if we need to reschedule
  const needsReschedule = await shouldRescheduleNotifications();

  if (needsReschedule) {
    const success = await handleMidnightReschedule(
      fetchPrayerTimesCallback,
      notificationOptions
    );

    if (success) {
      await markNotificationsScheduled();
    }
  }

  // Ensure recurring midnight reschedule is set up
  await scheduleRecurringMidnightReschedule();
};
