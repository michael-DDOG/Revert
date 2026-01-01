// useQibla Hook
// Calculates Qibla direction and provides compass functionality

import { useState, useEffect, useCallback } from 'react';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

// Kaaba coordinates
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

interface UseQiblaResult {
  qiblaDirection: number; // Degrees from North (0-360)
  compassHeading: number; // Current device heading (0-360)
  qiblaFromDevice: number; // Direction to turn device to face Qibla
  distanceToKaaba: number; // Distance in kilometers
  isCalibrated: boolean;
  isAvailable: boolean;
  error: string | null;
  accuracy: 'low' | 'medium' | 'high';
  startCompass: () => void;
  stopCompass: () => void;
}

/**
 * Calculate bearing between two coordinates
 * Returns degrees from North (0-360)
 */
const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  return bearing;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
};

/**
 * Calculate heading from magnetometer data
 */
const calculateHeading = (x: number, y: number): number => {
  let heading = Math.atan2(y, x) * (180 / Math.PI);
  heading = (heading + 360) % 360;
  return heading;
};

export const useQibla = (): UseQiblaResult => {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [distanceToKaaba, setDistanceToKaaba] = useState<number>(0);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<'low' | 'medium' | 'high'>('low');
  const [subscription, setSubscription] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user location and calculate Qibla direction
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            setError('Location permission required for Qibla direction');
            return;
          }
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });

        // Calculate Qibla direction from user's location
        const bearing = calculateBearing(latitude, longitude, KAABA_LATITUDE, KAABA_LONGITUDE);
        setQiblaDirection(bearing);

        // Calculate distance to Kaaba
        const distance = calculateDistance(latitude, longitude, KAABA_LATITUDE, KAABA_LONGITUDE);
        setDistanceToKaaba(distance);

      } catch (err) {
        console.error('Failed to get location:', err);
        setError('Could not determine your location');
      }
    };

    getLocation();
  }, []);

  // Check magnetometer availability
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await Magnetometer.isAvailableAsync();
      setIsAvailable(available);
      
      if (!available) {
        setError('Compass not available on this device');
      }
    };

    checkAvailability();
  }, []);

  // Start compass
  const startCompass = useCallback(() => {
    if (!isAvailable) {
      setError('Compass not available');
      return;
    }

    // Set update interval (100ms for smooth animation)
    Magnetometer.setUpdateInterval(100);

    const sub = Magnetometer.addListener((data) => {
      const { x, y } = data;
      const heading = calculateHeading(x, y);
      
      setCompassHeading(heading);
      
      // Determine accuracy based on magnetic field strength
      const magnitude = Math.sqrt(x * x + y * y);
      if (magnitude > 40) {
        setAccuracy('high');
        setIsCalibrated(true);
      } else if (magnitude > 20) {
        setAccuracy('medium');
        setIsCalibrated(true);
      } else {
        setAccuracy('low');
        setIsCalibrated(false);
      }
    });

    setSubscription(sub);
  }, [isAvailable]);

  // Stop compass
  const stopCompass = useCallback(() => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  }, [subscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  // Calculate direction to turn device to face Qibla
  const qiblaFromDevice = (qiblaDirection - compassHeading + 360) % 360;

  return {
    qiblaDirection,
    compassHeading,
    qiblaFromDevice,
    distanceToKaaba,
    isCalibrated,
    isAvailable,
    error,
    accuracy,
    startCompass,
    stopCompass,
  };
};

export default useQibla;
