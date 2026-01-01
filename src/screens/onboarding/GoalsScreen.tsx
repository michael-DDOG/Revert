import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import {
  OnboardingContainer,
  OnboardingTitle,
  CheckboxOption,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import {
  JourneyGoal,
  GOAL_LABELS,
} from '../../types/onboarding';

type GoalsScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Goals'>;
};

const GOAL_OPTIONS: { value: JourneyGoal; icon: string }[] = [
  { value: 'pray_confidently', icon: '🤲' },
  { value: 'understand_beliefs', icon: '📖' },
  { value: 'learn_arabic', icon: '🔤' },
  { value: 'feel_connected', icon: '💚' },
  { value: 'build_friendships', icon: '🤝' },
  { value: 'tell_family', icon: '👨‍👩‍👧' },
  { value: 'feel_peace', icon: '🕊️' },
];

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const { journeyGoals, setJourneyGoals } = useOnboardingStore();
  const [selected, setSelected] = useState<JourneyGoal[]>(journeyGoals);
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

  const toggleSelection = (goal: JourneyGoal) => {
    if (selected.includes(goal)) {
      setSelected(selected.filter((g) => g !== goal));
    } else {
      setSelected([...selected, goal]);
    }
  };

  const handleContinue = () => {
    setJourneyGoals(selected);
    navigation.navigate('Commitment');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={8} totalSteps={12}>
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
            title="What do you hope to achieve?"
            subtitle="In 30 days, I want to..."
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {GOAL_OPTIONS.map((option, index) => (
              <CheckboxOption
                key={option.value}
                label={GOAL_LABELS[option.value]}
                checked={selected.includes(option.value)}
                onPress={() => toggleSelection(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="We'll track your progress toward these goals and celebrate your achievements."
            icon="🎯"
          />
        </Animated.View>

        <OnboardingButton
          title="Continue →"
          onPress={handleContinue}
          disabled={selected.length === 0}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});
