// Word-by-Word Quran View Component
// Displays Arabic words with individual transliteration and translation

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { QuranWord } from '../types';
import { getWordAudioUrl } from '../services/quranService';
import { playAudio } from '../services';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WordByWordViewProps {
  words: QuranWord[];
  arabicFontSize?: number;
  transliterationFontSize?: number;
  translationFontSize?: number;
  showTransliteration?: boolean;
}

const WordByWordView: React.FC<WordByWordViewProps> = ({
  words,
  arabicFontSize = 22,
  transliterationFontSize = 12,
  translationFontSize = 11,
  showTransliteration = true,
}) => {
  const handleWordPress = useCallback(async (word: QuranWord) => {
    if (word.audio_url) {
      try {
        const fullUrl = getWordAudioUrl(word.audio_url);
        await playAudio(fullUrl);
      } catch (error) {
        console.error('Error playing word audio:', error);
      }
    }
  }, []);

  // Filter out end-of-ayah markers (position is typically last and text is just the ayah number)
  const displayWords = words.filter((word) => {
    // Keep all words that have translation text
    return word.translation?.text && word.translation.text.trim().length > 0;
  });

  if (!displayWords || displayWords.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {/* Display words in RTL order (right to left for Arabic) */}
      {displayWords.map((word, index) => (
        <TouchableOpacity
          key={`${word.id}-${index}`}
          style={styles.wordContainer}
          onPress={() => handleWordPress(word)}
          activeOpacity={0.7}
        >
          {/* Arabic Text */}
          <Text
            style={[
              styles.arabicText,
              { fontSize: arabicFontSize },
            ]}
          >
            {word.text_uthmani || word.text_simple}
          </Text>

          {/* Transliteration */}
          {showTransliteration && word.transliteration?.text && (
            <Text
              style={[
                styles.transliterationText,
                { fontSize: transliterationFontSize },
              ]}
              numberOfLines={1}
            >
              {word.transliteration.text}
            </Text>
          )}

          {/* Translation */}
          <Text
            style={[
              styles.translationText,
              { fontSize: translationFontSize },
            ]}
            numberOfLines={2}
          >
            {word.translation?.text || ''}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row-reverse', // RTL for Arabic
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
  },
  wordContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.3)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 70,
    maxWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  arabicText: {
    fontFamily: 'System',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 32,
  },
  transliterationText: {
    color: '#D4AF37',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 2,
  },
  translationText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default WordByWordView;
