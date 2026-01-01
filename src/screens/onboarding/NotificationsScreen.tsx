import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import {
  OnboardingContainer,
  OnboardingTitle,
  ToggleOption,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { NotificationPreferences } from '../../types/onboarding';

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Notifications'>;
};

interface NotificationOption {
  key: keyof NotificationPreferences;
  label: string;
  icon: string;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { key: 'prayerTimes', label: 'Prayer time reminders (5x daily)', icon: '🕌' },
  { key: 'dailyLesson', label: 'Daily lesson reminder', icon: '📖' },
  { key: 'streakProtection', label: 'Streak protection alerts', icon: '🔥' },
  { key: 'weeklyReflection', label: 'Weekly reflection prompts', icon: '💭' },
  { key: 'islamicEvents', label: 'Islamic event notifications (Ramadan, Eid)', icon: '🌙' },
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, toggleNotification } = useOnboardingStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    navigation.navigate('Promise');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={10} totalSteps={12}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }
          ]}
        >
          <OnboardingTitle
            title="How should we support you?"
            subtitle="Choose which notifications will help you stay on track."
          />

          <View style={styles.optionsContainer}>
            {NOTIFICATION_OPTIONS.map((option, index) => (
              <ToggleOption
                key={option.key}
                label={option.label}
                enabled={notifications[option.key]}
                onToggle={() => toggleNotification(option.key)}
                icon={option.icon}
                index={index}
              />
            ))}
          </View>

          <HelperText
            text="You can customize all notifications in settings anytime."
            icon="🔕"
          />
        </Animated.View>

        <OnboardingButton
          title="Continue →"
          onPress={handleContinue}
        />
      </OnboardingContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
