import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';

// ============================================
// AUTH INPUT
// ============================================
interface AuthInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  icon?: 'mail' | 'lock' | 'user';
}

export const AuthInput: React.FC<AuthInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoFocus = false,
  icon,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'mail':
        return '✉️';
      case 'lock':
        return '🔒';
      case 'user':
        return '👤';
      default:
        return null;
    }
  };

  return (
    <View style={styles.inputContainer}>
      {icon && <Text style={styles.inputIcon}>{getIcon()}</Text>}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        autoCorrect={false}
      />
    </View>
  );
};

// ============================================
// AUTH BUTTON
// ============================================
interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'text' && styles.buttonText,
    (disabled || loading) && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.buttonLabel,
    variant === 'secondary' && styles.buttonLabelSecondary,
    variant === 'text' && styles.buttonLabelText,
    (disabled || loading) && styles.buttonLabelDisabled,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={textStyle}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// AUTH ERROR
// ============================================
interface AuthErrorProps {
  message: string;
  onDismiss?: () => void;
}

export const AuthError: React.FC<AuthErrorProps> = ({ message, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [message]);

  return (
    <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorText}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.errorDismiss}>
          <Text style={styles.errorDismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ============================================
// AUTH DIVIDER
// ============================================
interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = 'or' }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

// ============================================
// AUTH HEADER
// ============================================
interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  arabicText?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  arabicText,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {arabicText && <Text style={styles.arabicText}>{arabicText}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  inputIcon: {
    fontSize: 18,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputWithIcon: {
    paddingLeft: 12,
  },

  // Button
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
    padding: 12,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  buttonLabelSecondary: {
    color: theme.colors.primary,
  },
  buttonLabelText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  buttonLabelDisabled: {
    color: theme.colors.textSecondary,
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#ef4444',
  },
  errorDismiss: {
    padding: 4,
  },
  errorDismissText: {
    fontSize: 14,
    color: '#ef4444',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginHorizontal: 16,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  arabicText: {
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
