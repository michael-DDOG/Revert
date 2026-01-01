import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { theme } from '../constants/theme';

type JourneyStackParamList = {
  Journey: undefined;
  DayDetail: { dayId: number };
};
import { useProgressStore } from '../store/useProgressStore';
import { foundationJourney } from '../data/foundationJourney';
import { prayerJourney } from '../data/prayerJourney';
import { quranJourney } from '../data/quranJourney';
import { livingIslamJourney } from '../data/livingIslamJourney';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Days 1-30',
    description: 'Build your foundation in Islam. Learn the basics of faith, prayer, and daily practice.',
    icon: '🌱',
    daysRange: [1, 30],
    isLocked: false,
  },
  {
    id: 'prayer',
    title: 'Establishing Prayer',
    subtitle: 'Days 31-60',
    description: 'Master the prayer. Learn Wudu, surahs, Tajweed, and develop khushu.',
    icon: '🤲',
    daysRange: [31, 60],
    isLocked: false,
    requiredLevel: 2,
  },
  {
    id: 'quran',
    title: 'Understanding Quran',
    subtitle: 'Days 61-90',
    description: 'Connect with the Quran. Learn Arabic basics, tafsir, and memorization techniques.',
    icon: '📖',
    daysRange: [61, 90],
    isLocked: true,
    requiredLevel: 3,
  },
  {
    id: 'living',
    title: 'Living Islam',
    subtitle: 'Days 91-120',
    description: 'Apply Islam in daily life. Family, work, relationships, and character development.',
    icon: '🌟',
    daysRange: [91, 120],
    isLocked: true,
    requiredLevel: 4,
  },
];

const getDaysForTrack = (trackId: string) => {
  switch (trackId) {
    case 'foundation':
      return foundationJourney;
    case 'prayer':
      return prayerJourney;
    case 'quran':
      return quranJourney;
    case 'living':
      return livingIslamJourney;
    default:
      return [];
  }
};

export const JourneyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<JourneyStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { currentDay, completedDays, level } = useProgressStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDayPress = (dayId: number) => {
    navigation.navigate('DayDetail', { dayId });
  };

  const isTrackUnlocked = (track: Track) => {
    if (!track.isLocked) return true;
    if (track.requiredLevel && level >= track.requiredLevel) return true;
    // Also unlock if previous track is complete
    const prevTrackIndex = TRACKS.findIndex(t => t.id === track.id) - 1;
    if (prevTrackIndex >= 0) {
      const prevTrack = TRACKS[prevTrackIndex];
      const prevTrackComplete = completedDays.includes(prevTrack.daysRange[1]);
      return prevTrackComplete;
    }
    return false;
  };

  const getTrackProgress = (track: Track) => {
    const [start, end] = track.daysRange;
    const trackDays = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const completedInTrack = trackDays.filter(d => completedDays.includes(d)).length;
    return Math.round((completedInTrack / trackDays.length) * 100);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Your Journey</Text>
        <Text style={styles.subtitle}>
          {completedDays.length} days completed • Currently on Day {currentDay}
        </Text>

        {/* Tracks */}
        {TRACKS.map((track) => {
          const unlocked = isTrackUnlocked(track);
          const progress = getTrackProgress(track);
          const days = getDaysForTrack(track.id);
          
          return (
            <View key={track.id} style={styles.trackSection}>
              {/* Track Header */}
              <View style={[styles.trackHeader, !unlocked && styles.trackLocked]}>
                <View style={styles.trackIcon}>
                  <Text style={styles.trackIconText}>{track.icon}</Text>
                </View>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, !unlocked && styles.textLocked]}>
                    {track.title}
                  </Text>
                  <Text style={[styles.trackSubtitle, !unlocked && styles.textLocked]}>
                    {track.subtitle}
                  </Text>
                  {unlocked && progress > 0 && (
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                  )}
                </View>
                {!unlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockText}>🔒</Text>
                  </View>
                )}
              </View>

              {/* Days Grid */}
              {unlocked && days.length > 0 && (
                <View style={styles.daysGrid}>
                  {days.map((day) => {
                    const isCompleted = completedDays.includes(day.id);
                    const isCurrent = day.id === currentDay;
                    const isAccessible = day.id <= currentDay;
                    
                    return (
                      <TouchableOpacity
                        key={day.id}
                        style={[
                          styles.dayItem,
                          isCompleted && styles.dayCompleted,
                          isCurrent && styles.dayCurrent,
                          !isAccessible && styles.dayLocked,
                        ]}
                        onPress={() => isAccessible && handleDayPress(day.id)}
                        disabled={!isAccessible}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.dayNumber,
                          isCompleted && styles.dayNumberCompleted,
                          isCurrent && styles.dayNumberCurrent,
                          !isAccessible && styles.dayNumberLocked,
                        ]}>
                          {isCompleted ? '✓' : day.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Locked Message */}
              {!unlocked && (
                <View style={styles.lockedMessage}>
                  <Text style={styles.lockedText}>
                    Complete the previous track to unlock
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Future Content */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>Your Journey Continues</Text>
          <Text style={styles.comingSoonText}>
            Seasonal content, Ramadan specials, and advanced spiritual development tracks coming soon.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.View>
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
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  trackSection: {
    marginBottom: theme.spacing.xl,
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  trackLocked: {
    opacity: 0.6,
  },
  trackIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  trackIconText: {
    fontSize: 24,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  trackSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  textLocked: {
    color: theme.colors.textMuted,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    fontSize: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  dayCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayCurrent: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  dayLocked: {
    opacity: 0.4,
  },
  dayNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  dayNumberCompleted: {
    color: '#fff',
  },
  dayNumberCurrent: {
    color: theme.colors.primary,
  },
  dayNumberLocked: {
    color: theme.colors.textMuted,
  },
  lockedMessage: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  lockedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  comingSoon: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  comingSoonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default JourneyScreen;
