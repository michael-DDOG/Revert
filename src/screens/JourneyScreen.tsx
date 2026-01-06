import React, { useRef, useEffect, useState } from 'react';
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
import { deepeningFaithJourney } from '../data/deepeningFaithJourney';
import { Track } from '../types';

// Ramadan days from deepeningFaithJourney (Days 191-200)
const RAMADAN_DAYS = deepeningFaithJourney.filter(day => day.isRamadanRelevant);

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
  const [showRamadanMode, setShowRamadanMode] = useState(false);

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

        {/* Ramadan Quick Start Card */}
        <TouchableOpacity
          style={styles.ramadanCard}
          onPress={() => setShowRamadanMode(!showRamadanMode)}
          activeOpacity={0.8}
        >
          <View style={styles.ramadanHeader}>
            <View style={styles.ramadanIconContainer}>
              <Text style={styles.ramadanIcon}>🌙</Text>
            </View>
            <View style={styles.ramadanInfo}>
              <Text style={styles.ramadanTitle}>Ramadan Quick Start</Text>
              <Text style={styles.ramadanSubtitle}>
                {showRamadanMode
                  ? 'Tap to return to regular journey'
                  : 'Starting Ramadan? Access fasting guides now'}
              </Text>
            </View>
            <Text style={styles.ramadanArrow}>{showRamadanMode ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>

        {/* Ramadan Days Grid */}
        {showRamadanMode && (
          <View style={styles.ramadanSection}>
            <Text style={styles.ramadanSectionTitle}>
              Essential Ramadan Content
            </Text>
            <Text style={styles.ramadanSectionDescription}>
              10 days of guidance covering fasting, Tarawih, Quran, charity, and Eid
            </Text>
            <View style={styles.ramadanDaysGrid}>
              {RAMADAN_DAYS.map((day, index) => {
                const isCompleted = completedDays.includes(day.id);
                const dayNumber = index + 1;

                return (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.ramadanDayItem,
                      isCompleted && styles.ramadanDayCompleted,
                    ]}
                    onPress={() => handleDayPress(day.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.ramadanDayNumber,
                      isCompleted && styles.ramadanDayNumberCompleted,
                    ]}>
                      {isCompleted ? '✓' : dayNumber}
                    </Text>
                    <Text
                      style={[
                        styles.ramadanDayTitle,
                        isCompleted && styles.ramadanDayTitleCompleted,
                      ]}
                      numberOfLines={2}
                    >
                      {day.title.replace(/^Day \d+: /, '')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

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
            More tracks unlocking as you progress: Community (Days 121-180), Deepening Faith (Days 181-270), and Advanced Spirituality (Days 271-360+).
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
  // Ramadan Quick Start styles
  ramadanCard: {
    backgroundColor: '#1a3a2a',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#2d5a4a',
  },
  ramadanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ramadanIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d5a4a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  ramadanIcon: {
    fontSize: 24,
  },
  ramadanInfo: {
    flex: 1,
  },
  ramadanTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: '#7fdbba',
    marginBottom: 2,
  },
  ramadanSubtitle: {
    fontSize: theme.fontSize.sm,
    color: '#5fb89a',
  },
  ramadanArrow: {
    fontSize: 14,
    color: '#7fdbba',
    marginLeft: theme.spacing.sm,
  },
  ramadanSection: {
    backgroundColor: '#152a22',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    marginTop: -theme.spacing.sm,
  },
  ramadanSectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: '#7fdbba',
    marginBottom: theme.spacing.xs,
  },
  ramadanSectionDescription: {
    fontSize: theme.fontSize.sm,
    color: '#5fb89a',
    marginBottom: theme.spacing.md,
  },
  ramadanDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ramadanDayItem: {
    width: '47%',
    backgroundColor: '#1a3a2a',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d5a4a',
  },
  ramadanDayCompleted: {
    backgroundColor: '#2d5a4a',
    borderColor: '#7fdbba',
  },
  ramadanDayNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2d5a4a',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#7fdbba',
    marginRight: theme.spacing.sm,
  },
  ramadanDayNumberCompleted: {
    backgroundColor: '#7fdbba',
    color: '#152a22',
  },
  ramadanDayTitle: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    color: '#a8d8c8',
    lineHeight: 16,
  },
  ramadanDayTitleCompleted: {
    color: '#d4f0e4',
  },
});

export default JourneyScreen;
