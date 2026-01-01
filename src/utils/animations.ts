// Shared Animation Utilities
// Beautiful, smooth animations for The Revert app

import { Animated, Easing } from 'react-native';

// Animation timing presets
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// Easing presets for smooth animations
export const EASING = {
  smooth: Easing.bezier(0.4, 0, 0.2, 1), // Material Design standard
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0, 1, 1),
} as const;

// Fade in animation
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: EASING.smooth,
    useNativeDriver: true,
  });
};

// Fade out animation
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.smooth,
    useNativeDriver: true,
  });
};

// Slide in from bottom
export const slideInFromBottom = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: EASING.decelerate,
    useNativeDriver: true,
  });
};

// Scale animation (for press feedback)
export const scaleAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.fast
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    friction: 5,
    tension: 100,
  });
};

// Stagger animation for lists
export const staggeredFadeIn = (
  animatedValues: Animated.Value[],
  staggerDelay: number = 50
): Animated.CompositeAnimation => {
  return Animated.stagger(
    staggerDelay,
    animatedValues.map((value) => fadeIn(value))
  );
};

// Pulse animation (for attention)
export const createPulseAnimation = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 1000,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
    ])
  );
};

// Shimmer effect for loading states
export const createShimmerAnimation = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

// Breathe animation (for meditation/spiritual screens)
export const createBreatheAnimation = (
  animatedValue: Animated.Value,
  minScale: number = 1,
  maxScale: number = 1.1,
  duration: number = 4000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxScale,
        duration: duration / 2,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minScale,
        duration: duration / 2,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
    ])
  );
};

// Screen transition animations config
export const screenTransitionConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// Interpolation helpers
export const createFadeInterpolation = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
};

export const createSlideInterpolation = (
  animatedValue: Animated.Value,
  distance: number = 50
) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });
};

// Hook-like helper to create animated list items
export const createListItemAnimations = (itemCount: number): Animated.Value[] => {
  return Array.from({ length: itemCount }, () => new Animated.Value(0));
};

// Progress bar animation
export const animateProgress = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.slow
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.smooth,
    useNativeDriver: false, // width animations need this
  });
};
