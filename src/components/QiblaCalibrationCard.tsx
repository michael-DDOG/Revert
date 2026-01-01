import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { theme } from '../constants/theme';

interface QiblaCalibrationCardProps {
  isCalibrated: boolean;
  accuracy: 'low' | 'medium' | 'high';
  error: string | null;
  onStartCalibration?: () => void;
}

export const QiblaCalibrationCard: React.FC<QiblaCalibrationCardProps> = ({
  isCalibrated,
  accuracy,
  error,
  onStartCalibration,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [rotationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showModal) {
      // Start figure-8 animation hint
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => animation.stop();
    }
  }, [showModal, rotationAnim]);

  const getAccuracyColor = () => {
    switch (accuracy) {
      case 'high':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.error;
    }
  };

  const getAccuracyText = () => {
    switch (accuracy) {
      case 'high':
        return 'Excellent';
      case 'medium':
        return 'Good';
      case 'low':
        return 'Needs Calibration';
    }
  };

  const handleCalibrationPress = () => {
    setShowModal(true);
    onStartCalibration?.();
  };

  const rotateInterpolation = rotationAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '45deg', '0deg', '-45deg', '0deg'],
  });

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>!</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Compass Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getAccuracyColor() + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getAccuracyColor() }]} />
            <Text style={[styles.statusText, { color: getAccuracyColor() }]}>
              {getAccuracyText()}
            </Text>
          </View>
        </View>

        {!isCalibrated || accuracy === 'low' ? (
          <View style={styles.calibrationNeeded}>
            <Text style={styles.calibrationText}>
              Your compass needs calibration for accurate Qibla direction.
            </Text>
            <TouchableOpacity
              style={styles.calibrateButton}
              onPress={handleCalibrationPress}
            >
              <Text style={styles.calibrateButtonText}>Calibrate Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.calibrated}>
            <Text style={styles.calibratedIcon}>CHECK</Text>
            <Text style={styles.calibratedText}>
              Compass is calibrated and ready to use.
            </Text>
          </View>
        )}

        <View style={styles.accuracyMeter}>
          <Text style={styles.accuracyLabel}>Accuracy</Text>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: accuracy === 'high' ? '100%' : accuracy === 'medium' ? '66%' : '33%',
                  backgroundColor: getAccuracyColor(),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Calibration Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calibrate Your Compass</Text>

            <View style={styles.instructionContainer}>
              <Animated.View
                style={[
                  styles.phoneIcon,
                  { transform: [{ rotate: rotateInterpolation }] },
                ]}
              >
                <Text style={styles.phoneIconText}>PHONE</Text>
              </Animated.View>
              <Text style={styles.instructionText}>
                Move your phone in a figure-8 pattern several times
              </Text>
            </View>

            <View style={styles.steps}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  Hold your phone flat in front of you
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>
                  Move it in a figure-8 pattern 3-4 times
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  Stay away from metal objects and electronics
                </Text>
              </View>
            </View>

            <View style={styles.currentStatus}>
              <Text style={styles.currentStatusLabel}>Current Accuracy:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getAccuracyColor() + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getAccuracyColor() }]} />
                <Text style={[styles.statusText, { color: getAccuracyColor() }]}>
                  {getAccuracyText()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.doneButton,
                accuracy === 'high' && styles.doneButtonSuccess,
              ]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.doneButtonText}>
                {accuracy === 'high' ? 'Done!' : 'Close'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.tipText}>
              Tip: If calibration doesn't improve, try moving to a different location away from electronic devices.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },
  calibrationNeeded: {
    marginBottom: theme.spacing.md,
  },
  calibrationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  calibrateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  calibrateButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  calibrated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  calibratedIcon: {
    fontSize: 10,
    color: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  calibratedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
  },
  accuracyMeter: {
    marginTop: theme.spacing.sm,
  },
  accuracyLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  meterTrack: {
    height: 6,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 16,
    color: theme.colors.error,
    marginRight: theme.spacing.md,
    fontWeight: 'bold',
  },
  errorText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  phoneIcon: {
    width: 60,
    height: 100,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  phoneIconText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  instructionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  steps: {
    marginBottom: theme.spacing.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    marginRight: theme.spacing.sm,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 24,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  currentStatusLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  doneButton: {
    backgroundColor: theme.colors.cardElevated,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  doneButtonSuccess: {
    backgroundColor: theme.colors.success,
  },
  doneButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  tipText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QiblaCalibrationCard;
