import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { dailyDuas } from '../data/dailyDuas';
import { namesOfAllah } from '../data/namesOfAllah';

interface LearnCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  screen: string;
  count?: number;
  color: string;
}

const categories: LearnCategory[] = [
  {
    id: 'duas',
    title: 'Dua Library',
    subtitle: 'Essential supplications',
    icon: '🤲',
    screen: 'DuaLibrary',
    count: dailyDuas.length,
    color: theme.colors.primary,
  },
  {
    id: 'names',
    title: '99 Names of Allah',
    subtitle: 'Al-Asma ul-Husna',
    icon: '✨',
    screen: 'NamesOfAllah',
    count: 99,
    color: '#f59e0b',
  },
  {
    id: 'prayer',
    title: 'Prayer Guide',
    subtitle: 'Step-by-step salah',
    icon: '🕌',
    screen: 'PrayerGuide',
    color: '#3b82f6',
  },
  {
    id: 'quran',
    title: 'Quran Basics',
    subtitle: 'Essential surahs',
    icon: '📖',
    screen: 'QuranBasics',
    color: '#8b5cf6',
  },
];

export const LearnScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn Islam</Text>
        <Text style={styles.headerSubtitle}>
          Build your knowledge at your own pace
        </Text>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
            {category.count && (
              <View style={[styles.countBadge, { backgroundColor: category.color }]}>
                <Text style={styles.countText}>{category.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Tip of the Day</Text>
          <Text style={styles.tipText}>
            Start with learning the essential duas for daily activities.
            They transform ordinary moments into acts of worship.
          </Text>
        </View>
      </View>

      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <TouchableOpacity
          style={styles.quickAccessItem}
          onPress={() => handleCategoryPress('DuaLibrary')}
          activeOpacity={0.7}
        >
          <View style={styles.quickAccessLeft}>
            <Text style={styles.quickAccessIcon}>🌅</Text>
            <View>
              <Text style={styles.quickAccessTitle}>Morning & Evening Adhkar</Text>
              <Text style={styles.quickAccessSubtitle}>Daily remembrance</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAccessItem}
          onPress={() => handleCategoryPress('PrayerGuide')}
          activeOpacity={0.7}
        >
          <View style={styles.quickAccessLeft}>
            <Text style={styles.quickAccessIcon}>🧎</Text>
            <View>
              <Text style={styles.quickAccessTitle}>How to Pray</Text>
              <Text style={styles.quickAccessSubtitle}>Complete salah guide</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAccessItem}
          onPress={() => handleCategoryPress('NamesOfAllah')}
          activeOpacity={0.7}
        >
          <View style={styles.quickAccessLeft}>
            <Text style={styles.quickAccessIcon}>💫</Text>
            <View>
              <Text style={styles.quickAccessTitle}>Names of Allah</Text>
              <Text style={styles.quickAccessSubtitle}>Know your Lord</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
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
    marginBottom: theme.spacing.xl,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  countBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  countText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  tipCard: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  quickAccessSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  quickAccessItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  quickAccessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickAccessIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  quickAccessTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  quickAccessSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
  },
  bottomPadding: {
    height: 40,
  },
});

export default LearnScreen;
