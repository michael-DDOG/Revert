// Fade In View Component
// Smooth fade-in animation wrapper for any content

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { ANIMATION_DURATION, EASING } from '../utils/animations';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  slideFrom?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  slideDistance?: number;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  style,
  duration = ANIMATION_DURATION.normal,
  delay = 0,
  slideFrom = 'none',
  slideDistance = 20,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(getInitialSlideValue())).current;

  function getInitialSlideValue() {
    switch (slideFrom) {
      case 'bottom':
        return slideDistance;
      case 'top':
        return -slideDistance;
      case 'left':
        return -slideDistance;
      case 'right':
        return slideDistance;
      default:
        return 0;
    }
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        easing: EASING.decelerate,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTransformStyle = () => {
    if (slideFrom === 'none') return [];
    if (slideFrom === 'bottom' || slideFrom === 'top') {
      return [{ translateY: slideAnim }];
    }
    return [{ translateX: slideAnim }];
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: getTransformStyle(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Staggered list wrapper
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  style?: StyleProp<ViewStyle>;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 50,
  style,
}) => {
  return (
    <Animated.View style={style}>
      {React.Children.map(children, (child, index) => (
        <FadeInView
          delay={index * staggerDelay}
          slideFrom="bottom"
          slideDistance={15}
        >
          {child}
        </FadeInView>
      ))}
    </Animated.View>
  );
};

export default FadeInView;
