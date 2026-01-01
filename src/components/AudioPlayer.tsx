// AudioPlayer Component - The Revert App
// Reusable audio player with play/pause, progress bar

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../constants/theme';
import { useAudio } from '../hooks/useAudio';

interface AudioPlayerProps {
  // For Quran ayah playback
  surahNumber?: number;
  ayahNumber?: number;
  // Or direct URL
  audioUrl?: string;
  // Display
  label?: string;
  compact?: boolean;
  showProgress?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surahNumber,
  ayahNumber,
  audioUrl,
  label,
  compact = false,
  showProgress = true,
}) => {
  const {
    isPlaying,
    isLoading,
    progress,
    error,
    toggle,
    playAyah,
    play,
  } = useAudio();

  const handlePress = async () => {
    if (isPlaying) {
      await toggle();
    } else if (surahNumber && ayahNumber) {
      await playAyah(surahNumber, ayahNumber);
    } else if (audioUrl) {
      await play(audioUrl);
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Text style={styles.compactIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        )}
        {label && <Text style={styles.compactLabel}>{label}</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.playerRow}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePress}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          )}
        </TouchableOpacity>

        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Inline audio button for use within text/cards
interface AudioButtonProps {
  surahNumber?: number;
  ayahNumber?: number;
  audioUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  surahNumber,
  ayahNumber,
  audioUrl,
  size = 'medium',
}) => {
  const { isPlaying, isLoading, toggle, playAyah, play } = useAudio();

  const handlePress = async () => {
    if (isPlaying) {
      await toggle();
    } else if (surahNumber && ayahNumber) {
      await playAyah(surahNumber, ayahNumber);
    } else if (audioUrl) {
      await play(audioUrl);
    }
  };

  const sizeStyles = {
    small: { width: 28, height: 28, fontSize: 12 },
    medium: { width: 36, height: 36, fontSize: 16 },
    large: { width: 48, height: 48, fontSize: 20 },
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.audioButton,
        { width: currentSize.width, height: currentSize.height },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Text style={{ fontSize: currentSize.fontSize }}>
          {isPlaying ? '⏸️' : '🔊'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: '#fff',
  },
  progressContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  compactIcon: {
    fontSize: 16,
  },
  compactLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.fontWeight.medium,
  },
  // Audio button styles
  audioButton: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioPlayer;
