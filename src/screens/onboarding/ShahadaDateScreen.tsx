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
  ShahadaTiming,
  SHAHADA_TIMING_LABELS,
} from '../../types/onboarding';

type ShahadaDateScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'ShahadaDate'>;
};

const TIMING_OPTIONS: { value: ShahadaTiming; icon: string }[] = [
  { value: 'exploring', icon: '🔍' },
  { value: 'today', icon: '✨' },
  { value: 'this_week', icon: '📅' },
  { value: 'this_month', icon: '🌙' },
  { value: 'over_month', icon: '📆' },
  { value: 'over_year', icon: '🎉' },
];

export const ShahadaDateScreen: React.FC<ShahadaDateScreenProps> = ({ navigation }) => {
  const { shahadaTiming, setShahadaTiming, setShahadaDate } = useOnboardingStore();
  const [selected, setSelected] = useState<ShahadaTiming>(shahadaTiming);
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

  const handleSelect = (timing: ShahadaTiming) => {
    setSelected(timing);
  };

  const handleContinue = () => {
    setShahadaTiming(selected);
    
    // Set approximate shahada date based on selection
    const now = new Date();
    let shahadaDate: string | null = null;
    
    switch (selected) {
      case 'today':
        shahadaDate = now.toISOString();
        break;
      case 'this_week':
        now.setDate(now.getDate() - 3);
        shahadaDate = now.toISOString();
        break;
      case 'this_month':
        now.setDate(now.getDate() - 15);
        shahadaDate = now.toISOString();
        break;
      case 'over_month':
        now.setMonth(now.getMonth() - 2);
        shahadaDate = now.toISOString();
        break;
      case 'over_year':
        now.setFullYear(now.getFullYear() - 1);
        shahadaDate = now.toISOString();
        break;
      // 'exploring' keeps it null
    }
    
    setShahadaDate(shahadaDate);
    navigation.navigate('Background');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={3} totalSteps={12}>
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
            title="When did you take your Shahada?"
            subtitle="The declaration of faith that marks the beginning of your journey."
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {TIMING_OPTIONS.map((option, index) => (
              <SelectOption
                key={option.value}
                label={SHAHADA_TIMING_LABELS[option.value]}
                selected={selected === option.value}
                onPress={() => handleSelect(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="We'll celebrate this anniversary with you every year 🌙"
            icon="🎊"
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
