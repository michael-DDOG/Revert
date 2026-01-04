// Quran Service - Fetches Quran data from AlQuran.cloud API
// Free API, no key required

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Surah,
  SurahFull,
  SurahWithWords,
  AyahWithTranslation,
  AyahWithWords,
  QuranWord,
  ApiQuranSurahListResponse,
  ApiQuranSurahResponse,
} from '../types';

// AlQuran.cloud API (for basic surah/ayah data)
const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Quran.com API v4 (for word-by-word data)
const QURAN_COM_API_URL = 'https://api.quran.com/api/v4';
const CACHE_KEY_SURAHS = 'quran-surahs-list';
const CACHE_KEY_SURAH_PREFIX = 'quran-surah-';
const CACHE_KEY_WORDS_PREFIX = 'quran-words-';
const CACHE_KEY_TRANSLATIONS_LIST = 'quran-translations-list';
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_DURATION_LONG_MS = 30 * 24 * 60 * 60 * 1000; // 30 days for translations list

// Available translations (from AlQuran.cloud)
export const TRANSLATIONS = {
  // English
  'en.sahih': 'Sahih International',
  'en.asad': 'Muhammad Asad',
  'en.pickthall': 'Pickthall',
  'en.yusufali': 'Yusuf Ali',
  'en.hilali': 'Hilali & Khan',
  'en.ahmedali': 'Ahmed Ali',
  'en.arberry': 'A.J. Arberry',
  'en.maududi': 'Maududi',
  'en.daryabadi': 'Daryabadi',
  'en.shakir': 'Shakir',
  'en.sarwar': 'Muhammad Sarwar',
  'en.qaribullah': 'Qaribullah',
  'en.wahiduddin': 'Wahiduddin Khan',
  // Urdu
  'ur.jalandhry': 'Fateh Muhammad Jalandhry (Urdu)',
  'ur.ahmedali': 'Ahmed Ali (Urdu)',
  'ur.maududi': 'Maududi (Urdu)',
  // Indonesian
  'id.indonesian': 'Indonesian Ministry',
  // French
  'fr.hamidullah': 'Muhammad Hamidullah (French)',
  // German
  'de.aburida': 'Abu Rida (German)',
  'de.bubenheim': 'Bubenheim (German)',
  // Spanish
  'es.cortes': 'Julio Cortes (Spanish)',
  // Turkish
  'tr.diyanet': 'Diyanet (Turkish)',
  'tr.ozturk': 'Ozturk (Turkish)',
  // Russian
  'ru.kuliev': 'Kuliev (Russian)',
  // Bengali
  'bn.bengali': 'Bengali Translation',
  // Malay
  'ms.basmeih': 'Basmeih (Malay)',
} as const;

// Available reciters (for audio)
export const RECITERS = {
  'ar.alafasy': {
    name: 'Mishary Rashid Alafasy',
    identifier: 'ar.alafasy',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/',
  },
  'ar.abdulsamad': {
    name: 'Abdul Basit Abdul Samad',
    identifier: 'ar.abdulsamad',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.abdulsamad/',
  },
  'ar.husary': {
    name: 'Mahmoud Khalil Al-Husary',
    identifier: 'ar.husary',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.husary/',
  },
  'ar.minshawi': {
    name: 'Muhammad Siddiq Al-Minshawi',
    identifier: 'ar.minshawi',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.minshawi/',
  },
  'ar.sudais': {
    name: 'Abdul Rahman Al-Sudais',
    identifier: 'ar.sudais',
    audioBaseUrl: 'https://cdn.islamic.network/quran/audio/64/ar.sudais/',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;
export type ReciterKey = keyof typeof RECITERS;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Helper to check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION_MS;
};

// Get cached data
const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached);
      if (isCacheValid(entry.timestamp)) {
        return entry.data;
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Set cached data
const setCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Silently fail cache writes
  }
};

/**
 * Fetch list of all 114 surahs
 */
