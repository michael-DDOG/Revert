// QuranScreen - Browse all 114 surahs of the Holy Quran

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { fetchSurahList } from '../services/quranService';
import { useQuranStore } from '../store/useQuranStore';
import { Surah } from '../types';

type FilterType = 'all' | 'meccan' | 'medinan';

export const QuranScreen: React.FC = () => {
  const navigation = useNavigation();
  const { readingProgress, bookmarks } = useQuranStore();

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  const loadSurahs = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchSurahList();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (err) {
      setError('Failed to load surahs. Please check your connection.');
      console.error('Error loading surahs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSurahs();
  }, [loadSurahs]);

  useEffect(() => {
    let result = surahs;

    // Apply filter
    if (activeFilter === 'meccan') {
      result = result.filter((s) => s.revelationType === 'Meccan');
    } else if (activeFilter === 'medinan') {
      result = result.filter((s) => s.revelationType === 'Medinan');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.englishName.toLowerCase().includes(query) ||
          s.englishNameTranslation.toLowerCase().includes(query) ||
          s.number.toString() === query
      );
    }

    setFilteredSurahs(result);
  }, [surahs, activeFilter, searchQuery]);

  const handleSurahPress = (surah: Surah) => {
    (navigation as any).navigate('SurahReader', { surahNumber: surah.number });
  };

  const handleContinueReading = () => {
    (navigation as any).navigate('SurahReader', {
      surahNumber: readingProgress.lastSurahNumber,
      startAyah: readingProgress.lastAyahNumber,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSurahs();
  }, [loadSurahs]);

  const getLastReadSurah = (): Surah | undefined => {
    return surahs.find((s) => s.number === readingProgress.lastSurahNumber);
  };

  const renderHeader = () => {
    const lastReadSurah = getLastReadSurah();

    return (
      <View style={styles.headerContainer}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Holy Quran</Text>
          <Text style={styles.headerSubtitle}>
            114 Surahs | 6,236 Ayahs
          </Text>
        </View>

        {/* Continue Reading Card */}
        {lastReadSurah && readingProgress.lastReadAt && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={handleContinueReading}
            activeOpacity={0.8}
          >
            <View style={styles.continueLeft}>
              <Text style={styles.continueLabel}>Continue Reading</Text>
              <Text style={styles.continueSurah}>
                {lastReadSurah.englishName}
              </Text>
              <Text style={styles.continueAyah}>
                Ayah {readingProgress.lastAyahNumber} of {lastReadSurah.numberOfAyahs}
              </Text>
            </View>
            <View style={styles.continueRight}>
              <View style={styles.continueIconBg}>
                <Text style={styles.continueIcon}>📖</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {readingProgress.completedSurahs.length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{bookmarks.length}</Text>
            <Text style={styles.statLabel}>Bookmarks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {readingProgress.totalAyahsRead}
            </Text>
            <Text style={styles.statLabel}>Ayahs Read</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or number..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'meccan', 'medinan'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'All (114)'
                  : filter === 'meccan'
                  ? 'Meccan (86)'
                  : 'Medinan (28)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderSurahItem = ({ item }: { item: Surah }) => {
    const isCompleted = readingProgress.completedSurahs.includes(item.number);

    return (
      <TouchableOpacity
        style={styles.surahCard}
        onPress={() => handleSurahPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.surahLeft}>
          <View
            style={[
              styles.surahNumberBadge,
              isCompleted && styles.surahNumberBadgeCompleted,
            ]}
          >
            <Text
              style={[
                styles.surahNumber,
                isCompleted && styles.surahNumberCompleted,
              ]}
            >
              {item.number}
            </Text>
          </View>
          <View style={styles.surahInfo}>
            <View style={styles.surahNameRow}>
              <Text style={styles.surahEnglishName}>{item.englishName}</Text>
              {isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.surahMeaning}>
              {item.englishNameTranslation}
            </Text>
            <View style={styles.surahMeta}>
              <Text style={styles.surahMetaText}>
                {item.numberOfAyahs} verses
              </Text>
              <Text style={styles.surahMetaDot}>•</Text>
              <Text style={styles.surahMetaText}>{item.revelationType}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.surahArabic}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Quran...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>📖</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurahs}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurahItem}
        keyExtractor={(item) => item.number.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No surahs found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search term
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: theme.spacing.md,
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
  continueCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  continueLeft: {
    flex: 1,
  },
  continueLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  continueSurah: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginBottom: 2,
  },
  continueAyah: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  continueRight: {
    marginLeft: theme.spacing.md,
  },
  continueIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueIcon: {
    fontSize: 24,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  clearIcon: {
    fontSize: 16,
    color: theme.colors.textMuted,
    padding: theme.spacing.sm,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: 4,
    borderRadius: theme.borderRadius.md,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: theme.fontWeight.semibold,
  },
  surahCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  surahNumberBadgeCompleted: {
    backgroundColor: theme.colors.primaryMuted,
  },
  surahNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  surahNumberCompleted: {
    color: theme.colors.primary,
  },
  surahInfo: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahEnglishName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  checkmark: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.fontWeight.bold,
  },
  surahMeaning: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  surahMetaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  surahMetaDot: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  surahArabic: {
    fontSize: 22,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});

export default QuranScreen;
