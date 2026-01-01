// useAudio Hook - The Revert App
// React hook for audio playback

import { useState, useEffect, useCallback } from 'react';
import {
  AudioState,
  playAudio,
  playQuranAyah,
  pauseAudio,
  resumeAudio,
  stopAudio,
  togglePlayPause,
  seekTo,
  unloadAudio,
  playAdhan,
  subscribeToAudioState,
  initializeAudio,
  AdhanType,
} from '../services/audioService';

export interface UseAudioReturn {
  // State
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  isLoaded: boolean;
  error: string | null;
  progress: number; // 0-1

  // Actions
  play: (url: string) => Promise<void>;
  playAyah: (surahNumber: number, ayahNumber: number) => Promise<void>;
  playAdhanSound: (type?: AdhanType) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  seekToProgress: (progress: number) => Promise<void>;
}

export const useAudio = (): UseAudioReturn => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    position: 0,
    isLoaded: false,
    error: null,
  });

  useEffect(() => {
    // Initialize audio on mount
    initializeAudio();

    // Subscribe to audio state changes
    const unsubscribe = subscribeToAudioState(setState);

    // Cleanup on unmount
    return () => {
      unsubscribe();
      unloadAudio();
    };
  }, []);

  const play = useCallback(async (url: string) => {
    await playAudio(url);
  }, []);

  const playAyah = useCallback(async (surahNumber: number, ayahNumber: number) => {
    await playQuranAyah(surahNumber, ayahNumber);
  }, []);

  const playAdhanSound = useCallback(async (type?: AdhanType) => {
    await playAdhan(type);
  }, []);

  const pause = useCallback(async () => {
    await pauseAudio();
  }, []);

  const resume = useCallback(async () => {
    await resumeAudio();
  }, []);

  const stop = useCallback(async () => {
    await stopAudio();
  }, []);

  const toggle = useCallback(async () => {
    await togglePlayPause();
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    await seekTo(positionMs);
  }, []);

  const seekToProgress = useCallback(async (progress: number) => {
    if (state.duration > 0) {
      const positionMs = progress * state.duration;
      await seekTo(positionMs);
    }
  }, [state.duration]);

  const progress = state.duration > 0 ? state.position / state.duration : 0;

  return {
    // State
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    duration: state.duration,
    position: state.position,
    isLoaded: state.isLoaded,
    error: state.error,
    progress,

    // Actions
    play,
    playAyah,
    playAdhanSound,
    pause,
    resume,
    stop,
    toggle,
    seek,
    seekToProgress,
  };
};

export default useAudio;