export const fetchSurahList = async (): Promise<Surah[]> => {
  // Check cache first
  const cached = await getCached<Surah[]>(CACHE_KEY_SURAHS);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    const data: ApiQuranSurahListResponse = await response.json();

    if (data.code === 200 && data.data) {
      const surahs: Surah[] = data.data.map((s) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType as 'Meccan' | 'Medinan',
      }));

      // Cache the result
      await setCache(CACHE_KEY_SURAHS, surahs);
      return surahs;
    }

    throw new Error('Failed to fetch surah list');
  } catch (error) {
    console.error('Error fetching surah list:', error);
    throw error;
  }
};

/**
 * Fetch a single surah with Arabic text, translation, and audio URLs
 */
export const fetchSurah = async (
  surahNumber: number,
  translation: TranslationKey = 'en.sahih',
  reciter: ReciterKey = 'ar.alafasy'
): Promise<SurahFull> => {
  const cacheKey = `${CACHE_KEY_SURAH_PREFIX}${surahNumber}-${translation}`;

  // Check cache first
  const cached = await getCached<SurahFull>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch both Arabic and translation in one call
    const response = await fetch(
      `${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${translation}`
    );
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.length >= 2) {
      const arabicData = data.data[0];
      const translationData = data.data[1];

      const reciterInfo = RECITERS[reciter];

      const ayahs: AyahWithTranslation[] = arabicData.ayahs.map(
        (ayah: ApiQuranSurahResponse['data']['ayahs'][0], index: number) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          juz: ayah.juz,
          page: ayah.page,
          translation: translationData.ayahs[index]?.text || '',
          audioUrl: `${reciterInfo.audioBaseUrl}${ayah.number}.mp3`,
        })
      );

      const surahFull: SurahFull = {
        number: arabicData.number,
        name: arabicData.name,
        englishName: arabicData.englishName,
        englishNameTranslation: arabicData.englishNameTranslation,
        numberOfAyahs: arabicData.numberOfAyahs,
        revelationType: arabicData.revelationType as 'Meccan' | 'Medinan',
        ayahs,
      };

      // Cache the result
      await setCache(cacheKey, surahFull);
      return surahFull;
    }

    throw new Error('Failed to fetch surah');
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
};

/**
 * Fetch a specific ayah with translation
 */
export const fetchAyah = async (
  surahNumber: number,
  ayahNumber: number,
  translation: TranslationKey = 'en.sahih'
): Promise<AyahWithTranslation> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,${translation}`
    );
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.length >= 2) {
      const arabicData = data.data[0];
      const translationData = data.data[1];

      return {
        number: arabicData.number,
        numberInSurah: arabicData.numberInSurah,
        text: arabicData.text,
        juz: arabicData.juz,
        page: arabicData.page,
        translation: translationData.text,
        audioUrl: `${RECITERS['ar.alafasy'].audioBaseUrl}${arabicData.number}.mp3`,
      };
    }

    throw new Error('Failed to fetch ayah');
  } catch (error) {
    console.error('Error fetching ayah:', error);
    throw error;
  }
};

/**
 * Search the Quran for a keyword
 */
export const searchQuran = async (
  query: string,
  translation: TranslationKey = 'en.sahih'
): Promise<AyahWithTranslation[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${API_BASE_URL}/search/${encodedQuery}/all/${translation}`
    );
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.matches) {
      return data.data.matches.map((match: {
        number: number;
        numberInSurah: number;
        text: string;
        juz: number;
        page: number;
        surah: { number: number };
      }) => ({
        number: match.number,
        numberInSurah: match.numberInSurah,
        text: match.text,
        juz: match.juz,
        page: match.page,
        translation: match.text,
        audioUrl: `${RECITERS['ar.alafasy'].audioBaseUrl}${match.number}.mp3`,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching Quran:', error);
    return [];
  }
};

/**
 * Get audio URL for a specific ayah
 */
export const getAyahAudioUrl = (
  globalAyahNumber: number,
  reciter: ReciterKey = 'ar.alafasy'
): string => {
  const reciterInfo = RECITERS[reciter];
  return `${reciterInfo.audioBaseUrl}${globalAyahNumber}.mp3`;
};

/**
 * Clear all Quran cache
 */
export const clearQuranCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const quranKeys = keys.filter(
      (key) => key.startsWith(CACHE_KEY_SURAH_PREFIX) || key === CACHE_KEY_SURAHS
    );
    await AsyncStorage.multiRemove(quranKeys);
  } catch (error) {
    console.error('Error clearing Quran cache:', error);
  }
};

