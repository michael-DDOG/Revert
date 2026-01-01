// Auth and Subscription Types

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  trial_start_date: string;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'expired'
  | 'cancelled';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}

export interface SubscriptionPackage {
  identifier: string;
  packageType: 'MONTHLY' | 'ANNUAL' | 'WEEKLY' | 'LIFETIME';
  product: {
    identifier: string;
    priceString: string;
    price: number;
    currencyCode: string;
    title: string;
    description: string;
  };
}
