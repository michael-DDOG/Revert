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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error, clearError } = useAuthStore();

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

  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password]);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email.trim() || !password) return;
    await signIn(email.trim().toLowerCase(), password);
  };

  const canLogin = email.trim().length > 0 && password.length >= 6;

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
                arabicText="بِسْمِ اللَّهِ"
                title="Welcome Back"
                subtitle="Sign in to continue your journey"
              />

              {/* Error Display */}
              {error && (
                <AuthError message={error.message} onDismiss={clearError} />
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
                  placeholder="Password"
                  secureTextEntry
                  icon="lock"
                />
              </View>

              {/* Login Button */}
              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                disabled={!canLogin}
                loading={isLoading}
              />

              {/* Signup Link */}
              <TouchableOpacity
                style={styles.linkContainer}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.linkText}>
                  Don't have an account?{' '}
                  <Text style={styles.linkHighlight}>Sign up</Text>
                </Text>
              </TouchableOpacity>

              {/* Decorative Element */}
              <View style={styles.decorativeContainer}>
                <View style={styles.decorativeLine} />
                <Text style={styles.decorativeStar}>✦</Text>
                <View style={styles.decorativeLine} />
              </View>
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
    marginBottom: 24,
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
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
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
