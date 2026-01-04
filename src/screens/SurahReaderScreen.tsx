// SurahReaderScreen - Read Quran verses with Arabic, translation, and audio

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { theme } from '../constants/theme';
import { fetchSurah, fetchSurahWithWords, TRANSLATIONS, RECITERS, TranslationKey, ReciterKey } from '../services/quranService';
import { useQuranStore } from '../store/useQuranStore';
import { SurahFull, AyahWithTranslation, SurahWithWords, QuranWord } from '../types';
import { WordByWordView } from '../components';

type RouteParams = {
  surahNumber: number;
  startAyah?: number;
};

export const SurahReaderScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { surahNumber, startAyah = 1 } = route.params;

  const {
    updateReadingProgress,
    markSurahComplete,
    addBookmark,
    bookmarks,
    showArabic,
    showWordByWord,
    arabicFontSize,
    translationFontSize,
    wordByWordFontSize,
    selectedReciter,
    selectedTranslation,
    setShowArabic,
    setShowWordByWord,
    setArabicFontSize,
    setTranslationFontSize,
    setWordByWordFontSize,
    setSelectedReciter,
    setSelectedTranslation,
  } = useQuranStore();

  const [surah, setSurah] = useState<SurahFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAyah, setCurrentAyah] = useState(startAyah);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [wordData, setWordData] = useState<Map<number, QuranWord[]>>(new Map());
  const [loadingWords, setLoadingWords] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadSurah = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSurah(
        surahNumber,
        selectedTranslation as TranslationKey,
        selectedReciter as ReciterKey
      );
      setSurah(data);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError('Failed to load surah. Please check your connection.');
      console.error('Error loading surah:', err);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, selectedTranslation, selectedReciter, fadeAnim]);

  // Load word-by-word data when enabled
  const loadWordData = useCallback(async () => {
    if (!showWordByWord || loadingWords) return;

    try {
      setLoadingWords(true);
      const surahWithWords = await fetchSurahWithWords(surahNumber);

      // Create a map from ayah number to words
      const wordsMap = new Map<number, QuranWord[]>();
      surahWithWords.ayahs.forEach((ayah) => {
        if (ayah.words && ayah.words.length > 0) {
          wordsMap.set(ayah.numberInSurah, ayah.words);
        }
      });

      setWordData(wordsMap);
    } catch (err) {
      console.error('Error loading word-by-word data:', err);
    } finally {
      setLoadingWords(false);
    }
  }, [surahNumber, showWordByWord, loadingWords]);

  useEffect(() => {
    loadSurah();
  }, [loadSurah]);

  // Load word data when word-by-word is enabled
  useEffect(() => {
    if (showWordByWord && surah && wordData.size === 0) {
      loadWordData();
    }
  }, [showWordByWord, surah, wordData.size, loadWordData]);

  useEffect(() => {
    // Scroll to starting ayah if specified
    if (surah && startAyah > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: startAyah - 1,
          animated: true,
        });
      }, 500);
    }
  }, [surah, startAyah]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playAyah = async (ayah: AyahWithTranslation) => {
    try {
      // Stop current audio if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      if (!ayah.audioUrl) return;

      const { sound } = await Audio.Sound.createAsync(
        { uri: ayah.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setPlayingAyahNumber(null);
            // Auto-play next ayah
            const nextAyahIndex = ayah.numberInSurah;
            if (surah && nextAyahIndex < surah.ayahs.length) {
              playAyah(surah.ayahs[nextAyahIndex]);
            }
          }
        }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setPlayingAyahNumber(ayah.numberInSurah);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
      setPlayingAyahNumber(null);
    }
  };

  const handleAyahPress = (ayah: AyahWithTranslation) => {
    setCurrentAyah(ayah.numberInSurah);
    updateReadingProgress(surahNumber, ayah.numberInSurah);

    // Check if completed surah
    if (surah && ayah.numberInSurah === surah.numberOfAyahs) {
      markSurahComplete(surahNumber);
    }
  };

  const handleBookmark = (ayah: AyahWithTranslation) => {
    const isBookmarked = bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah
    );

    if (!isBookmarked && surah) {
      addBookmark({
        surahNumber,
        surahName: surah.englishName,
        ayahNumber: ayah.numberInSurah,
        ayahText: ayah.text,
        translation: ayah.translation,
      });
    }
  };

  const isAyahBookmarked = (ayahNumber: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  };

  const navigateToSurah = (direction: 'prev' | 'next') => {
    const newSurahNumber = direction === 'prev' ? surahNumber - 1 : surahNumber + 1;
    if (newSurahNumber >= 1 && newSurahNumber <= 114) {
      (navigation as any).setParams({ surahNumber: newSurahNumber, startAyah: 1 });
      setSurah(null);
      setWordData(new Map());
      setLoading(true);
    }
  };

  const renderBismillah = () => {
    // Don't show Bismillah for Surah At-Tawbah (9)
    if (surahNumber === 9) return null;

    return (
      <View style={styles.bismillahContainer}>
        <Text style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        <Text style={styles.bismillahTranslation}>
          In the name of Allah, the Most Gracious, the Most Merciful
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (!surah) return null;

    return (
      <View style={styles.headerContainer}>
        {/* Surah Info */}
        <View style={styles.surahHeader}>
          <View style={styles.surahTitleContainer}>
            <Text style={styles.surahArabicName}>{surah.name}</Text>
            <Text style={styles.surahEnglishName}>{surah.englishName}</Text>
            <Text style={styles.surahMeaning}>{surah.englishNameTranslation}</Text>
          </View>
          <View style={styles.surahBadge}>
            <Text style={styles.surahBadgeNumber}>{surah.number}</Text>
          </View>
        </View>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{surah.numberOfAyahs}</Text>
            <Text style={styles.metaLabel}>Verses</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{surah.revelationType}</Text>
            <Text style={styles.metaLabel}>Revelation</Text>
          </View>
        </View>

        {/* Bismillah */}
        {renderBismillah()}

        {/* Audio Controls */}
        <View style={styles.audioControls}>
          {isPlaying ? (
            <TouchableOpacity style={styles.audioButton} onPress={stopAudio}>
              <Text style={styles.audioButtonIcon}>⏹️</Text>
              <Text style={styles.audioButtonText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => surah.ayahs[0] && playAyah(surah.ayahs[0])}
            >
              <Text style={styles.audioButtonIcon}>▶️</Text>
              <Text style={styles.audioButtonText}>Play from Start</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAyah = ({ item }: { item: AyahWithTranslation }) => {
    const isCurrentAyah = currentAyah === item.numberInSurah;
    const isPlayingThis = playingAyahNumber === item.numberInSurah;
    const bookmarked = isAyahBookmarked(item.numberInSurah);

    return (
      <TouchableOpacity
        style={[
          styles.ayahCard,
          isCurrentAyah && styles.ayahCardActive,
          isPlayingThis && styles.ayahCardPlaying,
        ]}
        onPress={() => handleAyahPress(item)}
        activeOpacity={0.7}
      >
        {/* Ayah Number Badge */}
        <View style={styles.ayahHeader}>
          <View style={styles.ayahNumberBadge}>
            <Text style={styles.ayahNumber}>{item.numberInSurah}</Text>
          </View>
          <View style={styles.ayahActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => (isPlayingThis ? stopAudio() : playAyah(item))}
            >
              <Text style={styles.actionIcon}>
                {isPlayingThis ? '⏸️' : '🔊'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBookmark(item)}
            >
              <Text style={styles.actionIcon}>
                {bookmarked ? '🔖' : '📑'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Arabic Text */}
        {showArabic && (
          <Text
            style={[
              styles.ayahArabic,
              { fontSize: arabicFontSize, lineHeight: arabicFontSize * 2 },
            ]}
          >
            {item.text}
          </Text>
        )}

        {/* Word-by-Word View */}
        {showWordByWord && wordData.has(item.numberInSurah) && (
          <View style={styles.wordByWordContainer}>
            {loadingWords ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <WordByWordView
                words={wordData.get(item.numberInSurah) || []}
                arabicFontSize={wordByWordFontSize + 8}
                transliterationFontSize={wordByWordFontSize}
                translationFontSize={wordByWordFontSize - 2}
              />
            )}
          </View>
        )}

        {/* Translation */}
        <Text
          style={[
            styles.ayahTranslation,
            { fontSize: translationFontSize, lineHeight: translationFontSize * 1.6 },
          ]}
        >
          {item.translation}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <View style={styles.navigationFooter}>
      <TouchableOpacity
        style={[styles.navButton, surahNumber === 1 && styles.navButtonDisabled]}
        onPress={() => navigateToSurah('prev')}
        disabled={surahNumber === 1}
      >
        <Text style={styles.navButtonText}>← Previous</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, surahNumber === 114 && styles.navButtonDisabled]}
        onPress={() => navigateToSurah('next')}
        disabled={surahNumber === 114}
      >
        <Text style={styles.navButtonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reading Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Show Arabic */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Show Arabic Text</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  showArabic && styles.toggleButtonActive,
                ]}
                onPress={() => setShowArabic(!showArabic)}
              >
                <Text style={styles.toggleText}>{showArabic ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            {/* Show Word-by-Word */}
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Text style={styles.settingLabel}>Word-by-Word</Text>
                <Text style={styles.settingHint}>Tap each word to learn</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  showWordByWord && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setShowWordByWord(!showWordByWord);
                  if (!showWordByWord && wordData.size === 0) {
                    loadWordData();
                  }
                }}
              >
                <Text style={styles.toggleText}>{showWordByWord ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            {/* Arabic Font Size */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Arabic Font Size: {arabicFontSize}</Text>
              <View style={styles.sliderRow}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setArabicFontSize(arabicFontSize - 2)}
                >
                  <Text style={styles.sizeButtonText}>A-</Text>
                </TouchableOpacity>
                <View style={styles.sizePreview}>
                  <Text style={[styles.previewArabic, { fontSize: arabicFontSize }]}>
                    بِسْمِ
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setArabicFontSize(arabicFontSize + 2)}
                >
                  <Text style={styles.sizeButtonText}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Translation Font Size */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>
                Translation Font Size: {translationFontSize}
              </Text>
              <View style={styles.sliderRow}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setTranslationFontSize(translationFontSize - 1)}
                >
                  <Text style={styles.sizeButtonText}>A-</Text>
                </TouchableOpacity>
                <View style={styles.sizePreview}>
                  <Text
                    style={[styles.previewTranslation, { fontSize: translationFontSize }]}
                  >
                    Sample text
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setTranslationFontSize(translationFontSize + 1)}
                >
                  <Text style={styles.sizeButtonText}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Word-by-Word Font Size */}
            {showWordByWord && (
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>
                  Word-by-Word Size: {wordByWordFontSize}
                </Text>
                <View style={styles.sliderRow}>
                  <TouchableOpacity
                    style={styles.sizeButton}
                    onPress={() => setWordByWordFontSize(wordByWordFontSize - 1)}
                  >
                    <Text style={styles.sizeButtonText}>A-</Text>
                  </TouchableOpacity>
                  <View style={styles.sizePreview}>
                    <Text style={[styles.previewTranslation, { fontSize: wordByWordFontSize }]}>
                      Word size
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sizeButton}
                    onPress={() => setWordByWordFontSize(wordByWordFontSize + 1)}
                  >
                    <Text style={styles.sizeButtonText}>A+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Translation Selection - Grouped by Language */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Translation (27 languages)</Text>

              {/* English Translations */}
              <Text style={styles.languageHeader}>English</Text>
              {Object.entries(TRANSLATIONS)
                .filter(([key]) => key.startsWith('en.'))
                .map(([key, name]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    selectedTranslation === key && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedTranslation(key)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedTranslation === key && styles.optionTextActive,
                    ]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Other Languages */}
              <Text style={styles.languageHeader}>Other Languages</Text>
              {Object.entries(TRANSLATIONS)
                .filter(([key]) => !key.startsWith('en.'))
                .map(([key, name]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    selectedTranslation === key && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedTranslation(key)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedTranslation === key && styles.optionTextActive,
                    ]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reciter Selection */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Reciter</Text>
              {Object.entries(RECITERS).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    selectedReciter === key && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedReciter(key)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedReciter === key && styles.optionTextActive,
                    ]}
                  >
                    {info.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              setShowSettings(false);
              loadSurah();
            }}
          >
            <Text style={styles.applyButtonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Surah...</Text>
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>📖</Text>
        <Text style={styles.errorText}>{error || 'Failed to load surah'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurah}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        ref={flatListRef}
        data={surah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => item.number.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
      />
      {renderSettingsModal()}
    </Animated.View>
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
    marginBottom: theme.spacing.lg,
  },
  surahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  surahTitleContainer: {
    flex: 1,
  },
  surahArabicName: {
    fontSize: 32,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  surahEnglishName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  surahMeaning: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  surahBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahBadgeNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  metaLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  bismillahContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  bismillahArabic: {
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  bismillahTranslation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  audioButtonIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  audioButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  settingsButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  ayahCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  ayahCardActive: {
    borderWidth: 1,
    borderColor: theme.colors.primary + '50',
  },
  ayahCardPlaying: {
    backgroundColor: theme.colors.primaryMuted,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  ayahNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  ayahActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  ayahArabic: {
    color: theme.colors.text,
    textAlign: 'right',
    marginBottom: theme.spacing.md,
    fontFamily: 'System',
  },
  wordByWordContainer: {
    marginVertical: theme.spacing.sm,
    backgroundColor: 'rgba(30, 58, 95, 0.2)',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  ayahTranslation: {
    color: theme.colors.textSecondary,
    lineHeight: 26,
  },
  navigationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: theme.colors.textMuted,
    padding: theme.spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingSection: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.sm,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  languageHeader: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },
  sizePreview: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  previewArabic: {
    color: theme.colors.text,
  },
  previewTranslation: {
    color: theme.colors.textSecondary,
  },
  optionButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primaryMuted,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  optionTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});

export default SurahReaderScreen;
