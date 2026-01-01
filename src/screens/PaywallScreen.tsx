import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useAuthStore } from '../store/useAuthStore';

type PlanType = 'monthly' | 'yearly';

export const PaywallScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const {
    offerings,
    isLoading,
    purchaseInProgress,
    error,
    fetchOfferings,
    purchasePackage,
    restorePurchases,
    getMonthlyPackage,
    getAnnualPackage,
    clearError,
  } = useSubscriptionStore();

  const { signOut } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchOfferings();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const monthlyPackage = getMonthlyPackage();
  const yearlyPackage = getAnnualPackage();

  const handleSelectPlan = (plan: PlanType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pkg = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;
    if (pkg) {
      const success = await purchasePackage(pkg);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const success = await restorePurchases();
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Your subscription has been restored!');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  // Calculate savings for yearly
  const monthlyPrice = monthlyPackage?.product.price || 4.99;
  const yearlyPrice = yearlyPackage?.product.price || 29.99;
  const yearlySavings = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  if (isLoading && !offerings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.arabicText}>الْحَمْدُ لِلَّهِ</Text>
            <Text style={styles.title}>Continue Your Journey</Text>
            <Text style={styles.subtitle}>
              Your free trial has ended. Subscribe to keep growing in your faith.
            </Text>
          </View>

          {/* Charity Message */}
          <View style={styles.charityCard}>
            <Text style={styles.charityIcon}>💝</Text>
            <View style={styles.charityContent}>
              <Text style={styles.charityTitle}>Faith That Gives Back</Text>
              <Text style={styles.charityText}>
                50% of your subscription goes directly to charity, supporting Muslims in need around the world.
              </Text>
            </View>
          </View>

          {/* Plan Selection */}
          <View style={styles.plansContainer}>
            {/* Yearly Plan */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'yearly' && styles.planCardSelected,
              ]}
              onPress={() => handleSelectPlan('yearly')}
              activeOpacity={0.8}
            >
              {yearlySavings > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save {yearlySavings}%</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan === 'yearly' && styles.radioOuterSelected,
                  ]}
                >
                  {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>Yearly</Text>
                  <Text style={styles.planSubtitle}>Best value</Text>
                </View>
              </View>
              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>
                  {yearlyPackage?.product.priceString || '$29.99'}
                </Text>
                <Text style={styles.planPeriod}>/year</Text>
              </View>
              <Text style={styles.planBreakdown}>
                Just {((yearlyPrice) / 12).toFixed(2)}/month
              </Text>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.planCardSelected,
              ]}
              onPress={() => handleSelectPlan('monthly')}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan === 'monthly' && styles.radioOuterSelected,
                  ]}
                >
                  {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>Monthly</Text>
                  <Text style={styles.planSubtitle}>Flexible</Text>
                </View>
              </View>
              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>
                  {monthlyPackage?.product.priceString || '$4.99'}
                </Text>
                <Text style={styles.planPeriod}>/month</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you get:</Text>
            {[
              'Daily guided Islamic learning',
              'Prayer time reminders',
              'Streak tracking & rewards',
              'Offline access to all content',
              'Support for Muslim charities',
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, purchaseInProgress && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={purchaseInProgress}
            activeOpacity={0.8}
          >
            {purchaseInProgress ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.subscribeButtonText}>
                Subscribe {selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isLoading}
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* Sign Out Link */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  arabicText: {
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  charityCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  charityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  charityContent: {
    flex: 1,
  },
  charityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  charityText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  planSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  planPeriod: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  planBreakdown: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  featuresContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCheck: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 12,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  subscribeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  restoreText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  signOutButton: {
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 14,
    color: theme.colors.textMuted || theme.colors.textSecondary,
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.textMuted || theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PaywallScreen;
