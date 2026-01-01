import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserProfile, AuthError } from '../types/auth';
import * as SupabaseService from '../services/supabase';
import * as RevenueCatService from '../services/revenuecat';

const TRIAL_DAYS = 7;

interface AuthState {
  // State
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUserProfile: () => Promise<void>;
  setLoading: (loading: boolean) => void;

  // Computed helpers
  getTrialDaysRemaining: () => number;
  isTrialActive: () => boolean;
  getTrialEndDate: () => Date | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Initialize - check for existing session
      initialize: async () => {
        try {
          set({ isLoading: true });

          const session = await SupabaseService.getSession();

          if (session?.user) {
            // Get or create user profile
            const userProfile = await SupabaseService.getUserProfile(session.user.id);

            // Initialize RevenueCat with user ID
            await RevenueCatService.initRevenueCat(session.user.id);

            set({
              user: {
                id: session.user.id,
                email: session.user.email!,
                created_at: session.user.created_at,
              },
              userProfile,
              isAuthenticated: true,
            });
          } else {
            // Initialize RevenueCat anonymously
            await RevenueCatService.initRevenueCat();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Don't fail initialization on error
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      // Sign up
      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { user } = await SupabaseService.signUp(email, password);

          if (user) {
            // Create user profile with trial start date
            await SupabaseService.createUserProfile(user.id);
            const userProfile = await SupabaseService.getUserProfile(user.id);

            // Identify user in RevenueCat
            await RevenueCatService.identifyUser(user.id);

            set({
              user: {
                id: user.id,
                email: user.email!,
                created_at: user.created_at,
              },
              userProfile,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          const authError: AuthError = {
            message: error.message || 'Sign up failed',
            code: error.code,
          };
          set({ error: authError });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign in
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { user } = await SupabaseService.signIn(email, password);

          if (user) {
            // Get user profile
            const userProfile = await SupabaseService.getUserProfile(user.id);

            // Identify user in RevenueCat
            await RevenueCatService.identifyUser(user.id);

            set({
              user: {
                id: user.id,
                email: user.email!,
                created_at: user.created_at,
              },
              userProfile,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          const authError: AuthError = {
            message: error.message || 'Sign in failed',
            code: error.code,
          };
          set({ error: authError });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign out
      signOut: async () => {
        try {
          set({ isLoading: true });
          await SupabaseService.signOut();
          await RevenueCatService.logoutUser();

          set({
            user: null,
            userProfile: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Sign out error:', error);
          // Still clear local state even if API call fails
          set({
            user: null,
            userProfile: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Refresh user profile
      refreshUserProfile: async () => {
        const { user } = get();
        if (user) {
          try {
            const userProfile = await SupabaseService.getUserProfile(user.id);
            set({ userProfile });
          } catch (error) {
            console.error('Error refreshing user profile:', error);
          }
        }
      },

      // Set loading
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Get trial days remaining
      getTrialDaysRemaining: () => {
        const { userProfile } = get();
        if (!userProfile?.trial_start_date) return TRIAL_DAYS;

        const trialStart = new Date(userProfile.trial_start_date);
        const now = new Date();
        const daysPassed = Math.floor(
          (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)
        );

        return Math.max(0, TRIAL_DAYS - daysPassed);
      },

      // Check if trial is active
      isTrialActive: () => {
        return get().getTrialDaysRemaining() > 0;
      },

      // Get trial end date
      getTrialEndDate: () => {
        const { userProfile } = get();
        if (!userProfile?.trial_start_date) return null;

        const trialStart = new Date(userProfile.trial_start_date);
        const trialEnd = new Date(trialStart);
        trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
        return trialEnd;
      },
    }),
    {
      name: 'revert-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
