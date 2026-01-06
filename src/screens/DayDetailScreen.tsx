import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useProgressStore } from '../store/useProgressStore';
import { foundationJourney } from '../data/foundationJourney';
import { prayerJourney } from '../data/prayerJourney';
import { quranJourney } from '../data/quranJourney';
import { livingIslamJourney } from '../data/livingIslamJourney';
import { communityJourney } from '../data/communityJourney';
import { deepeningFaithJourney } from '../data/deepeningFaithJourney';
import { advancedJourney } from '../data/advancedJourney';
import { Day } from '../types';
import { playAudio, stopAudio } from '../services';

type JourneyStackParamList = {
  Journey: undefined;
  DayDetail: { dayId: number };
};
type DayDetailRouteProp = RouteProp<JourneyStackParamList, 'DayDetail'>;

const getAllDays = (): Day[] => {
  return [
    ...foundationJourney,
    ...prayerJourney,
    ...quranJourney,
    ...livingIslamJourney,
    ...communityJourney,
    ...deepeningFaithJourney,
    ...advancedJourney,
  ];
};

const TOTAL_DAYS = 360; // Total journey days

export const DayDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<JourneyStackParamList>>();
  const route = useRoute<DayDetailRouteProp>();
  const { dayId } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);

  const { completedDays, markDayComplete, currentDay } = useProgressStore();

  const allDays = getAllDays();
  const day = allDays.find(d => d.id === dayId);
  const isCompleted = completedDays.includes(dayId);
  const canComplete = dayId === currentDay && !isCompleted;

  // Progress calculation
  const progressPercent = Math.round((dayId / TOTAL_DAYS) * 100);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleComplete = () => {
    markDayComplete(dayId);
    navigation.goBack();
  };

  const handlePlayAudio = async (audioUrl: string, index: number) => {
    try {
      if (isPlayingAudio && playingAudioIndex === index) {
        await stopAudio();
        setIsPlayingAudio(false);
        setPlayingAudioIndex(null);
      } else {
        await stopAudio();
        await playAudio(audioUrl);
        setIsPlayingAudio(true);
        setPlayingAudioIndex(index);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleOpenResource = (url: string) => {
    Linking.openURL(url);
  };

  const getTrackName = (id: number): string => {
    if (id <= 30) return 'Foundation';
    if (id <= 60) return 'Establishing Prayer';
    if (id <= 90) return 'Understanding Quran';
    if (id <= 120) return 'Living Islam';
    if (id <= 180) return 'Community & Character';
    if (id <= 270) return 'Deepening Faith';
    return 'Advanced Spirituality';
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  if (!day) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Day not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Day {dayId} of {TOTAL_DAYS}</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.trackName}>{getTrackName(dayId)}</Text>
            <Text style={styles.title}>{day.title.replace(`Day ${dayId}: `, '')}</Text>
            {day.isRamadanRelevant && (
              <View style={styles.ramadanBadge}>
                <Text style={styles.ramadanText}>Ramadan Relevant</Text>
              </View>
            )}
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{day.description}</Text>
          </View>

          {/* Main Guidance */}
          <View style={styles.guidanceSection}>
            <Text style={styles.sectionTitle}>Today's Guidance</Text>
            <Text style={styles.guidance}>{day.guidance}</Text>
          </View>

          {/* Reflection */}
          <View style={styles.reflectionSection}>
            <Text style={styles.reflectionTitle}>Reflection Question</Text>
            <Text style={styles.reflectionText}>{day.reflection}</Text>
          </View>

          {/* Audio Section */}
          {day.audio && day.audio.length > 0 && (
            <View style={styles.audioSection}>
              <Text style={styles.sectionTitle}>Listen & Learn</Text>
              {day.audio.map((audio, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.audioCard}
                  onPress={() => handlePlayAudio(audio.audioUrl, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.audioIcon}>
                    <Text style={styles.audioIconText}>
                      {isPlayingAudio && playingAudioIndex === index ? '⏸' : '▶'}
                    </Text>
                  </View>
                  <View style={styles.audioInfo}>
                    <Text style={styles.audioTitle}>
                      {audio.surahName ? `Surah ${audio.surahName}` : 'Audio'}
                    </Text>
                    {audio.description && (
                      <Text style={styles.audioDescription}>{audio.description}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Resources Section */}
          {day.resources && day.resources.length > 0 && (
            <View style={styles.resourcesSection}>
              <Text style={styles.sectionTitle}>Resources</Text>
              {day.resources.map((resource, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resourceCard}
                  onPress={() => handleOpenResource(resource.url)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resourceIcon}>
                    <Text style={styles.resourceIconText}>
                      {resource.type === 'mosque_finder' ? '🕌' :
                       resource.type === 'video' ? '🎥' :
                       resource.type === 'article' ? '📄' :
                       resource.type === 'app' ? '📱' : '🔗'}
                    </Text>
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    {resource.description && (
                      <Text style={styles.resourceDescription}>{resource.description}</Text>
                    )}
                  </View>
                  <Text style={styles.resourceArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Navigation hints */}
          <View style={styles.navHints}>
            {dayId > 1 && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('DayDetail', { dayId: dayId - 1 })}
              >
                <Text style={styles.navButtonText}>← Day {dayId - 1}</Text>
              </TouchableOpacity>
            )}
            {dayId < allDays.length && isCompleted && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigation.navigate('DayDetail', { dayId: dayId + 1 })}
              >
                <Text style={styles.navButtonText}>Day {dayId + 1} →</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      {canComplete && (
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Complete Day {dayId}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompleted && (
        <View style={styles.bottomBar}>
          <View style={styles.completedBar}>
            <Text style={styles.completedBarText}>✓ You've completed this day</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  // Progress Bar
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  progressPercent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.card,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  trackName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: 36,
  },
  completedBadge: {
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.md,
  },
  completedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  ramadanBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  ramadanText: {
    fontSize: theme.fontSize.xs,
    color: '#8b5cf6',
    fontWeight: theme.fontWeight.medium,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  description: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    lineHeight: 28,
  },
  guidanceSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  guidance: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 26,
  },
  reflectionSection: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  reflectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  reflectionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  // Audio Section
  audioSection: {
    marginBottom: theme.spacing.xl,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  audioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  audioIconText: {
    fontSize: 20,
    color: '#fff',
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  audioDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  // Resources Section
  resourcesSection: {
    marginBottom: theme.spacing.xl,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  resourceIconText: {
    fontSize: 18,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  resourceDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  resourceArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  navHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  navButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  navButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  completedBar: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  completedBarText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default DayDetailScreen;
