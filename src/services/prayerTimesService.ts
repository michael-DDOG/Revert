// Prayer Times Service - Aladhan API Integration
// Free API: https://aladhan.com/prayer-times-api

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithRetry, RetryPresets } from '../utils/networkRetry';
import { logger } from '../utils/logger';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimesData {
  times: PrayerTimes;
  date: string;
  hijriDate: string;
  hijriMonth: string;
  hijriYear: string;
  location: string;
  lastFetched: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// Calculation methods
export const CALCULATION_METHODS = {
  1: 'University of Islamic Sciences, Karachi',
  2: 'Islamic Society of North America (ISNA)',
  3: 'Muslim World League',
  4: 'Umm Al-Qura University, Makkah',
  5: 'Egyptian General Authority of Survey',
  7: 'Institute of Geophysics, University of Tehran',
  8: 'Gulf Region',
  9: 'Kuwait',
  10: 'Qatar',
  11: 'Majlis Ugama Islam Singapura',
  12: 'Union Organization Islamic de France',
  13: 'Diyanet İşleri Başkanlığı, Turkey',
  14: 'Spiritual Administration of Muslims of Russia',
  15: 'Moonsighting Committee Worldwide',
} as const;

const STORAGE_KEY = 'revert-prayer-times';
const DEFAULT_METHOD = 2; // ISNA - good default for North America

/**
 * Fetch prayer times from Aladhan API with retry logic
 */
export const fetchPrayerTimes = async (
  location: Location,
  method: number = DEFAULT_METHOD
): Promise<PrayerTimesData> => {
  const today = new Date();
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=${method}`;

  try {
    // Use retry with exponential backoff
    const response = await fetchWithRetry(url, undefined, {
      ...RetryPresets.standard,
      onRetry: (attempt, error, delay) => {
        logger.debug(`Prayer times fetch retry ${attempt}, waiting ${delay}ms:`, error.message);
      },
    });

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid API response');
    }

    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    const prayerData: PrayerTimesData = {
      times: {
        fajr: formatTime(timings.Fajr),
        sunrise: formatTime(timings.Sunrise),
        dhuhr: formatTime(timings.Dhuhr),
        asr: formatTime(timings.Asr),
        maghrib: formatTime(timings.Maghrib),
        isha: formatTime(timings.Isha),
      },
      date: data.data.date.readable,
      hijriDate: hijri.day,
      hijriMonth: hijri.month.en,
      hijriYear: hijri.year,
      location: location.city
        ? `${location.city}, ${location.country}`
        : `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
      lastFetched: new Date().toISOString(),
    };

    // Cache the data
    await cachePrayerTimes(prayerData);

    return prayerData;
  } catch (error) {
    logger.error('Failed to fetch prayer times after retries:', error);

    // Try to return cached data
    const cached = await getCachedPrayerTimes();
    if (cached) {
      logger.debug('Using cached prayer times');
      return cached;
    }

    throw error;
  }
};

/**
 * Format time string (remove timezone suffix)
 */
const formatTime = (timeStr: string): string => {
  // API returns "05:30 (EST)" - we just want "05:30"
  return timeStr.split(' ')[0];
};

/**
 * Cache prayer times locally
 */
export const cachePrayerTimes = async (data: PrayerTimesData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    logger.error('Failed to cache prayer times:', error);
  }
};

/**
 * Get cached prayer times
 */
export const getCachedPrayerTimes = async (): Promise<PrayerTimesData | null> => {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    logger.error('Failed to get cached prayer times:', error);
    return null;
  }
};

/**
 * Check if cached data is still valid (same day)
 */
export const isCacheValid = (data: PrayerTimesData): boolean => {
  const cachedDate = new Date(data.lastFetched).toDateString();
  const today = new Date().toDateString();
  return cachedDate === today;
};

/**
 * Get the next prayer based on current time
 */
export const getNextPrayer = (times: PrayerTimes): { name: string; time: string; isToday: boolean } | null => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: times.fajr },
    { name: 'Dhuhr', time: times.dhuhr },
    { name: 'Asr', time: times.asr },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isha', time: times.isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentMinutes) {
      return { name: prayer.name, time: prayer.time, isToday: true };
    }
  }
  
  // All prayers passed, next is Fajr tomorrow
  return { name: 'Fajr', time: times.fajr, isToday: false };
};

/**
 * Get time until next prayer in minutes
 */
export const getMinutesUntilPrayer = (prayerTime: string, isToday: boolean): number => {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);
  
  if (!isToday) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }
  
  const diffMs = prayerDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

/**
 * Format minutes into hours and minutes string
 */
export const formatTimeRemaining = (totalMinutes: number): string => {
  if (totalMinutes < 1) return 'Now';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

/**
 * Check if a prayer time has passed today
 */
export const hasPrayerPassed = (prayerTime: string): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const prayerMinutes = hours * 60 + minutes;
  
  return currentMinutes > prayerMinutes;
};

/**
 * Convert 24h time to 12h format
 */
export const formatTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};
