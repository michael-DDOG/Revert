import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import {
  OnboardingContainer,
  OnboardingTitle,
  SelectOption,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import {
  BiggestChallenge,
  CHALLENGE_LABELS,
} from '../../types/onboarding';

type ChallengeScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Challenge'>;
};

const CHALLENGE_OPTIONS: { value: BiggestChallenge; icon: string }[] = [
  { value: 'learning_prayer', icon: '🤲' },
  { value: 'arabic', icon: '🔤' },
  { value: 'family_support', icon: '👨‍👩‍👧' },
  { value: 'finding_community', icon: '🕌' },
  { value: 'changing_habits', icon: '🔄' },
  { value: 'feeling_alone', icon: '💭' },
  { value: 'judgment_worry', icon: '😟' },
  { value: 'information_overload', icon: '📚' },
];

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ navigation }) => {
  const { biggestChallenge, setBiggestChallenge } = useOnboardingStore();
  const [selected, setSelected] = useState<BiggestChallenge>(biggestChallenge);
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

  const handleSelect = (challenge: BiggestChallenge) => {
    setSelected(challenge);
  };

  const handleContinue = () => {
    setBiggestChallenge(selected);
    navigation.navigate('Goals');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={7} totalSteps={12}>
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
            title="What feels hardest right now?"
            subtitle="Select your top concern. We'll provide extra support in this area."
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {CHALLENGE_OPTIONS.map((option, index) => (
              <SelectOption
                key={option.value}
                label={CHALLENGE_LABELS[option.value]}
                selected={selected === option.value}
                onPress={() => handleSelect(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="Whatever your challenge, you're not alone. Thousands have walked this path before you."
            icon="💪"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});
