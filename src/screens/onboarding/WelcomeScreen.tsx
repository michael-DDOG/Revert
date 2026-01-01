import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import { OnboardingButton } from '../../components/OnboardingComponents';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

const { width, height } = Dimensions.get('window');

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative Pattern Background */}
      <View style={styles.patternContainer}>
        <View style={styles.pattern} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Arabic Bismillah */}
        <Text style={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Text>
        <Text style={styles.transliteration}>
          Bismillah ir-Rahman ir-Rahim
        </Text>
        <Text style={styles.translation}>
          "In the name of God, the Most Gracious, the Most Merciful"
        </Text>

        {/* Main Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Home</Text>
          <Text style={styles.welcomeSubtitle}>
            You've taken the most beautiful step.{'\n'}
            We're honored to walk with you.
          </Text>
        </View>

        {/* Decorative Element */}
        <View style={styles.decorativeLine}>
          <View style={styles.line} />
          <Text style={styles.star}>✦</Text>
          <View style={styles.line} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: fadeAnim },
        ]}
      >
        <OnboardingButton
          title="Continue →"
          onPress={() => navigation.navigate('Name')}
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
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    overflow: 'hidden',
  },
  pattern: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  arabicText: {
    fontSize: 28,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 2,
  },
  transliteration: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  star: {
    fontSize: 16,
    color: theme.colors.primary,
    marginHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