/**
 * Get Juz information
 */
// ============================================
// QURAN.COM API v4 - Word-by-Word & Translations
// ============================================

/**
 * Fetch available translations from Quran.com API
 */
export interface TranslationResource {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
  slug: string;
}

export const fetchAvailableTranslations = async (): Promise<TranslationResource[]> => {
  const cached = await getCached<TranslationResource[]>(CACHE_KEY_TRANSLATIONS_LIST);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${QURAN_COM_API_URL}/resources/translations`);
    const data = await response.json();

    if (data.translations) {
      const translations: TranslationResource[] = data.translations.map((t: {
        id: number;
        name: string;
        author_name: string;
        language_name: string;
        slug: string;
      }) => ({
        id: t.id,
        name: t.name,
        authorName: t.author_name,
        languageName: t.language_name,
        slug: t.slug,
      }));

      await setCache(CACHE_KEY_TRANSLATIONS_LIST, translations);
      return translations;
    }

    return [];
  } catch (error) {
    console.error('Error fetching translations list:', error);
    return [];
  }
};

/**
 * Fetch a surah with word-by-word data from Quran.com API
 */
export const fetchSurahWithWords = async (
  surahNumber: number,
  translationId: number = 131 // Default: Sahih International
): Promise<SurahWithWords> => {
  const cacheKey = `${CACHE_KEY_WORDS_PREFIX}${surahNumber}-${translationId}`;

  // Check cache first
  const cached = await getCached<SurahWithWords>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch verses with words and translation
    const response = await fetch(
      `${QURAN_COM_API_URL}/verses/by_chapter/${surahNumber}?` +
      `language=en&words=true&translations=${translationId}&` +
      `word_fields=text_uthmani,text_simple,audio_url&` +
      `translation_fields=text&per_page=300`
    );
    const data = await response.json();

    if (data.verses) {
      // Also fetch surah info
      const surahResponse = await fetch(`${QURAN_COM_API_URL}/chapters/${surahNumber}`);
      const surahData = await surahResponse.json();
      const chapter = surahData.chapter;

      const ayahs: AyahWithWords[] = data.verses.map((verse: {
        id: number;
        verse_number: number;
        verse_key: string;
        text_uthmani: string;
        juz_number: number;
        page_number: number;
        translations: Array<{ text: string }>;
        words: Array<{
          id: number;
          position: number;
          text_uthmani: string;
          text?: string;
          translation: { text: string; language_name: string };
          transliteration: { text: string };
          audio_url?: string;
        }>;
      }) => {
        // Filter out end markers (position 0 words that are just markers)
        const words: QuranWord[] = verse.words
          .filter((w) => w.text_uthmani && w.text_uthmani.trim() !== '')
          .map((w) => ({
            id: w.id,
            position: w.position,
            text_uthmani: w.text_uthmani,
            text_simple: w.text,
            translation: w.translation || { text: '', language_name: 'en' },
            transliteration: w.transliteration || { text: '' },
            audio_url: w.audio_url,
          }));

        return {
          number: verse.id,
          numberInSurah: verse.verse_number,
          text: verse.text_uthmani,
          juz: verse.juz_number,
          page: verse.page_number,
          translation: verse.translations?.[0]?.text || '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.id}.mp3`,
          words,
        };
      });

      const surahWithWords: SurahWithWords = {
        number: chapter.id,
        name: chapter.name_arabic,
        englishName: chapter.name_simple,
        englishNameTranslation: chapter.translated_name?.name || chapter.name_simple,
        numberOfAyahs: chapter.verses_count,
        revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        ayahs,
      };

      // Cache the result
      await setCache(cacheKey, surahWithWords);
      return surahWithWords;
    }

    throw new Error('Failed to fetch surah with words');
  } catch (error) {
    console.error('Error fetching surah with words:', error);
    throw error;
  }
};

/**
 * Get word audio URL
 */
export const getWordAudioUrl = (wordAudioPath: string): string => {
  if (wordAudioPath.startsWith('http')) {
    return wordAudioPath;
  }
  return `https://audio.qurancdn.com/${wordAudioPath}`;
};

