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
  KnowledgeLevel,
  KNOWLEDGE_LEVEL_LABELS,
} from '../../types/onboarding';

type KnowledgeLevelScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'KnowledgeLevel'>;
};

const KNOWLEDGE_OPTIONS: { value: KnowledgeLevel; icon: string }[] = [
  { value: 'complete_beginner', icon: '🌱' },
  { value: 'know_basics', icon: '📚' },
  { value: 'can_pray', icon: '🤲' },
  { value: 'comfortable', icon: '🎓' },
];

export const KnowledgeLevelScreen: React.FC<KnowledgeLevelScreenProps> = ({ navigation }) => {
  const { knowledgeLevel, setKnowledgeLevel } = useOnboardingStore();
  const [selected, setSelected] = useState<KnowledgeLevel>(knowledgeLevel);
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

  const handleSelect = (level: KnowledgeLevel) => {
    setSelected(level);
  };

  const handleContinue = () => {
    setKnowledgeLevel(selected);
    navigation.navigate('Challenge');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={6} totalSteps={12}>
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
            title="Where are you in your learning?"
            subtitle="Be honest - there's no judgment here. We'll meet you exactly where you are."
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {KNOWLEDGE_OPTIONS.map((option, index) => (
              <SelectOption
                key={option.value}
                label={KNOWLEDGE_LEVEL_LABELS[option.value]}
                selected={selected === option.value}
                onPress={() => handleSelect(option.value)}
                icon={option.icon}
                index={index}
              />
            ))}
          </ScrollView>

          <HelperText
            text="We'll adjust the content to match your level. You can always explore advanced topics when ready."
            icon="📈"
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
