import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import {
  OnboardingContainer,
  OnboardingTitle,
  CommitmentCard,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import {
  DailyCommitment,
  COMMITMENT_LABELS,
} from '../../types/onboarding';

type CommitmentScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Commitment'>;
};

const COMMITMENT_OPTIONS: DailyCommitment[] = ['quick', 'steady', 'deep'];

export const CommitmentScreen: React.FC<CommitmentScreenProps> = ({ navigation }) => {
  const { dailyCommitment, setDailyCommitment } = useOnboardingStore();
  const [selected, setSelected] = useState<DailyCommitment>(dailyCommitment);
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

  const handleSelect = (commitment: DailyCommitment) => {
    setSelected(commitment);
  };

  const handleContinue = () => {
    setDailyCommitment(selected);
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={9} totalSteps={12}>
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
            title="How much time can you give each day?"
            subtitle="Be realistic - consistency beats intensity. You can always adjust this later."
          />

          <View style={styles.cardsContainer}>
            {COMMITMENT_OPTIONS.map((option, index) => (
              <CommitmentCard
                key={option}
                time={COMMITMENT_LABELS[option].label}
                description={COMMITMENT_LABELS[option].description}
                selected={selected === option}
                onPress={() => handleSelect(option)}
                index={index}
              />
            ))}
          </View>

          <HelperText
            text="Even 5 minutes a day can transform your life. The Prophet ﷺ said: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.'"
            icon="💡"
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
  cardsContainer: {
    marginTop: 8,
  },
});
