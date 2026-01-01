// Audio Service - The Revert App
// Handles audio playback for Quran recitation, duas, and adhan

import { Audio, AVPlaybackStatus } from 'expo-av';
import { logger } from '../utils/logger';

// Audio source configurations
// Using everyayah.com for Quran audio (free, no API key required)
// Format: https://everyayah.com/data/{reciter}/{surah_padded}{ayah_padded}.mp3

export const RECITERS = {
  MISHARY_ALAFASY: 'Alafasy_128kbps',
  ABDUL_BASIT: 'Abdul_Basit_Murattal_128kbps',
  HUSARY: 'Husary_128kbps',
  MINSHAWI: 'Minshawi_Murattal_128kbps',
  SUDAIS: 'Sudais_128kbps',
} as const;

export type ReciterKey = keyof typeof RECITERS;
export type ReciterValue = typeof RECITERS[ReciterKey];

// Default reciter
let currentReciter: ReciterValue = RECITERS.MISHARY_ALAFASY;

// Sound object for managing playback
let sound: Audio.Sound | null = null;
let isPlaying = false;

// Audio state listeners
type AudioStateListener = (state: AudioState) => void;
const listeners: Set<AudioStateListener> = new Set();

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  isLoaded: boolean;
  error: string | null;
}

let currentState: AudioState = {
  isPlaying: false,
  isLoading: false,
  duration: 0,
  position: 0,
  isLoaded: false,
  error: null,
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(currentState));
};

const updateState = (updates: Partial<AudioState>) => {
  currentState = { ...currentState, ...updates };
  notifyListeners();
};

// Initialize audio mode
export const initializeAudio = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    logger.error('Failed to initialize audio:', error);
  }
};

// Build Quran audio URL
export const getQuranAudioUrl = (
  surahNumber: number,
  ayahNumber: number,
  reciter: string = currentReciter
): string => {
  const surahPadded = surahNumber.toString().padStart(3, '0');
  const ayahPadded = ayahNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciter}/${surahPadded}${ayahPadded}.mp3`;
};

// Build full surah audio URL (for downloading/streaming full surah)
export const getFullSurahAudioUrl = (
  surahNumber: number,
  reciter: string = currentReciter
): string => {
  // everyayah.com doesn't have full surah files, so we'd need to use a different source
  // or chain individual ayah files. For now, return the first ayah.
  return getQuranAudioUrl(surahNumber, 1, reciter);
};

// Set reciter
export const setReciter = (reciterKey: ReciterKey): void => {
  currentReciter = RECITERS[reciterKey];
};

// Get current reciter
export const getCurrentReciter = (): string => currentReciter;

// Play audio from URL
export const playAudio = async (url: string): Promise<void> => {
  try {
    updateState({ isLoading: true, error: null });

    // Unload previous sound if exists
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }

    // Create and load new sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    sound = newSound;
    isPlaying = true;
    updateState({ isLoading: false, isPlaying: true, isLoaded: true });
  } catch (error) {
    logger.error('Failed to play audio:', error);
    updateState({
      isLoading: false,
      isPlaying: false,
      error: 'Failed to load audio. Please check your connection.',
    });
  }
};

// Playback status callback
const onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
  if (status.isLoaded) {
    updateState({
      isPlaying: status.isPlaying,
      duration: status.durationMillis || 0,
      position: status.positionMillis || 0,
      isLoaded: true,
    });

    if (status.didJustFinish) {
      updateState({ isPlaying: false, position: 0 });
      isPlaying = false;
    }
  } else if (status.error) {
    updateState({
      error: `Playback error: ${status.error}`,
      isPlaying: false,
    });
  }
};

// Play Quran ayah
export const playQuranAyah = async (
  surahNumber: number,
  ayahNumber: number
): Promise<void> => {
  const url = getQuranAudioUrl(surahNumber, ayahNumber);
  await playAudio(url);
};

// Pause audio
export const pauseAudio = async (): Promise<void> => {
  if (sound) {
    await sound.pauseAsync();
    isPlaying = false;
    updateState({ isPlaying: false });
  }
};

// Resume audio
export const resumeAudio = async (): Promise<void> => {
  if (sound) {
    await sound.playAsync();
    isPlaying = true;
    updateState({ isPlaying: true });
  }
};

// Stop audio
export const stopAudio = async (): Promise<void> => {
  if (sound) {
    await sound.stopAsync();
    await sound.setPositionAsync(0);
    isPlaying = false;
    updateState({ isPlaying: false, position: 0 });
  }
};

// Seek to position
export const seekTo = async (positionMs: number): Promise<void> => {
  if (sound) {
    await sound.setPositionAsync(positionMs);
  }
};

// Toggle play/pause
export const togglePlayPause = async (): Promise<void> => {
  if (isPlaying) {
    await pauseAudio();
  } else {
    await resumeAudio();
  }
};

// Unload audio (cleanup)
export const unloadAudio = async (): Promise<void> => {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
    isPlaying = false;
    updateState({
      isPlaying: false,
      isLoading: false,
      duration: 0,
      position: 0,
      isLoaded: false,
      error: null,
    });
  }
};

// Subscribe to audio state changes
export const subscribeToAudioState = (listener: AudioStateListener): (() => void) => {
  listeners.add(listener);
  // Immediately call with current state
  listener(currentState);
  // Return unsubscribe function
  return () => listeners.delete(listener);
};

// Get current audio state
export const getAudioState = (): AudioState => currentState;

// Adhan audio configuration
// Using reliable CDN sources for adhan audio
export const ADHAN_AUDIO = {
  MECCA: {
    name: 'Makkah (Haramain)',
    url: 'https://download.quranicaudio.com/adhan/mishary-rashid-alafasy.mp3',
  },
  MADINA: {
    name: 'Madinah Style',
    url: 'https://download.quranicaudio.com/adhan/adhan-madina.mp3',
  },
  FAJR: {
    name: 'Fajr Adhan',
    url: 'https://download.quranicaudio.com/adhan/fajr-adhan.mp3',
  },
} as const;

export type AdhanType = keyof typeof ADHAN_AUDIO;

// Play adhan with error handling
export const playAdhan = async (type: AdhanType = 'MECCA'): Promise<void> => {
  try {
    const adhan = ADHAN_AUDIO[type];
    await playAudio(adhan.url);
  } catch (error) {
    logger.error('Failed to play adhan:', error);
    updateState({
      error: 'Unable to play adhan. Please check your connection.',
      isLoading: false,
    });
  }
};

// Get adhan options for display
export const getAdhanOptions = () => {
  return Object.entries(ADHAN_AUDIO).map(([key, value]) => ({
    id: key as AdhanType,
    name: value.name,
  }));
};

export default {
  initializeAudio,
  playAudio,
  playQuranAyah,
  pauseAudio,
  resumeAudio,
  stopAudio,
  togglePlayPause,
  seekTo,
  unloadAudio,
  playAdhan,
  setReciter,
  getCurrentReciter,
  getQuranAudioUrl,
  subscribeToAudioState,
  getAudioState,
  getAdhanOptions,
  RECITERS,
  ADHAN_AUDIO,
};
