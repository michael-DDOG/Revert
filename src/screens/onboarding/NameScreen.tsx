import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../constants/theme';
import {
  OnboardingContainer,
  OnboardingTitle,
  OnboardingInput,
  OnboardingButton,
  HelperText,
} from '../../components/OnboardingComponents';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NameScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Name'>;
};

export const NameScreen: React.FC<NameScreenProps> = ({ navigation }) => {
  const { name, setName } = useOnboardingStore();
  const [localName, setLocalName] = useState(name);
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

  const handleContinue = () => {
    setName(localName.trim());
    navigation.navigate('ShahadaDate');
  };

  const canContinue = localName.trim().length > 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <OnboardingContainer currentStep={2} totalSteps={12}>
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
              title="What should we call you?"
              subtitle="This helps us personalize your journey. You can change this anytime."
            />

            <OnboardingInput
              value={localName}
              onChangeText={setLocalName}
              placeholder="Your name or nickname"
              autoFocus
            />

            <HelperText
              text="Your name will only be used within the app to greet you and personalize your experience."
              icon="🔒"
            />
          </Animated.View>

          <OnboardingButton
            title="Continue →"
            onPress={handleContinue}
            disabled={!canContinue}
          />
        </OnboardingContainer>
      </View>
    </TouchableWithoutFeedback>
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
});
