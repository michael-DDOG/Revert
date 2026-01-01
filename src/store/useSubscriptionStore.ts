import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import * as RevenueCatService from '../services/revenuecat';

interface SubscriptionState {
  // State
  isSubscribed: boolean;
  offerings: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  error: string | null;
  purchaseInProgress: boolean;

  // Actions
  fetchOfferings: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  checkSubscriptionStatus: () => Promise<void>;
  clearError: () => void;
  reset: () => void;

  // Helpers
  getMonthlyPackage: () => PurchasesPackage | undefined;
  getAnnualPackage: () => PurchasesPackage | undefined;
  getLifetimePackage: () => PurchasesPackage | undefined;
  getSubscriptionExpiration: () => string | null;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      isSubscribed: false,
      offerings: null,
      customerInfo: null,
      isLoading: false,
      error: null,
      purchaseInProgress: false,

      // Fetch available offerings/products
      fetchOfferings: async () => {
        try {
          set({ isLoading: true, error: null });
          const offerings = await RevenueCatService.getOfferings();
          set({ offerings });
        } catch (error: any) {
          console.error('Error fetching offerings:', error);
          set({ error: error.message || 'Failed to load subscription options' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Purchase a package
      purchasePackage: async (pkg: PurchasesPackage) => {
        try {
          set({ purchaseInProgress: true, error: null });
          const result = await RevenueCatService.purchasePackage(pkg);

          // Handle user cancellation
          if (result.userCancelled) {
            return false;
          }

          // Handle purchase failure
          if (!result.success || !result.customerInfo) {
            set({ error: result.error || 'Purchase failed' });
            return false;
          }

          const isSubscribed =
            result.customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID] !==
            undefined;

          set({ customerInfo: result.customerInfo, isSubscribed });
          return isSubscribed;
        } catch (error: any) {
          set({ error: error.message || 'Purchase failed' });
          return false;
        } finally {
          set({ purchaseInProgress: false });
        }
      },

      // Restore previous purchases
      restorePurchases: async () => {
        try {
          set({ isLoading: true, error: null });
          const result = await RevenueCatService.restorePurchases();

          if (!result.success || !result.customerInfo) {
            set({ error: result.error || 'No active subscriptions found' });
            return false;
          }

          const isSubscribed =
            result.customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID] !==
            undefined;

          set({ customerInfo: result.customerInfo, isSubscribed });

          if (!isSubscribed) {
            set({ error: 'No active subscriptions found' });
          }

          return isSubscribed;
        } catch (error: any) {
          set({ error: error.message || 'Failed to restore purchases' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Check current subscription status
      checkSubscriptionStatus: async () => {
        try {
          const isSubscribed = await RevenueCatService.checkPremiumAccess();
          const customerInfo = await RevenueCatService.getCustomerInfo();
          set({ isSubscribed, customerInfo });
        } catch (error) {
          console.error('Error checking subscription:', error);
          // Don't update state on error - keep cached value
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store (for logout)
      reset: () =>
        set({
          isSubscribed: false,
          offerings: null,
          customerInfo: null,
          error: null,
        }),

      // Get monthly package from offerings
      getMonthlyPackage: () => {
        const { offerings } = get();
        return offerings?.availablePackages.find(
          (pkg) => pkg.packageType === 'MONTHLY'
        );
      },

      // Get annual package from offerings
      getAnnualPackage: () => {
        const { offerings } = get();
        return offerings?.availablePackages.find(
          (pkg) => pkg.packageType === 'ANNUAL'
        );
      },

      // Get lifetime package from offerings
      getLifetimePackage: () => {
        const { offerings } = get();
        return offerings?.availablePackages.find(
          (pkg) => pkg.packageType === 'LIFETIME'
        );
      },

      // Get subscription expiration date
      getSubscriptionExpiration: () => {
        const { customerInfo } = get();
        if (!customerInfo) return null;

        const entitlement =
          customerInfo.entitlements.active[RevenueCatService.ENTITLEMENT_ID];
        return entitlement?.expirationDate || null;
      },
    }),
    {
      name: 'revert-subscription',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist subscription status for offline access
      partialize: (state) => ({
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);
