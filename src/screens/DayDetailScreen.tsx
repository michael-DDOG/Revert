import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useProgressStore } from '../store/useProgressStore';
import { foundationJourney } from '../data/foundationJourney';
import { prayerJourney } from '../data/prayerJourney';
import { Day } from '../types';

type JourneyStackParamList = {
  Journey: undefined;
  DayDetail: { dayId: number };
};
type DayDetailRouteProp = RouteProp<JourneyStackParamList, 'DayDetail'>;

const getAllDays = (): Day[] => {
  return [...foundationJourney, ...prayerJourney];
};

export const DayDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<JourneyStackParamList>>();
  const route = useRoute<DayDetailRouteProp>();
  const { dayId } = route.params;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const { completedDays, markDayComplete, currentDay } = useProgressStore();
  
  const allDays = getAllDays();
  const day = allDays.find(d => d.id === dayId);
  const isCompleted = completedDays.includes(dayId);
  const canComplete = dayId === currentDay && !isCompleted;

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
    // Show celebration or navigate
    navigation.goBack();
  };

  const getTrackName = (id: number): string => {
    if (id <= 30) return 'Foundation';
    if (id <= 60) return 'Establishing Prayer';
    if (id <= 90) return 'Understanding Quran';
    return 'Living Islam';
  };

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.trackName}>{getTrackName(dayId)}</Text>
            <Text style={styles.dayTitle}>Day {day.id}</Text>
            <Text style={styles.title}>{day.title}</Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Completed</Text>
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
            <Text style={styles.reflectionTitle}>📝 Reflection Question</Text>
            <Text style={styles.reflectionText}>{day.reflection}</Text>
          </View>

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
  header: {
    marginBottom: theme.spacing.xl,
  },
  trackName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  dayTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
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
