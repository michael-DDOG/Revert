import Purchases, {
  PurchasesOffering,
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL,
  PACKAGE_TYPE,
  PurchasesError,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

// Get API key from app.json extra
const apiKey = Constants.expoConfig?.extra?.revenuecatApiKey || '';

// Entitlement ID for premium access - must match your RevenueCat dashboard
export const ENTITLEMENT_ID = 'Revert Pro';

// Product identifiers (must match RevenueCat dashboard)
export const PRODUCT_IDS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

// ============================================
// INITIALIZATION
// ============================================

let isConfigured = false;

export const initRevenueCat = async (userId?: string): Promise<void> => {
  if (isConfigured) {
    logger.debug('RevenueCat already configured');
    return;
  }

  if (!apiKey) {
    logger.warn('RevenueCat API key not configured');
    return;
  }

  try {
    // Set debug logging in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.INFO);
    }

    await Purchases.configure({
      apiKey,
      appUserID: userId || undefined,
    });

    isConfigured = true;
    logger.info('RevenueCat configured successfully');
  } catch (error) {
    logger.error('Error configuring RevenueCat:', error);
    throw error;
  }
};

export const isRevenueCatConfigured = (): boolean => isConfigured;

// ============================================
// USER IDENTIFICATION
// ============================================

export const identifyUser = async (userId: string): Promise<CustomerInfo> => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    logger.error('Error identifying user in RevenueCat:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.logOut();
    return customerInfo;
  } catch (error) {
    logger.error('Error logging out from RevenueCat:', error);
    throw error;
  }
};

export const getCurrentUserId = async (): Promise<string> => {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo.originalAppUserId;
};

// ============================================
// OFFERINGS & PRODUCTS
// ============================================

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error('Error getting offerings:', error);
    throw error;
  }
};

export const getAllOfferings = async (): Promise<{ [key: string]: PurchasesOffering }> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.all;
  } catch (error) {
    logger.error('Error getting all offerings:', error);
    throw error;
  }
};

export const getAvailablePackages = async (): Promise<PurchasesPackage[]> => {
  const offering = await getOfferings();
  return offering?.availablePackages || [];
};

// ============================================
// PURCHASES
// ============================================

export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  userCancelled?: boolean;
}

export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<PurchaseResult> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return {
      success: true,
      customerInfo,
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;

    // Handle user cancellation
    if (purchaseError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return {
        success: false,
        userCancelled: true,
        error: 'Purchase cancelled',
      };
    }

    // Handle already purchased
    if (purchaseError.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      // Refresh customer info
      const customerInfo = await Purchases.getCustomerInfo();
      return {
        success: true,
        customerInfo,
      };
    }

    logger.error('Error purchasing package:', error);
    return {
      success: false,
      error: purchaseError.message || 'Purchase failed',
    };
  }
};

export const restorePurchases = async (): Promise<PurchaseResult> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasAccess = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: hasAccess,
      customerInfo,
      error: hasAccess ? undefined : 'No active subscriptions found',
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;
    logger.error('Error restoring purchases:', error);
    return {
      success: false,
      error: purchaseError.message || 'Failed to restore purchases',
    };
  }
};

// ============================================
// REVENUECAT PAYWALL UI
// ============================================

export { PAYWALL_RESULT };

export interface PaywallPresentResult {
  result: PAYWALL_RESULT;
  customerInfo?: CustomerInfo;
}

export const presentPaywall = async (): Promise<PaywallPresentResult> => {
  try {
    const paywallResult = await RevenueCatUI.presentPaywall();

    // Get updated customer info after paywall closes
    const customerInfo = await Purchases.getCustomerInfo();

    return {
      result: paywallResult,
      customerInfo,
    };
  } catch (error) {
    logger.error('Error presenting paywall:', error);
    throw error;
  }
};

export const presentPaywallIfNeeded = async (): Promise<PaywallPresentResult> => {
  try {
    const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
    });

    const customerInfo = await Purchases.getCustomerInfo();

    return {
      result: paywallResult,
      customerInfo,
    };
  } catch (error) {
    logger.error('Error presenting paywall:', error);
    throw error;
  }
};

// ============================================
// SUBSCRIPTION STATUS
// ============================================

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    logger.error('Error getting customer info:', error);
    throw error;
  }
};

export const checkPremiumAccess = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    logger.error('Error checking premium access:', error);
    return false;
  }
};

export interface SubscriptionInfo {
  isActive: boolean;
  entitlementId: string | null;
  expirationDate: string | null;
  productIdentifier: string | null;
  isLifetime: boolean;
  willRenew: boolean;
}

export const getSubscriptionInfo = async (): Promise<SubscriptionInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (entitlement) {
      return {
        isActive: true,
        entitlementId: ENTITLEMENT_ID,
        expirationDate: entitlement.expirationDate,
        productIdentifier: entitlement.productIdentifier,
        isLifetime: entitlement.expirationDate === null,
        willRenew: entitlement.willRenew,
      };
    }

    return {
      isActive: false,
      entitlementId: null,
      expirationDate: null,
      productIdentifier: null,
      isLifetime: false,
      willRenew: false,
    };
  } catch (error) {
    logger.error('Error getting subscription info:', error);
    return {
      isActive: false,
      entitlementId: null,
      expirationDate: null,
      productIdentifier: null,
      isLifetime: false,
      willRenew: false,
    };
  }
};

// ============================================
// CUSTOMER INFO LISTENER
// ============================================

type CustomerInfoListener = (customerInfo: CustomerInfo) => void;

export const addCustomerInfoListener = (
  listener: CustomerInfoListener
): (() => void) => {
  Purchases.addCustomerInfoUpdateListener(listener);

  // Return cleanup function
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
};

// ============================================
// HELPERS
// ============================================

export const getMonthlyPackage = (
  packages: PurchasesPackage[]
): PurchasesPackage | undefined => {
  return packages.find((pkg) => pkg.packageType === PACKAGE_TYPE.MONTHLY);
};

export const getAnnualPackage = (
  packages: PurchasesPackage[]
): PurchasesPackage | undefined => {
  return packages.find((pkg) => pkg.packageType === PACKAGE_TYPE.ANNUAL);
};

export const getLifetimePackage = (
  packages: PurchasesPackage[]
): PurchasesPackage | undefined => {
  return packages.find((pkg) => pkg.packageType === PACKAGE_TYPE.LIFETIME);
};

export const getPackageByIdentifier = (
  packages: PurchasesPackage[],
  identifier: string
): PurchasesPackage | undefined => {
  return packages.find((pkg) => pkg.identifier === identifier);
};

// Format price for display
export const formatPrice = (pkg: PurchasesPackage): string => {
  return pkg.product.priceString;
};

// Calculate savings percentage for annual vs monthly
export const calculateAnnualSavings = (
  monthlyPkg: PurchasesPackage | undefined,
  annualPkg: PurchasesPackage | undefined
): number => {
  if (!monthlyPkg || !annualPkg) return 0;

  const monthlyYearCost = monthlyPkg.product.price * 12;
  const annualCost = annualPkg.product.price;

  if (monthlyYearCost <= 0) return 0;

  return Math.round((1 - annualCost / monthlyYearCost) * 100);
};
