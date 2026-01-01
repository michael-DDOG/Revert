// Skeleton Loader Component
// Smooth loading placeholder with shimmer effect

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Skeleton for cards
export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.cardSkeleton, style]}>
    <SkeletonLoader height={24} width="60%" style={{ marginBottom: 12 }} />
    <SkeletonLoader height={16} width="100%" style={{ marginBottom: 8 }} />
    <SkeletonLoader height={16} width="80%" />
  </View>
);

// Skeleton for list items
export const ListItemSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.listItemSkeleton, style]}>
    <SkeletonLoader width={48} height={48} borderRadius={24} />
    <View style={styles.listItemContent}>
      <SkeletonLoader height={18} width="70%" style={{ marginBottom: 8 }} />
      <SkeletonLoader height={14} width="50%" />
    </View>
  </View>
);

// Skeleton for prayer times
export const PrayerTimeSkeleton: React.FC = () => (
  <View style={styles.prayerSkeleton}>
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.prayerRow}>
        <SkeletonLoader width={80} height={20} />
        <SkeletonLoader width={60} height={20} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardElevated,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardSkeleton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  listItemContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  prayerSkeleton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
});

export default SkeletonLoader;
