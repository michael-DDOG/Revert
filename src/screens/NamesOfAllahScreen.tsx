import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { theme } from '../constants/theme';
import { namesOfAllah } from '../data/namesOfAllah';
import { NameOfAllah } from '../types';

export const NamesOfAllahScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredNames = namesOfAllah.filter((name) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      name.transliteration.toLowerCase().includes(query) ||
      name.meaning.toLowerCase().includes(query) ||
      name.explanation.toLowerCase().includes(query) ||
      name.number.toString().includes(query)
    );
  });

  const openNameModal = (name: NameOfAllah) => {
    setSelectedName(name);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedName(null);
    });
  };

  const renderNameCard = ({ item }: { item: NameOfAllah }) => (
    <TouchableOpacity
      style={styles.nameCard}
      onPress={() => openNameModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.nameContent}>
        <Text style={styles.arabicName}>{item.arabic}</Text>
        <Text style={styles.translitName}>{item.transliteration}</Text>
        <Text style={styles.meaningName}>{item.meaning}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerArabic}>أَسْمَاءُ اللهِ الْحُسْنَى</Text>
        <Text style={styles.headerTitle}>The Beautiful Names of Allah</Text>
        <Text style={styles.headerSubtitle}>
          Whoever memorizes them will enter Paradise
        </Text>
        <Text style={styles.headerSource}>— Sahih Al-Bukhari</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or meaning..."
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

      <Text style={styles.countText}>
        {filteredNames.length} of 99 names
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNames}
        renderItem={renderNameCard}
        keyExtractor={(item) => item.number.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Name Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[styles.modalContent, { opacity: fadeAnim }]}
          >
            <TouchableOpacity activeOpacity={1}>
              {selectedName && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalNumberBadge}>
                      <Text style={styles.modalNumber}>{selectedName.number}</Text>
                    </View>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalArabicContainer}>
                    <Text style={styles.modalArabic}>{selectedName.arabic}</Text>
                  </View>

                  <Text style={styles.modalTranslit}>{selectedName.transliteration}</Text>
                  <Text style={styles.modalMeaning}>{selectedName.meaning}</Text>

                  <View style={styles.divider} />

                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationLabel}>Understanding</Text>
                    <Text style={styles.explanationText}>{selectedName.explanation}</Text>
                  </View>

                  <View style={styles.reflectionBox}>
                    <Text style={styles.reflectionLabel}>Reflect</Text>
                    <Text style={styles.reflectionText}>
                      How can you connect with Allah through this Name today?
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerInfo: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gold + '30',
  },
  headerArabic: {
    fontSize: 28,
    color: theme.colors.gold,
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerSource: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    marginBottom: theme.spacing.sm,
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
  countText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  nameCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  numberText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  nameContent: {
    alignItems: 'center',
  },
  arabicName: {
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 4,
  },
  translitName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  meaningName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
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
  modalArabicContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalArabic: {
    fontSize: 48,
    color: theme.colors.gold,
  },
  modalTranslit: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalMeaning: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  explanationBox: {
    marginBottom: theme.spacing.lg,
  },
  explanationLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  explanationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  reflectionBox: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  reflectionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  reflectionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default NamesOfAllahScreen;
