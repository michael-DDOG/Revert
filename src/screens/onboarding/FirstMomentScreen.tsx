import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import { OnboardingButton, AudioButton } from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { playAudio, getQuranAudioUrl, stopAudio } from '../../services';

const { width, height } = Dimensions.get('window');

type FirstMomentScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'FirstMoment'>;
};

export const FirstMomentScreen: React.FC<FirstMomentScreenProps> = ({ navigation }) => {
  const { completeOnboarding } = useOnboardingStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setShowContent(true);
    });

    // Breathing animation for the glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePlayAudio = async () => {
    // Play Bismillah (first verse of Al-Fatiha - Surah 1, Ayah 1)
    const bismillahUrl = getQuranAudioUrl(1, 1);
    await playAudio(bismillahUrl);
  };

  const handleStart = async () => {
    // Stop any playing audio before proceeding
    await stopAudio();
    completeOnboarding();
    // Navigate to main app - this will be handled by the root navigator
    // checking onboardingCompleted state
  };

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <Animated.View 
        style={[
          styles.glowBackground,
          { 
            opacity: glowAnim,
            transform: [{ scale: breatheAnim }],
          },
        ]} 
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim },
        ]}
      >
        {/* Main Message */}
        <View style={styles.mainContent}>
          <Text style={styles.instruction}>Take a breath.</Text>
          
          <View style={styles.bismillahContainer}>
            <Text style={styles.arabicText}>بِسْمِ اللَّه</Text>
            <Text style={styles.transliteration}>Bismillah</Text>
            <Text style={styles.translation}>"In the name of Allah"</Text>
          </View>

          <Animated.View 
            style={[
              styles.affirmation,
              { 
                opacity: showContent ? 1 : 0,
                transform: [{ scale: breatheAnim }],
              },
            ]}
          >
            <Text style={styles.affirmationText}>
              You've already begun.
            </Text>
          </Animated.View>

          {/* Audio Button */}
          <AudioButton
            label="Hear pronunciation"
            onPress={handlePlayAudio}
          />
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativePattern}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[styles.decorativeCircle, { opacity: 0.1 - i * 0.03 }]} />
          ))}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: fadeAnim },
        ]}
      >
        <OnboardingButton
          title="Start Day 1 →"
          onPress={handleStart}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  glowBackground: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  mainContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  instruction: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginBottom: 48,
    fontWeight: '300',
  },
  bismillahContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  arabicText: {
    fontSize: 48,
    color: theme.colors.primary,
    marginBottom: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(16, 185, 129, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  transliteration: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  affirmation: {
    marginTop: 32,
  },
  affirmationText: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: '500',
  },
  decorativePattern: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
