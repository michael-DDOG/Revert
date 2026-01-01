import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './src/constants/theme';
import { useOnboardingStore } from './src/store/useOnboardingStore';
import { useAuthStore } from './src/store/useAuthStore';
import { useSubscriptionStore } from './src/store/useSubscriptionStore';
import { MainTabNavigator } from './src/navigation/MainTabNavigator';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OfflineBanner } from './src/components/OfflineBanner';

const Stack = createNativeStackNavigator();

// Root Navigator - handles all navigation logic
const RootNavigator = () => {
  const { onboardingCompleted, isOnboardingComplete } = useOnboardingStore();
  const { isAuthenticated, isTrialActive, getTrialDaysRemaining, isLoading: authLoading, initialize: initAuth } = useAuthStore();
  const { isSubscribed, checkSubscriptionStatus } = useSubscriptionStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auth (checks session, loads user profile)
        await initAuth();

        // Check subscription status if authenticated
        if (isAuthenticated) {
          await checkSubscriptionStatus();
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Small delay to ensure stores are hydrated
        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
      }
    };

    initializeApp();
  }, []);

  // Re-check subscription when auth state changes
  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine which navigator to show
  const getNavigatorScreen = () => {
    // 1. Not authenticated → Auth screens
    if (!isAuthenticated) {
      return <Stack.Screen name="Auth" component={AuthNavigator} />;
    }

    // 2. Authenticated but not onboarded → Onboarding
    if (!onboardingCompleted && !isOnboardingComplete()) {
      return <Stack.Screen name="Onboarding" component={OnboardingNavigator} />;
    }

    // 3. Onboarded, trial expired, not subscribed → Paywall
    const trialActive = isTrialActive();
    if (!trialActive && !isSubscribed) {
      return <Stack.Screen name="Paywall" component={PaywallScreen} />;
    }

    // 4. All good → Main app
    return <Stack.Screen name="MainTabs" component={MainTabNavigator} />;
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getNavigatorScreen()}
    </Stack.Navigator>
  );
};

// Navigation Theme
const navigationTheme = {
  dark: true,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <StatusBar
            barStyle="light-content"
            backgroundColor={theme.colors.background}
          />
          <OfflineBanner />
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
