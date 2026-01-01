// Animated Touchable Component
// Smooth press animations for touchable elements

import React, { useRef } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface AnimatedTouchableProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleValue?: number;
  activeOpacity?: number;
}

export const AnimatedTouchable: React.FC<AnimatedTouchableProps> = ({
  onPress,
  children,
  style,
  disabled = false,
  scaleValue = 0.97,
  activeOpacity = 0.9,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: scaleValue,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: activeOpacity,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : opacityAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Card variant with elevation effect
export const AnimatedCard: React.FC<AnimatedTouchableProps> = (props) => {
  return <AnimatedTouchable {...props} scaleValue={0.98} activeOpacity={0.95} />;
};

// Button variant with more pronounced feedback
export const AnimatedButton: React.FC<AnimatedTouchableProps> = (props) => {
  return <AnimatedTouchable {...props} scaleValue={0.95} activeOpacity={0.85} />;
};

export default AnimatedTouchable;