// Popular translations for quick access
export const POPULAR_TRANSLATIONS = [
  { id: 131, name: 'Sahih International', language: 'English' },
  { id: 20, name: 'Saheeh International', language: 'English' },
  { id: 85, name: 'Abdul Haleem', language: 'English' },
  { id: 84, name: 'Mufti Taqi Usmani', language: 'English' },
  { id: 95, name: 'Tafheem ul Quran', language: 'Urdu' },
  { id: 234, name: 'Indonesian Ministry', language: 'Indonesian' },
  { id: 161, name: 'Hamza Roberto Piccardo', language: 'Italian' },
  { id: 79, name: 'Muhammad Hamidullah', language: 'French' },
  { id: 77, name: 'Frank Bubenheim', language: 'German' },
  { id: 133, name: 'Ahmed Raza Khan', language: 'Hindi' },
];

export const JUZ_INFO = [
  { number: 1, name: 'Alif Lam Mim', startSurah: 1, startAyah: 1 },
  { number: 2, name: 'Sayaqool', startSurah: 2, startAyah: 142 },
  { number: 3, name: 'Tilkal Rusul', startSurah: 2, startAyah: 253 },
  { number: 4, name: 'Lan Tanaloo', startSurah: 3, startAyah: 93 },
  { number: 5, name: 'Wal Mohsanat', startSurah: 4, startAyah: 24 },
  { number: 6, name: 'La Yuhibbullah', startSurah: 4, startAyah: 148 },
  { number: 7, name: 'Wa Iza Samiu', startSurah: 5, startAyah: 83 },
  { number: 8, name: 'Wa Lau Annana', startSurah: 6, startAyah: 111 },
  { number: 9, name: 'Qalal Malao', startSurah: 7, startAyah: 88 },
  { number: 10, name: 'Wa Alamu', startSurah: 8, startAyah: 41 },
  { number: 11, name: 'Yatazeroon', startSurah: 9, startAyah: 94 },
  { number: 12, name: 'Wa Mamin Daabbah', startSurah: 11, startAyah: 6 },
  { number: 13, name: 'Wa Ma Ubarrio', startSurah: 12, startAyah: 53 },
  { number: 14, name: 'Rubama', startSurah: 15, startAyah: 1 },
  { number: 15, name: 'Subhanallazi', startSurah: 17, startAyah: 1 },
  { number: 16, name: 'Qal Alam', startSurah: 18, startAyah: 75 },
  { number: 17, name: 'Iqtaraba', startSurah: 21, startAyah: 1 },
  { number: 18, name: 'Qad Aflaha', startSurah: 23, startAyah: 1 },
  { number: 19, name: 'Wa Qalallazina', startSurah: 25, startAyah: 21 },
  { number: 20, name: 'Amman Khalaq', startSurah: 27, startAyah: 56 },
  { number: 21, name: 'Otlu Ma Oohi', startSurah: 29, startAyah: 46 },
  { number: 22, name: 'Wa Manyaqnut', startSurah: 33, startAyah: 31 },
  { number: 23, name: 'Wa Mali', startSurah: 36, startAyah: 22 },
  { number: 24, name: 'Faman Azlam', startSurah: 39, startAyah: 32 },
  { number: 25, name: 'Elahe Yuruddo', startSurah: 41, startAyah: 47 },
  { number: 26, name: 'Ha Mim', startSurah: 46, startAyah: 1 },
  { number: 27, name: 'Qala Fama Khatbukum', startSurah: 51, startAyah: 31 },
  { number: 28, name: 'Qad Sami Allah', startSurah: 58, startAyah: 1 },
  { number: 29, name: 'Tabarakallazi', startSurah: 67, startAyah: 1 },
  { number: 30, name: 'Amma', startSurah: 78, startAyah: 1 },
];

export default {
  fetchSurahList,
  fetchSurah,
  fetchAyah,
  searchQuran,
  getAyahAudioUrl,
  clearQuranCache,
  fetchSurahWithWords,
  fetchAvailableTranslations,
  getWordAudioUrl,
  TRANSLATIONS,
  RECITERS,
  JUZ_INFO,
  POPULAR_TRANSLATIONS,
};
