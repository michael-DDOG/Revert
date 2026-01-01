import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { theme } from '../constants/theme';
import { dailyDuas } from '../data/dailyDuas';
import { DuaOfDay } from '../types';

type DuaCategory = 'all' | 'daily' | 'prayer' | 'protection' | 'morning_evening';

interface CategoryFilter {
  id: DuaCategory;
  label: string;
  icon: string;
}

const categoryFilters: CategoryFilter[] = [
  { id: 'all', label: 'All', icon: '📚' },
  { id: 'daily', label: 'Daily', icon: '🌅' },
  { id: 'prayer', label: 'Prayer', icon: '🕌' },
  { id: 'protection', label: 'Protection', icon: '🛡️' },
  { id: 'morning_evening', label: 'Adhkar', icon: '🌙' },
];

const categorizeDua = (dua: DuaOfDay): DuaCategory[] => {
  const occasion = dua.occasion.toLowerCase();
  const categories: DuaCategory[] = ['all'];

  if (occasion.includes('morning') || occasion.includes('evening')) {
    categories.push('morning_evening');
  }
  if (occasion.includes('wudu') || occasion.includes('mosque') || occasion.includes('prayer')) {
    categories.push('prayer');
  }
  if (occasion.includes('protection') || occasion.includes('distress') ||
      occasion.includes('anxiety') || occasion.includes('anger') ||
      occasion.includes('refuge')) {
    categories.push('protection');
  }
  if (occasion.includes('eating') || occasion.includes('sleep') ||
      occasion.includes('wake') || occasion.includes('house') ||
      occasion.includes('bathroom') || occasion.includes('clothing') ||
      occasion.includes('travel') || occasion.includes('mirror')) {
    categories.push('daily');
  }

  // If no specific category, mark as daily
  if (categories.length === 1) {
    categories.push('daily');
  }

  return categories;
};

export const DuaLibraryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory>('all');
  const [selectedDua, setSelectedDua] = useState<DuaOfDay | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredDuas = useMemo(() => {
    return dailyDuas.filter((dua) => {
      // Category filter
      const duaCategories = categorizeDua(dua);
      if (selectedCategory !== 'all' && !duaCategories.includes(selectedCategory)) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          dua.occasion.toLowerCase().includes(query) ||
          dua.translation.toLowerCase().includes(query) ||
          dua.transliteration.toLowerCase().includes(query) ||
          (dua.benefits && dua.benefits.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const openDuaModal = (dua: DuaOfDay) => {
    setSelectedDua(dua);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search duas..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categoryFilters.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredDuas.length} dua{filteredDuas.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Duas List */}
      <ScrollView
        style={styles.duasList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.duasListContent}
      >
        {filteredDuas.map((dua) => (
          <TouchableOpacity
            key={dua.id}
            style={styles.duaCard}
            onPress={() => openDuaModal(dua)}
            activeOpacity={0.7}
          >
            <View style={styles.duaHeader}>
              <Text style={styles.duaOccasion}>{dua.occasion}</Text>
              <Text style={styles.duaSource}>{dua.source}</Text>
            </View>
            <Text style={styles.duaArabic} numberOfLines={1}>
              {dua.arabic}
            </Text>
            <Text style={styles.duaTranslation} numberOfLines={2}>
              {dua.translation}
            </Text>
            <Text style={styles.tapHint}>Tap to view full dua →</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Dua Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDua && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalOccasion}>{selectedDua.occasion}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.arabicContainer}>
                    <Text style={styles.modalArabic}>{selectedDua.arabic}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>TRANSLITERATION</Text>
                    <Text style={styles.modalTransliteration}>
                      {selectedDua.transliteration}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>TRANSLATION</Text>
                    <Text style={styles.modalTranslation}>
                      "{selectedDua.translation}"
                    </Text>
                  </View>

                  {selectedDua.benefits && (
                    <View style={styles.benefitsBox}>
                      <Text style={styles.benefitsLabel}>Benefit</Text>
                      <Text style={styles.benefitsText}>{selectedDua.benefits}</Text>
                    </View>
                  )}

                  <View style={styles.sourceBox}>
                    <Text style={styles.sourceLabel}>Source</Text>
                    <Text style={styles.sourceText}>{selectedDua.source}</Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  clearButton: {
    fontSize: 16,
    color: theme.colors.textMuted,
    padding: theme.spacing.xs,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  resultsCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  duasList: {
    flex: 1,
  },
  duasListContent: {
    paddingHorizontal: theme.spacing.md,
  },
  duaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  duaOccasion: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    flex: 1,
  },
  duaSource: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  duaArabic: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    textAlign: 'right',
    marginBottom: theme.spacing.sm,
  },
  duaTranslation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  tapHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    textAlign: 'right',
  },
  bottomPadding: {
    height: 100,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalOccasion: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  arabicContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  modalArabic: {
    fontSize: 28,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 48,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  modalTransliteration: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  modalTranslation: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  benefitsBox: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  benefitsLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  benefitsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  sourceBox: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  sourceLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sourceText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default DuaLibraryScreen;
