import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  prayerReminders: boolean;
  reminderMinutesBefore: number;
  dailyContentReminder: boolean;
  dailyContentTime: string; // HH:MM format
  streakReminder: boolean;
  adhanSound: boolean;
}

export interface PrayerSettings {
  calculationMethod: number;
  use12HourFormat: boolean;
  showSunrise: boolean;
  asrCalculation: 'standard' | 'hanafi';
}

export interface DisplaySettings {
  showHijriDate: boolean;
  showArabicText: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface SettingsState {
  // Notification settings
  notifications: NotificationSettings;

  // Prayer calculation settings
  prayer: PrayerSettings;

  // Display settings
  display: DisplaySettings;

  // Location
  savedLocation: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  } | null;

  // Actions
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updatePrayerSettings: (settings: Partial<PrayerSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  setSavedLocation: (location: SettingsState['savedLocation']) => void;
  resetSettings: () => void;
}

const defaultNotifications: NotificationSettings = {
  prayerReminders: true,
  reminderMinutesBefore: 15,
  dailyContentReminder: true,
  dailyContentTime: '08:00',
  streakReminder: true,
  adhanSound: false,
};

const defaultPrayer: PrayerSettings = {
  calculationMethod: 2, // ISNA
  use12HourFormat: true,
  showSunrise: true,
  asrCalculation: 'standard',
};

const defaultDisplay: DisplaySettings = {
  showHijriDate: true,
  showArabicText: true,
  fontSize: 'medium',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: defaultNotifications,
      prayer: defaultPrayer,
      display: defaultDisplay,
      savedLocation: null,

      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      updatePrayerSettings: (settings) =>
        set((state) => ({
          prayer: { ...state.prayer, ...settings },
        })),

      updateDisplaySettings: (settings) =>
        set((state) => ({
          display: { ...state.display, ...settings },
        })),

      setSavedLocation: (location) =>
        set({ savedLocation: location }),

      resetSettings: () =>
        set({
          notifications: defaultNotifications,
          prayer: defaultPrayer,
          display: defaultDisplay,
        }),
    }),
    {
      name: 'revert-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSettingsStore;
