import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import {
  AuthInput,
  AuthButton,
  AuthError,
  AuthHeader,
} from '../../components/AuthComponents';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) clearError();
    if (localError) setLocalError(null);
  }, [email, password, confirmPassword]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    Keyboard.dismiss();

    // Validation
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const success = await signUp(email.trim().toLowerCase(), password);
    if (success) {
      // Navigation will be handled by auth state change in App.tsx
    }
  };

  const canSignup =
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0;

  const displayError = localError || error?.message;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <AuthHeader
                arabicText="الْحَمْدُ لِلَّهِ"
                title="Begin Your Journey"
                subtitle="Create an account to start your path"
              />

              {/* Error Display */}
              {displayError && (
                <AuthError
                  message={displayError}
                  onDismiss={() => {
                    clearError();
                    setLocalError(null);
                  }}
                />
              )}

              {/* Form */}
              <View style={styles.form}>
                <AuthInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail"
                />
                <AuthInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password (min. 6 characters)"
                  secureTextEntry
                  icon="lock"
                />
                <AuthInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  secureTextEntry
                  icon="lock"
                />
              </View>

              {/* Trial Info */}
              <View style={styles.trialInfo}>
                <Text style={styles.trialIcon}>🎁</Text>
                <Text style={styles.trialText}>
                  Start with a 7-day free trial. No payment required now.
                </Text>
              </View>

              {/* Signup Button */}
              <AuthButton
                title="Create Account"
                onPress={handleSignup}
                disabled={!canSignup}
                loading={isLoading}
              />

              {/* Login Link */}
              <TouchableOpacity
                style={styles.linkContainer}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>
                  Already have an account?{' '}
                  <Text style={styles.linkHighlight}>Sign in</Text>
                </Text>
              </TouchableOpacity>

              {/* Terms Notice */}
              <Text style={styles.termsText}>
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </Text>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  form: {
    marginBottom: 16,
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted || 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  trialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  trialText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 8,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  linkHighlight: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.textMuted || theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
