import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OnboardingData,
  DEFAULT_ONBOARDING_DATA,
  SpiritualBackground,
  ShahadaTiming,
  KnowledgeLevel,
  BiggestChallenge,
  DailyCommitment,
  AttractionToIslam,
  JourneyGoal,
  NotificationPreferences,
} from '../types/onboarding';

// Onboarding screen names in order
export type OnboardingScreen =
  | 'Welcome'
  | 'Name'
  | 'ShahadaDate'
  | 'Background'
  | 'Attraction'
  | 'KnowledgeLevel'
  | 'Challenge'
  | 'Goals'
  | 'Commitment'
  | 'Notifications'
  | 'Promise'
  | 'FirstMoment';

export const ONBOARDING_SCREENS: OnboardingScreen[] = [
  'Welcome',
  'Name',
  'ShahadaDate',
  'Background',
  'Attraction',
  'KnowledgeLevel',
  'Challenge',
  'Goals',
  'Commitment',
  'Notifications',
  'Promise',
  'FirstMoment',
];

interface OnboardingState extends OnboardingData {
  // Onboarding progress tracking
  currentOnboardingScreen: OnboardingScreen;
  onboardingStartedAt: string | null;

  // Setters
  setName: (name: string) => void;
  setShahadaDate: (date: string | null) => void;
  setShahadaTiming: (timing: ShahadaTiming) => void;
  setSpiritualBackground: (background: SpiritualBackground) => void;
  setAttractionsToIslam: (attractions: AttractionToIslam[]) => void;
  toggleAttraction: (attraction: AttractionToIslam) => void;
  setKnowledgeLevel: (level: KnowledgeLevel) => void;
  setBiggestChallenge: (challenge: BiggestChallenge) => void;
  setJourneyGoals: (goals: JourneyGoal[]) => void;
  toggleGoal: (goal: JourneyGoal) => void;
  setDailyCommitment: (commitment: DailyCommitment) => void;
  setNotifications: (notifications: NotificationPreferences) => void;
  toggleNotification: (key: keyof NotificationPreferences) => void;

  // Onboarding navigation
  setCurrentOnboardingScreen: (screen: OnboardingScreen) => void;
  getOnboardingProgress: () => number;

  // Actions
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Computed
  isOnboardingComplete: () => boolean;
  getPersonalizedGreeting: () => string;
  getDaysSinceShadaha: () => number | null;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_ONBOARDING_DATA,
      currentOnboardingScreen: 'Welcome' as OnboardingScreen,
      onboardingStartedAt: null,

      setName: (name) => set({ name }),
      
      setShahadaDate: (date) => set({ shahadaDate: date }),
      
      setShahadaTiming: (timing) => set({ shahadaTiming: timing }),
      
      setSpiritualBackground: (background) => set({ spiritualBackground: background }),
      
      setAttractionsToIslam: (attractions) => set({ attractionsToIslam: attractions }),
      
      toggleAttraction: (attraction) => {
        const current = get().attractionsToIslam;
        if (current.includes(attraction)) {
          set({ attractionsToIslam: current.filter((a) => a !== attraction) });
        } else {
          set({ attractionsToIslam: [...current, attraction] });
        }
      },
      
      setKnowledgeLevel: (level) => set({ knowledgeLevel: level }),
      
      setBiggestChallenge: (challenge) => set({ biggestChallenge: challenge }),
      
      setJourneyGoals: (goals) => set({ journeyGoals: goals }),
      
      toggleGoal: (goal) => {
        const current = get().journeyGoals;
        if (current.includes(goal)) {
          set({ journeyGoals: current.filter((g) => g !== goal) });
        } else {
          set({ journeyGoals: [...current, goal] });
        }
      },
      
      setDailyCommitment: (commitment) => set({ dailyCommitment: commitment }),
      
      setNotifications: (notifications) => set({ notifications }),
      
      toggleNotification: (key) => {
        const current = get().notifications;
        set({
          notifications: {
            ...current,
            [key]: !current[key],
          },
        });
      },

      setCurrentOnboardingScreen: (screen) => {
        const state = get();
        // Set started time if this is the first time moving past Welcome
        if (!state.onboardingStartedAt && screen !== 'Welcome') {
          set({
            currentOnboardingScreen: screen,
            onboardingStartedAt: new Date().toISOString(),
          });
        } else {
          set({ currentOnboardingScreen: screen });
        }
      },

      getOnboardingProgress: () => {
        const { currentOnboardingScreen } = get();
        const currentIndex = ONBOARDING_SCREENS.indexOf(currentOnboardingScreen);
        return Math.round(((currentIndex + 1) / ONBOARDING_SCREENS.length) * 100);
      },

      completeOnboarding: () =>
        set({
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
          currentOnboardingScreen: 'FirstMoment',
        }),

      resetOnboarding: () =>
        set({
          ...DEFAULT_ONBOARDING_DATA,
          currentOnboardingScreen: 'Welcome' as OnboardingScreen,
          onboardingStartedAt: null,
        }),
      
      isOnboardingComplete: () => get().onboardingCompleted,
      
      getPersonalizedGreeting: () => {
        const { name } = get();
        if (name) {
          return `Assalamu Alaikum, ${name}`;
        }
        return 'Assalamu Alaikum';
      },
      
      getDaysSinceShadaha: () => {
        const { shahadaDate } = get();
        if (!shahadaDate) return null;
        
        const shahada = new Date(shahadaDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - shahada.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
    }),
    {
      name: 'revert-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
