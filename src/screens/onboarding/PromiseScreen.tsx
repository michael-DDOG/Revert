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
  PromiseItem,
  OnboardingButton,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type PromiseScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Promise'>;
};

const PROMISES = [
  'No judgment - only support',
  'Go at your own pace',
  'Ask any question - nothing is "too basic"',
  'Your data stays private',
  '50% of every purchase helps those in need',
];

export const PromiseScreen: React.FC<PromiseScreenProps> = ({ navigation }) => {
  const { name } = useOnboardingStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

  const handleContinue = () => {
    navigation.navigate('FirstMoment');
  };

  return (
    <View style={styles.container}>
      <OnboardingContainer currentStep={11} totalSteps={12}>
        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <OnboardingTitle
            title="Our Promise to You"
            centered
          />

          <View style={styles.promiseCard}>
            {PROMISES.map((promise, index) => (
              <PromiseItem key={index} text={promise} />
            ))}
          </View>

          <View style={styles.communityContainer}>
            <Text style={styles.communityText}>You are not alone.</Text>
            <Text style={styles.communityCount}>
              23,000+ reverts are on this journey with you.
            </Text>
          </View>

          {/* Decorative Element */}
          <View style={styles.decorativeContainer}>
            <View style={styles.decorativeLine} />
            <Text style={styles.decorativeStar}>✦</Text>
            <View style={styles.decorativeLine} />
          </View>
        </Animated.View>

        <OnboardingButton
          title="Begin My Journey →"
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
    alignItems: 'center',
  },
  promiseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  communityContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  communityText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  communityCount: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  decorativeStar: {
    fontSize: 16,
    color: theme.colors.primary,
    marginHorizontal: 16,
  },
});
