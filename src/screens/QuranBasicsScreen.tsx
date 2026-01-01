import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../constants/theme';

interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  meaning: string;
  verses: number;
  revelation: 'Meccan' | 'Medinan';
  description: string;
}

const essentialSurahs: Surah[] = [
  {
    number: 1,
    name: 'Al-Fatiha',
    nameArabic: 'الفاتحة',
    meaning: 'The Opening',
    verses: 7,
    revelation: 'Meccan',
    description: 'The most important surah, recited in every rakah of prayer. Known as "The Mother of the Quran".',
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    meaning: 'The Sincerity',
    verses: 4,
    revelation: 'Meccan',
    description: 'Declares the absolute oneness of Allah. Equal to one-third of the Quran in reward.',
  },
  {
    number: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    meaning: 'The Daybreak',
    verses: 5,
    revelation: 'Meccan',
    description: 'Seeking refuge in Allah from external evils. One of the two protective surahs.',
  },
  {
    number: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    meaning: 'Mankind',
    verses: 6,
    revelation: 'Meccan',
    description: 'Seeking refuge in Allah from internal whisperings. The final surah of the Quran.',
  },
  {
    number: 110,
    name: 'An-Nasr',
    nameArabic: 'النصر',
    meaning: 'The Divine Support',
    verses: 3,
    revelation: 'Medinan',
    description: 'Speaks of victory and the importance of seeking forgiveness.',
  },
  {
    number: 108,
    name: 'Al-Kawthar',
    nameArabic: 'الكوثر',
    meaning: 'The Abundance',
    verses: 3,
    revelation: 'Meccan',
    description: 'The shortest surah. Speaks of the abundance Allah gave to Prophet Muhammad ﷺ.',
  },
  {
    number: 109,
    name: 'Al-Kafirun',
    nameArabic: 'الكافرون',
    meaning: 'The Disbelievers',
    verses: 6,
    revelation: 'Meccan',
    description: 'Establishes clear distinction between Islam and disbelief. "To you your religion, to me mine."',
  },
  {
    number: 111,
    name: 'Al-Masad',
    nameArabic: 'المسد',
    meaning: 'The Palm Fiber',
    verses: 5,
    revelation: 'Meccan',
    description: 'About Abu Lahab, uncle of the Prophet, who opposed Islam.',
  },
];

export const QuranBasicsScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quran Basics</Text>
        <Text style={styles.headerSubtitle}>
          Essential surahs for new Muslims
        </Text>
      </View>

      {/* Introduction Card */}
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>Start Here</Text>
        <Text style={styles.introText}>
          These short surahs are recommended to learn first. They are commonly
          recited in prayers and are easier to memorize.
        </Text>
        <View style={styles.tipRow}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Al-Fatiha is required in every rakah. Start with learning it perfectly.
          </Text>
        </View>
      </View>

      {/* Coming Soon Notice */}
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>🎧</Text>
        <Text style={styles.comingSoonTitle}>Audio Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          We're working on adding audio recitation with word-by-word highlighting
          to help you learn proper pronunciation.
        </Text>
      </View>

      {/* Essential Surahs */}
      <Text style={styles.sectionTitle}>Essential Surahs</Text>

      {essentialSurahs.map((surah) => (
        <TouchableOpacity
          key={surah.number}
          style={styles.surahCard}
          activeOpacity={0.7}
        >
          <View style={styles.surahHeader}>
            <View style={styles.surahNumberBadge}>
              <Text style={styles.surahNumber}>{surah.number}</Text>
            </View>
            <View style={styles.surahInfo}>
              <View style={styles.surahNameRow}>
                <Text style={styles.surahName}>{surah.name}</Text>
                <Text style={styles.surahArabic}>{surah.nameArabic}</Text>
              </View>
              <Text style={styles.surahMeaning}>{surah.meaning}</Text>
            </View>
          </View>
          <Text style={styles.surahDescription}>{surah.description}</Text>
          <View style={styles.surahMeta}>
            <Text style={styles.surahMetaText}>{surah.verses} verses</Text>
            <Text style={styles.surahMetaDot}>•</Text>
            <Text style={styles.surahMetaText}>{surah.revelation}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Learning Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Memorization Tips</Text>
        <View style={styles.tip}>
          <Text style={styles.tipNumber}>1</Text>
          <Text style={styles.tipContent}>
            Listen to the surah repeatedly before trying to recite
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipNumber}>2</Text>
          <Text style={styles.tipContent}>
            Learn one ayah (verse) at a time, then connect them
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipNumber}>3</Text>
          <Text style={styles.tipContent}>
            Recite what you've memorized in your prayers to reinforce
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipNumber}>4</Text>
          <Text style={styles.tipContent}>
            Review daily - consistency is more important than quantity
          </Text>
        </View>
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
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  introCard: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  introTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  introText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
  comingSoonCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  comingSoonIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  comingSoonTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  comingSoonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  surahCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  surahNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  surahNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  surahInfo: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  surahArabic: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
  },
  surahMeaning: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  surahDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahMetaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  surahMetaDot: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.xs,
  },
  tipsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  tipsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryMuted,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  tipContent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

export default QuranBasicsScreen;
