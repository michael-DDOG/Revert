import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useProgressStore } from '../store/useProgressStore';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { dailyAyahs } from '../data/dailyAyahs';
import { dailyDuas } from '../data/dailyDuas';
import { getNameOfDay } from '../data/namesOfAllah';
import { getLevelInfo } from '../data/gamificationData';
import { formatTo12Hour, formatTimeRemaining } from '../services/prayerTimesService';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const { name, getPersonalizedGreeting, getDaysSinceShadaha } = useOnboardingStore();
  const { 
    currentDay, 
    streak, 
    xp, 
    level, 
    completedDays,
    todaysPrayers,
    checkAndUpdateStreak,
  } = useProgressStore();
  
  const { nextPrayer, minutesUntilNext, prayerTimes } = usePrayerTimes();

  const levelInfo = getLevelInfo(level);
  const daysSinceShadaha = getDaysSinceShadaha();

  // Get today's content based on current day
  const todaysAyah = dailyAyahs[(currentDay - 1) % dailyAyahs.length];
  const todaysDua = dailyDuas[(currentDay - 1) % dailyDuas.length];
  const todaysName = getNameOfDay(currentDay);

  // Count prayers completed today
  const prayersToday = Object.values(todaysPrayers).filter(v => v === true).length;

  useEffect(() => {
    checkAndUpdateStreak();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()}, {name || 'Friend'}</Text>
        <Text style={styles.subtitle}>
          {(daysSinceShadaha ?? 0) > 0
            ? `Day ${daysSinceShadaha} of your beautiful journey`
            : 'Welcome to your new beginning'
          }
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedDays.length}</Text>
            <Text style={styles.statLabel}>Days Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{levelInfo.icon}</Text>
            <Text style={styles.statLabel}>{levelInfo.title}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Continue Journey Card */}
      <TouchableOpacity 
        style={styles.continueCard}
        onPress={() => navigation.navigate('Journey' as never)}
        activeOpacity={0.8}
      >
        <View style={styles.continueContent}>
          <Text style={styles.continueLabel}>CONTINUE YOUR JOURNEY</Text>
          <Text style={styles.continueDay}>Day {currentDay}</Text>
          <Text style={styles.continueHint}>Tap to continue →</Text>
        </View>
        <View style={styles.continueProgress}>
          <Text style={styles.progressPercent}>
            {Math.round((completedDays.length / 365) * 100)}%
          </Text>
        </View>
      </TouchableOpacity>

      {/* Next Prayer Card */}
      {nextPrayer && (
        <TouchableOpacity 
          style={styles.nextPrayerCard}
          onPress={() => navigation.navigate('Prayer' as never)}
          activeOpacity={0.8}
        >
          <View style={styles.nextPrayerInfo}>
            <Text style={styles.nextPrayerLabel}>NEXT PRAYER</Text>
            <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
          </View>
          <View style={styles.nextPrayerTimeContainer}>
            <Text style={styles.nextPrayerTime}>
              {formatTo12Hour(nextPrayer.time)}
            </Text>
            <Text style={styles.nextPrayerCountdown}>
              {nextPrayer.isToday ? 'in ' : 'tomorrow '}{formatTimeRemaining(minutesUntilNext)}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Prayer Tracker */}
      <View style={styles.prayerCard}>
        <Text style={styles.sectionTitle}>Today's Prayers</Text>
        <View style={styles.prayerRow}>
          {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
            <View key={prayer} style={styles.prayerItem}>
              <View style={[
                styles.prayerDot,
                todaysPrayers[prayer as keyof typeof todaysPrayers] ? styles.prayerDotDone : undefined
              ]} />
              <Text style={styles.prayerName}>
                {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.prayerCount}>{prayersToday}/5 Prayers Logged</Text>
      </View>

      {/* Ayah of the Day */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Ayah of the Day</Text>
        <Text style={styles.arabicText}>{todaysAyah.arabic}</Text>
        <Text style={styles.transliteration}>{todaysAyah.transliteration}</Text>
        <Text style={styles.translation}>"{todaysAyah.translation}"</Text>
        <Text style={styles.source}>— {todaysAyah.surah} ({todaysAyah.surahNumber}:{todaysAyah.ayahNumber})</Text>
        <View style={styles.reflectionBox}>
          <Text style={styles.reflectionLabel}>Reflect</Text>
          <Text style={styles.reflectionText}>{todaysAyah.reflection}</Text>
        </View>
      </View>

      {/* Name of Allah */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Name of Allah #{todaysName.number}</Text>
        <Text style={styles.arabicTextLarge}>{todaysName.arabic}</Text>
        <Text style={styles.nameTranslit}>{todaysName.transliteration}</Text>
        <Text style={styles.nameMeaning}>{todaysName.meaning}</Text>
        <Text style={styles.nameExplanation}>{todaysName.explanation}</Text>
      </View>

      {/* Dua of the Day */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Dua for Today</Text>
        <Text style={styles.duaOccasion}>{todaysDua.occasion}</Text>
        <Text style={styles.arabicText}>{todaysDua.arabic}</Text>
        <Text style={styles.transliteration}>{todaysDua.transliteration}</Text>
        <Text style={styles.translation}>"{todaysDua.translation}"</Text>
        <Text style={styles.source}>— {todaysDua.source}</Text>
      </View>

      {/* XP Progress */}
      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpTitle}>{levelInfo.icon} Level {level}: {levelInfo.title}</Text>
          <Text style={styles.xpAmount}>{xp} XP</Text>
        </View>
        <View style={styles.xpBarBg}>
          <View 
            style={[
              styles.xpBarFill, 
              { width: `${((xp - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.xpNext}>
          {levelInfo.maxXP === Infinity 
            ? 'Maximum level reached!' 
            : `${levelInfo.maxXP - xp} XP to next level`
          }
        </Text>
      </View>

      <View style={styles.bottomPadding} />
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  continueCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  continueContent: {
    flex: 1,
  },
  continueLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  continueDay: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginBottom: 4,
  },
  continueHint: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  continueProgress: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  nextPrayerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  nextPrayerName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  nextPrayerTimeContainer: {
    alignItems: 'flex-end',
  },
  nextPrayerTime: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  nextPrayerCountdown: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  prayerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  prayerItem: {
    alignItems: 'center',
  },
  prayerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 4,
  },
  prayerDotDone: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  prayerName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  prayerCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  arabicText: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: 40,
  },
  arabicTextLarge: {
    fontSize: 40,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  transliteration: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  translation: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  source: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  reflectionBox: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  reflectionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reflectionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  nameTranslit: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  nameMeaning: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  nameExplanation: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  duaOccasion: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  xpCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  xpTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  xpAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  xpNext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
