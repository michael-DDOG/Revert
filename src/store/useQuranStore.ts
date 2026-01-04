// Quran Store - State management for Quran reading progress and bookmarks

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuranState, QuranBookmark, QuranReadingProgress } from '../types';

const initialReadingProgress: QuranReadingProgress = {
  lastSurahNumber: 1,
  lastAyahNumber: 1,
  lastReadAt: '',
  completedSurahs: [],
  totalAyahsRead: 0,
};

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      // State
      readingProgress: initialReadingProgress,
      bookmarks: [],
      showTransliteration: true,
      showArabic: true,
      showWordByWord: false,
      arabicFontSize: 28,
      translationFontSize: 16,
      wordByWordFontSize: 14,
      selectedReciter: 'ar.alafasy',
      selectedTranslation: 'en.sahih',

      // Actions
      updateReadingProgress: (surahNumber: number, ayahNumber: number) => {
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            lastSurahNumber: surahNumber,
            lastAyahNumber: ayahNumber,
            lastReadAt: new Date().toISOString(),
            totalAyahsRead: state.readingProgress.totalAyahsRead + 1,
          },
        }));
      },

      markSurahComplete: (surahNumber: number) => {
        const { readingProgress } = get();
        if (!readingProgress.completedSurahs.includes(surahNumber)) {
          set((state) => ({
            readingProgress: {
              ...state.readingProgress,
              completedSurahs: [
                ...state.readingProgress.completedSurahs,
                surahNumber,
              ].sort((a, b) => a - b),
            },
          }));
        }
      },

      addBookmark: (bookmark) => {
        const newBookmark: QuranBookmark = {
          ...bookmark,
          id: `${bookmark.surahNumber}-${bookmark.ayahNumber}-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }));
      },

      removeBookmark: (id: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      setShowTransliteration: (show: boolean) => {
        set({ showTransliteration: show });
      },

      setShowArabic: (show: boolean) => {
        set({ showArabic: show });
      },

      setShowWordByWord: (show: boolean) => {
        set({ showWordByWord: show });
      },

      setArabicFontSize: (size: number) => {
        set({ arabicFontSize: Math.max(18, Math.min(40, size)) });
      },

      setTranslationFontSize: (size: number) => {
        set({ translationFontSize: Math.max(12, Math.min(24, size)) });
      },

      setWordByWordFontSize: (size: number) => {
        set({ wordByWordFontSize: Math.max(10, Math.min(20, size)) });
      },

      setSelectedReciter: (reciter: string) => {
        set({ selectedReciter: reciter });
      },

      setSelectedTranslation: (translation: string) => {
        set({ selectedTranslation: translation });
      },

      resetQuranProgress: () => {
        set({
          readingProgress: initialReadingProgress,
          bookmarks: [],
        });
      },
    }),
    {
      name: 'revert-quran-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        readingProgress: state.readingProgress,
        bookmarks: state.bookmarks,
        showTransliteration: state.showTransliteration,
        showArabic: state.showArabic,
        showWordByWord: state.showWordByWord,
        arabicFontSize: state.arabicFontSize,
        translationFontSize: state.translationFontSize,
        wordByWordFontSize: state.wordByWordFontSize,
        selectedReciter: state.selectedReciter,
        selectedTranslation: state.selectedTranslation,
      }),
    }
  )
);

// Selectors
export const useQuranProgress = () =>
  useQuranStore((state) => state.readingProgress);
export const useQuranBookmarks = () => useQuranStore((state) => state.bookmarks);
export const useQuranSettings = () =>
  useQuranStore((state) => ({
    showTransliteration: state.showTransliteration,
    showArabic: state.showArabic,
    showWordByWord: state.showWordByWord,
    arabicFontSize: state.arabicFontSize,
    translationFontSize: state.translationFontSize,
    wordByWordFontSize: state.wordByWordFontSize,
    selectedReciter: state.selectedReciter,
    selectedTranslation: state.selectedTranslation,
  }));

export default useQuranStore;
