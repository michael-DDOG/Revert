import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

// ============================================
// ONBOARDING CONTAINER
// ============================================
interface OnboardingContainerProps {
  children: React.ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  showProgress = true,
  currentStep = 1,
  totalSteps = 12,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: (currentStep / totalSteps) * 100,
      tension: 50,
      friction: 10,
      useNativeDriver: false,
    }).start();

    // Fade in text
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentStep, totalSteps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showProgress && (
        <Animated.View style={[styles.progressContainer, { opacity: textOpacity }]}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep} of {totalSteps}
          </Text>
        </Animated.View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// ============================================
// TITLE & SUBTITLE
// ============================================
interface OnboardingTitleProps {
  title: string;
  subtitle?: string;
  arabicText?: string;
  arabicTranslation?: string;
  centered?: boolean;
}

export const OnboardingTitle: React.FC<OnboardingTitleProps> = ({
  title,
  subtitle,
  arabicText,
  arabicTranslation,
  centered = false,
}) => {
  return (
    <View style={[styles.titleContainer, centered && styles.centered]}>
      {arabicText && (
        <>
          <Text style={styles.arabicText}>{arabicText}</Text>
          {arabicTranslation && (
            <Text style={styles.arabicTranslation}>{arabicTranslation}</Text>
          )}
        </>
      )}
      <Text style={[styles.title, centered && styles.centeredText]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, centered && styles.centeredText]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// ============================================
// TEXT INPUT
// ============================================
interface OnboardingInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}

export const OnboardingInput: React.FC<OnboardingInputProps> = ({
  value,
  onChangeText,
  placeholder,
  autoFocus = false,
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      autoFocus={autoFocus}
      autoCapitalize="words"
    />
  );
};

// ============================================
// SINGLE SELECT OPTION
// ============================================
interface SelectOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
  index?: number;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  label,
  selected,
  onPress,
  icon,
  index = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const radioScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    // Animate radio button when selected
    Animated.spring(radioScale, {
      toValue: selected ? 1 : 0,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.selectOption, selected && styles.selectOptionSelected]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View style={[styles.selectOptionInner, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.selectOptionContent}>
            {icon && <Text style={styles.selectOptionIcon}>{icon}</Text>}
            <Text
              style={[
                styles.selectOptionText,
                selected && styles.selectOptionTextSelected,
              ]}
            >
              {label}
            </Text>
          </View>
          <View
            style={[styles.radioOuter, selected && styles.radioOuterSelected]}
          >
            <Animated.View
              style={[
                styles.radioInner,
                { transform: [{ scale: radioScale }] }
              ]}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// MULTI SELECT OPTION (CHECKBOX)
// ============================================
interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  icon?: string;
  index?: number;
}

export const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  label,
  checked,
  onPress,
  icon,
  index = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    // Animate checkbox when checked
    if (checked) {
      Animated.sequence([
        Animated.spring(checkScale, {
          toValue: 1.2,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Bounce the whole card
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(checkScale, {
        toValue: 0,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [checked]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: bounceAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.checkboxOption, checked && styles.checkboxOptionChecked]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View style={[styles.checkboxInner, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkboxContent}>
            {icon && <Text style={styles.checkboxIcon}>{icon}</Text>}
            <Text
              style={[
                styles.checkboxText,
                checked && styles.checkboxTextChecked,
              ]}
            >
              {label}
            </Text>
          </View>
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            <Animated.Text
              style={[
                styles.checkmark,
                { transform: [{ scale: checkScale }] }
              ]}
            >
              ✓
            </Animated.Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// TOGGLE OPTION (FOR NOTIFICATIONS)
// ============================================
interface ToggleOptionProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  icon?: string;
  index?: number;
}

export const ToggleOption: React.FC<ToggleOptionProps> = ({
  label,
  enabled,
  onToggle,
  icon,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const thumbPosition = useRef(new Animated.Value(enabled ? 22 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    // Animate thumb position
    Animated.spring(thumbPosition, {
      toValue: enabled ? 22 : 0,
      tension: 300,
      friction: 15,
      useNativeDriver: true,
    }).start();
  }, [enabled]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Quick scale feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.toggleOption}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Animated.View style={[styles.toggleInner, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.toggleContent}>
            {icon && <Text style={styles.toggleIcon}>{icon}</Text>}
            <Text style={styles.toggleText}>{label}</Text>
          </View>
          <View style={[styles.toggle, enabled && styles.toggleEnabled]}>
            <Animated.View
              style={[
                styles.toggleThumb,
                { transform: [{ translateX: thumbPosition }] },
              ]}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// COMMITMENT CARD
// ============================================
interface CommitmentCardProps {
  time: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export const CommitmentCard: React.FC<CommitmentCardProps> = ({
  time,
  description,
  selected,
  onPress,
  index = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    if (selected) {
      // Animate check mark and glow
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 0,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.commitmentCard, selected && styles.commitmentCardSelected]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text
          style={[
            styles.commitmentTime,
            selected && styles.commitmentTimeSelected,
          ]}
        >
          {time}
        </Text>
        <Text
          style={[
            styles.commitmentDesc,
            selected && styles.commitmentDescSelected,
          ]}
        >
          {description}
        </Text>
        <Animated.View
          style={[
            styles.commitmentCheck,
            { transform: [{ scale: checkScale }], opacity: glowOpacity }
          ]}
        >
          <Text style={styles.commitmentCheckText}>✓</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// PRIMARY BUTTON
// ============================================
interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.buttonSecondary,
          disabled && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text
          style={[
            styles.buttonText,
            variant === 'secondary' && styles.buttonTextSecondary,
            disabled && styles.buttonTextDisabled,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// HELPER TEXT
// ============================================
interface HelperTextProps {
  text: string;
  icon?: string;
}

export const HelperText: React.FC<HelperTextProps> = ({ text, icon }) => {
  return (
    <View style={styles.helperContainer}>
      {icon && <Text style={styles.helperIcon}>{icon}</Text>}
      <Text style={styles.helperText}>{text}</Text>
    </View>
  );
};

// ============================================
// PROMISE ITEM
// ============================================
interface PromiseItemProps {
  text: string;
}

export const PromiseItem: React.FC<PromiseItemProps> = ({ text }) => {
  return (
    <View style={styles.promiseItem}>
      <Text style={styles.promiseCheck}>✓</Text>
      <Text style={styles.promiseText}>{text}</Text>
    </View>
  );
};

// ============================================
// AUDIO BUTTON
// ============================================
interface AudioButtonProps {
  label: string;
  onPress: () => void;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.audioButton} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.audioIcon}>🔊</Text>
      <Text style={styles.audioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  // Title
  titleContainer: {
    marginBottom: 32,
  },
  centered: {
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  arabicTranslation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  centeredText: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },

  // Input
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: theme.colors.text,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },

  // Select Option
  selectOption: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  selectOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  selectOptionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  selectOptionText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  selectOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },

  // Checkbox
  checkboxOption: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  checkboxOptionChecked: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  checkboxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  checkboxTextChecked: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Toggle
  toggleOption: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  toggleText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    padding: 2,
  },
  toggleEnabled: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  // Commitment Card
  commitmentCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  commitmentCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  commitmentTime: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  commitmentTimeSelected: {
    color: theme.colors.primary,
  },
  commitmentDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  commitmentDescSelected: {
    color: theme.colors.primary,
  },
  commitmentCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitmentCheckText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Button
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
  },
  buttonTextDisabled: {
    color: theme.colors.textSecondary,
  },

  // Helper
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  helperIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  helperText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },

  // Promise
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  promiseCheck: {
    fontSize: 18,
    color: theme.colors.primary,
    marginRight: 12,
    fontWeight: '700',
  },
  promiseText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },

  // Audio Button
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  audioIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  audioLabel: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
