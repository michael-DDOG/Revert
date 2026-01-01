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
  SpiritualBackground,
  SPIRITUAL_BACKGROUND_LABELS,
} from '../../types/onboarding';

type BackgroundScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Background'>;
};

const BACKGROUND_OPTIONS: { value: SpiritualBackground; icon: string }[] = [
  { value: 'christianity', icon: '✝️' },
  { value: 'judaism', icon: '✡️' },
  { value: 'hinduism_buddhism', icon: '🕉️' },
  { value: 'other_religion', icon: '🙏' },
  { value: 'atheist_agnostic', icon: '🔬' },
  { value: 'spiritual_not_religious', icon: '🌟' },
  { value: 'prefer_not_say', icon: '🤐' },
];

export const BackgroundScreen: React.FC<BackgroundScreenProps> = ({ navigation }) => {
  const { spiritualBackground, setSpiritualBackground } = useOnboardingStore();
  const [selected, setSelected] = useState<SpiritualBackground>(spiritualBackground);
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

  const handleSelect = (background: SpiritualBackground) => {
    setSelected(background);
  };

  const handleContinue = () => {
    setSpiritualBackground(selected);
    navigation.navigate('Attraction');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={4} totalSteps={12}>
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
            title="What's your spiritual background?"
            subtitle="Understanding where you're coming from helps us explain concepts in ways that resonate with you."
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {BACKGROUND_OPTIONS.map((option, index) => (
              <SelectOption
                key={option.value}
                label={SPIRITUAL_BACKGROUND_LABELS[option.value]}
                selected={selected === option.value}
                onPress={() => handleSelect(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="This information is completely private and only used to personalize your learning experience."
            icon="🔒"
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
