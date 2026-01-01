import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useQibla } from '../hooks/useQibla';
import { useProgressStore } from '../store/useProgressStore';
import { 
  formatTo12Hour, 
  formatTimeRemaining, 
  hasPrayerPassed 
} from '../services/prayerTimesService';
import { 
  schedulePrayerNotifications, 
  requestNotificationPermissions,
  areNotificationsEnabled,
} from '../utils/notifications';
import { PrayerName } from '../types';

type TabType = 'times' | 'qibla';

export const PrayerScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('times');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    prayerTimes,
    nextPrayer,
    minutesUntilNext,
    isLoading,
    error,
    refresh,
    permissionStatus,
    requestPermission,
  } = usePrayerTimes();

  const {
    qiblaDirection,
    compassHeading,
    qiblaFromDevice,
    distanceToKaaba,
    isCalibrated,
    isAvailable,
    error: qiblaError,
    accuracy,
    startCompass,
    stopCompass,
  } = useQibla();

  const { todaysPrayers, logPrayer } = useProgressStore();

  // Animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Start/stop compass based on active tab
  useEffect(() => {
    if (activeTab === 'qibla') {
      startCompass();
    } else {
      stopCompass();
    }
    
    return () => stopCompass();
  }, [activeTab]);

  // Animate compass rotation
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: qiblaFromDevice,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [qiblaFromDevice]);

  // Check notification status
  useEffect(() => {
    const checkNotifications = async () => {
      const enabled = await areNotificationsEnabled();
      setNotificationsEnabled(enabled);
    };
    checkNotifications();
  }, []);

  // Schedule notifications when prayer times load
  useEffect(() => {
    if (prayerTimes?.times && notificationsEnabled) {
      schedulePrayerNotifications(prayerTimes.times);
    }
  }, [prayerTimes, notificationsEnabled]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermissions();
    setNotificationsEnabled(granted);
    
    if (granted && prayerTimes?.times) {
      schedulePrayerNotifications(prayerTimes.times);
      Alert.alert('Notifications Enabled', 'You will receive reminders before each prayer time.');
    } else if (!granted) {
      Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
    }
  };

  const handleLogPrayer = (prayer: PrayerName) => {
    if (todaysPrayers[prayer]) {
      Alert.alert('Already Logged', `You've already logged ${prayer} for today.`);
      return;
    }
    
    logPrayer(prayer);
    Alert.alert('Prayer Logged', `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} prayer logged. MashaAllah! 🤲`);
  };

  const renderTimesTab = () => {
    if (isLoading && !prayerTimes) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Getting prayer times...</Text>
        </View>
      );
    }

    if (error && !prayerTimes) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={styles.errorText}>{error}</Text>
          {permissionStatus === 'denied' && (
            <TouchableOpacity style={styles.retryButton} onPress={requestPermission}>
              <Text style={styles.retryButtonText}>Grant Location Access</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!prayerTimes) return null;

    const prayers = [
      { key: 'fajr' as PrayerName, name: 'Fajr', time: prayerTimes.times.fajr, icon: '🌅' },
      { key: 'dhuhr' as PrayerName, name: 'Dhuhr', time: prayerTimes.times.dhuhr, icon: '☀️' },
      { key: 'asr' as PrayerName, name: 'Asr', time: prayerTimes.times.asr, icon: '🌤️' },
      { key: 'maghrib' as PrayerName, name: 'Maghrib', time: prayerTimes.times.maghrib, icon: '🌅' },
      { key: 'isha' as PrayerName, name: 'Isha', time: prayerTimes.times.isha, icon: '🌙' },
    ];

    return (
      <View style={styles.timesContainer}>
        {/* Next Prayer Card */}
        {nextPrayer && (
          <View style={styles.nextPrayerCard}>
            <Text style={styles.nextPrayerLabel}>NEXT PRAYER</Text>
            <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
            <Text style={styles.nextPrayerTime}>
              {formatTo12Hour(nextPrayer.time)}
            </Text>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                {nextPrayer.isToday ? 'in ' : 'tomorrow in '}
                {formatTimeRemaining(minutesUntilNext)}
              </Text>
            </View>
          </View>
        )}

        {/* Location & Date */}
        <View style={styles.infoRow}>
          <Text style={styles.locationText}>📍 {prayerTimes.location}</Text>
          <Text style={styles.dateText}>
            {prayerTimes.hijriDate} {prayerTimes.hijriMonth} {prayerTimes.hijriYear}
          </Text>
        </View>

        {/* Prayer Times List */}
        <View style={styles.prayersList}>
          {prayers.map((prayer) => {
            const passed = hasPrayerPassed(prayer.time);
            const isNext = nextPrayer?.name === prayer.name && nextPrayer.isToday;
            const isLogged = todaysPrayers[prayer.key];

            return (
              <TouchableOpacity
                key={prayer.key}
                style={[
                  styles.prayerRow,
                  isNext && styles.prayerRowActive,
                  passed && !isNext && styles.prayerRowPassed,
                ]}
                onPress={() => handleLogPrayer(prayer.key)}
                activeOpacity={0.7}
              >
                <View style={styles.prayerInfo}>
                  <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                  <Text style={[
                    styles.prayerName,
                    passed && !isNext && styles.prayerNamePassed,
                  ]}>
                    {prayer.name}
                  </Text>
                </View>
                <View style={styles.prayerTimeContainer}>
                  <Text style={[
                    styles.prayerTime,
                    isNext && styles.prayerTimeActive,
                    passed && !isNext && styles.prayerTimePassed,
                  ]}>
                    {formatTo12Hour(prayer.time)}
                  </Text>
                  <View style={[
                    styles.logIndicator,
                    isLogged && styles.logIndicatorDone,
                  ]}>
                    {isLogged && <Text style={styles.logCheck}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications Toggle */}
        <TouchableOpacity 
          style={styles.notificationCard}
          onPress={handleEnableNotifications}
        >
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View>
              <Text style={styles.notificationTitle}>Prayer Reminders</Text>
              <Text style={styles.notificationStatus}>
                {notificationsEnabled ? 'Enabled - 10 min before each prayer' : 'Tap to enable'}
              </Text>
            </View>
          </View>
          <View style={[
            styles.notificationToggle,
            notificationsEnabled && styles.notificationToggleOn,
          ]}>
            <View style={[
              styles.notificationToggleKnob,
              notificationsEnabled && styles.notificationToggleKnobOn,
            ]} />
          </View>
        </TouchableOpacity>

        {/* Prayer Log Summary */}
        <View style={styles.logSummary}>
          <Text style={styles.logSummaryText}>
            {Object.values(todaysPrayers).filter(v => v === true).length}/5 prayers logged today
          </Text>
          <Text style={styles.logHint}>Tap any prayer to log it</Text>
        </View>
      </View>
    );
  };

  const renderQiblaTab = () => {
    if (qiblaError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🧭</Text>
          <Text style={styles.errorText}>{qiblaError}</Text>
        </View>
      );
    }

    const rotation = rotateAnim.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.qiblaContainer}>
        {/* Compass */}
        <View style={styles.compassContainer}>
          <View style={styles.compassOuter}>
            <Animated.View 
              style={[
                styles.compassInner,
                { transform: [{ rotate: rotation }] }
              ]}
            >
              {/* Compass markings */}
              <View style={styles.compassMarkings}>
                <Text style={[styles.compassDirection, styles.compassN]}>N</Text>
                <Text style={[styles.compassDirection, styles.compassE]}>E</Text>
                <Text style={[styles.compassDirection, styles.compassS]}>S</Text>
                <Text style={[styles.compassDirection, styles.compassW]}>W</Text>
              </View>
              
              {/* Qibla arrow */}
              <View style={styles.qiblaArrow}>
                <View style={styles.arrowHead} />
                <View style={styles.arrowBody} />
              </View>
              
              {/* Kaaba icon at center */}
              <View style={styles.kaabaIcon}>
                <Text style={styles.kaabaText}>🕋</Text>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Qibla Info */}
        <View style={styles.qiblaInfo}>
          <Text style={styles.qiblaTitle}>Qibla Direction</Text>
          <Text style={styles.qiblaDegrees}>
            {Math.round(qiblaDirection)}° from North
          </Text>
          <Text style={styles.distanceText}>
            {distanceToKaaba.toLocaleString()} km to Makkah
          </Text>
        </View>

        {/* Calibration Status */}
        <View style={styles.calibrationCard}>
          <View style={[
            styles.calibrationDot,
            accuracy === 'high' && styles.calibrationGood,
            accuracy === 'medium' && styles.calibrationMedium,
            accuracy === 'low' && styles.calibrationLow,
          ]} />
          <View>
            <Text style={styles.calibrationTitle}>
              Compass {isCalibrated ? 'Calibrated' : 'Calibrating...'}
            </Text>
            <Text style={styles.calibrationHint}>
              {accuracy === 'low' 
                ? 'Move your phone in a figure-8 pattern'
                : accuracy === 'medium'
                ? 'Accuracy: Medium'
                : 'Accuracy: High'
              }
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Use</Text>
          <Text style={styles.instructionsText}>
            1. Hold your phone flat{'\n'}
            2. Turn your body until the arrow points up{'\n'}
            3. You are now facing the Kaaba
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'times' && styles.tabActive]}
          onPress={() => setActiveTab('times')}
        >
          <Text style={[styles.tabText, activeTab === 'times' && styles.tabTextActive]}>
            Prayer Times
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'qibla' && styles.tabActive]}
          onPress={() => setActiveTab('qibla')}
        >
          <Text style={[styles.tabText, activeTab === 'qibla' && styles.tabTextActive]}>
            Qibla
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          activeTab === 'times' ? (
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        {activeTab === 'times' ? renderTimesTab() : renderQiblaTab()}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  timesContainer: {
    flex: 1,
  },
  nextPrayerCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  nextPrayerLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  nextPrayerName: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  nextPrayerTime: {
    fontSize: theme.fontSize.xl,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: theme.spacing.sm,
  },
  countdownContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  countdownText: {
    fontSize: theme.fontSize.sm,
    color: '#fff',
    fontWeight: theme.fontWeight.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  locationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
  prayersList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  prayerRowActive: {
    backgroundColor: theme.colors.primaryMuted,
  },
  prayerRowPassed: {
    opacity: 0.5,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  prayerName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  prayerNamePassed: {
    color: theme.colors.textMuted,
  },
  prayerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerTime: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  prayerTimeActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  prayerTimePassed: {
    color: theme.colors.textMuted,
  },
  logIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logIndicatorDone: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  logCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
  notificationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  notificationTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  notificationStatus: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  notificationToggle: {
    width: 50,
    height: 28,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: 14,
    padding: 2,
  },
  notificationToggleOn: {
    backgroundColor: theme.colors.primary,
  },
  notificationToggleKnob: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  notificationToggleKnobOn: {
    alignSelf: 'flex-end',
  },
  logSummary: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  logSummaryText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  logHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  qiblaContainer: {
    flex: 1,
    alignItems: 'center',
  },
  compassContainer: {
    marginVertical: theme.spacing.xl,
  },
  compassOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: theme.colors.border,
  },
  compassInner: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassMarkings: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  compassDirection: {
    position: 'absolute',
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  compassN: {
    top: 10,
    left: '50%',
    marginLeft: -8,
    color: theme.colors.primary,
  },
  compassE: {
    right: 10,
    top: '50%',
    marginTop: -10,
  },
  compassS: {
    bottom: 10,
    left: '50%',
    marginLeft: -6,
  },
  compassW: {
    left: 10,
    top: '50%',
    marginTop: -10,
  },
  qiblaArrow: {
    position: 'absolute',
    alignItems: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.primary,
    marginBottom: -5,
  },
  arrowBody: {
    width: 8,
    height: 80,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  kaabaIcon: {
    position: 'absolute',
  },
  kaabaText: {
    fontSize: 32,
  },
  qiblaInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  qiblaTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  qiblaDegrees: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  distanceText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  calibrationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  calibrationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
  },
  calibrationGood: {
    backgroundColor: theme.colors.success,
  },
  calibrationMedium: {
    backgroundColor: theme.colors.warning,
  },
  calibrationLow: {
    backgroundColor: theme.colors.error,
  },
  calibrationTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  calibrationHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  instructionsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  instructionsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});

export default PrayerScreen;
