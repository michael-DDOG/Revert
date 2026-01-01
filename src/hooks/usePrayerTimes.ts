// usePrayerTimes Hook
// Manages prayer times fetching, caching, and location

import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import {
  PrayerTimesData,
  fetchPrayerTimes,
  getCachedPrayerTimes,
  isCacheValid,
  getNextPrayer,
  getMinutesUntilPrayer,
  Location as LocationType,
} from '../services/prayerTimesService';

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesData | null;
  nextPrayer: { name: string; time: string; isToday: boolean } | null;
  minutesUntilNext: number;
  isLoading: boolean;
  error: string | null;
  location: LocationType | null;
  refresh: () => Promise<void>;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  requestPermission: () => Promise<boolean>;
}

export const usePrayerTimes = (): UsePrayerTimesResult => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; isToday: boolean } | null>(null);
  const [minutesUntilNext, setMinutesUntilNext] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  // Request location permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } catch (err) {
      console.error('Permission request failed:', err);
      setPermissionStatus('denied');
      return false;
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<LocationType | null> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission required for accurate prayer times');
          return null;
        }
      }

      setPermissionStatus('granted');
      
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Try to get city name
      let city: string | undefined;
      let country: string | undefined;
      
      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        if (geocode) {
          city = geocode.city || geocode.subregion || undefined;
          country = geocode.country || undefined;
        }
      } catch (geocodeErr) {
        console.log('Geocoding failed, using coordinates only');
      }

      const loc: LocationType = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city,
        country,
      };
      
      setLocation(loc);
      return loc;
    } catch (err) {
      console.error('Failed to get location:', err);
      setError('Could not get your location');
      return null;
    }
  }, [requestPermission]);

  // Fetch prayer times
  const fetchTimes = useCallback(async (loc: LocationType) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchPrayerTimes(loc);
      setPrayerTimes(data);
      
      // Calculate next prayer
      const next = getNextPrayer(data.times);
      setNextPrayer(next);
      
      if (next) {
        setMinutesUntilNext(getMinutesUntilPrayer(next.time, next.isToday));
      }
    } catch (err) {
      console.error('Failed to fetch prayer times:', err);
      setError('Could not fetch prayer times');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh prayer times
  const refresh = useCallback(async () => {
    const loc = location || await getCurrentLocation();
    if (loc) {
      await fetchTimes(loc);
    }
  }, [location, getCurrentLocation, fetchTimes]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      // First try cached data
      const cached = await getCachedPrayerTimes();
      
      if (cached && isCacheValid(cached)) {
        setPrayerTimes(cached);
        const next = getNextPrayer(cached.times);
        setNextPrayer(next);
        if (next) {
          setMinutesUntilNext(getMinutesUntilPrayer(next.time, next.isToday));
        }
        setIsLoading(false);
        
        // Still refresh in background
        const loc = await getCurrentLocation();
        if (loc) {
          fetchTimes(loc);
        }
      } else {
        // No valid cache, fetch fresh
        const loc = await getCurrentLocation();
        if (loc) {
          await fetchTimes(loc);
        } else {
          setIsLoading(false);
        }
      }
    };

    initialize();
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const next = getNextPrayer(prayerTimes.times);
      setNextPrayer(next);
      
      if (next) {
        setMinutesUntilNext(getMinutesUntilPrayer(next.time, next.isToday));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  return {
    prayerTimes,
    nextPrayer,
    minutesUntilNext,
    isLoading,
    error,
    location,
    refresh,
    permissionStatus,
    requestPermission,
  };
};

export default usePrayerTimes;
