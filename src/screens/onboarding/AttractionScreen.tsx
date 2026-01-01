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
  CheckboxOption,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import {
  AttractionToIslam,
  ATTRACTION_LABELS,
} from '../../types/onboarding';

type AttractionScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Attraction'>;
};

const ATTRACTION_OPTIONS: { value: AttractionToIslam; icon: string }[] = [
  { value: 'tawhid', icon: '☝️' },
  { value: 'quran', icon: '📖' },
  { value: 'muslim_connection', icon: '👥' },
  { value: 'seeking_truth', icon: '🔍' },
  { value: 'peace_spirituality', icon: '🕊️' },
  { value: 'community', icon: '🤝' },
  { value: 'other', icon: '✨' },
];

export const AttractionScreen: React.FC<AttractionScreenProps> = ({ navigation }) => {
  const { attractionsToIslam, setAttractionsToIslam } = useOnboardingStore();
  const [selected, setSelected] = useState<AttractionToIslam[]>(attractionsToIslam);
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

  const toggleSelection = (attraction: AttractionToIslam) => {
    if (selected.includes(attraction)) {
      setSelected(selected.filter((a) => a !== attraction));
    } else {
      setSelected([...selected, attraction]);
    }
  };

  const handleContinue = () => {
    setAttractionsToIslam(selected);
    navigation.navigate('KnowledgeLevel');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={5} totalSteps={12}>
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
            title="What drew you to Islam?"
            subtitle="Select all that apply. Everyone's journey is unique."
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {ATTRACTION_OPTIONS.map((option, index) => (
              <CheckboxOption
                key={option.value}
                label={ATTRACTION_LABELS[option.value]}
                checked={selected.includes(option.value)}
                onPress={() => toggleSelection(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="Your story matters. We'll share relevant content based on your path."
            icon="💫"
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
