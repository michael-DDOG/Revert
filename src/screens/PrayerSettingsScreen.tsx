import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { useSettingsStore } from '../store/useSettingsStore';
import { CALCULATION_METHODS } from '../services/prayerTimesService';

export const PrayerSettingsScreen: React.FC = () => {
  const { prayer, display, savedLocation, updatePrayerSettings, updateDisplaySettings } = useSettingsStore();
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  const handleMethodSelect = (methodId: number) => {
    updatePrayerSettings({ calculationMethod: methodId });
    setShowMethodPicker(false);
  };

  const handleAsrToggle = () => {
    updatePrayerSettings({
      asrCalculation: prayer.asrCalculation === 'standard' ? 'hanafi' : 'standard',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>

        <View style={styles.locationCard}>
          {savedLocation ? (
            <>
              <Text style={styles.locationText}>
                {savedLocation.city && savedLocation.country
                  ? `${savedLocation.city}, ${savedLocation.country}`
                  : `${savedLocation.latitude.toFixed(4)}, ${savedLocation.longitude.toFixed(4)}`}
              </Text>
              <Text style={styles.locationHint}>
                Location is automatically detected
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.locationText}>Location not set</Text>
              <Text style={styles.locationHint}>
                Open the Prayer screen to detect your location
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Calculation Method Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calculation Method</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowMethodPicker(!showMethodPicker)}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Prayer Time Calculation</Text>
            <Text style={styles.settingDescription}>
              {CALCULATION_METHODS[prayer.calculationMethod as keyof typeof CALCULATION_METHODS]}
            </Text>
          </View>
          <Text style={styles.settingArrow}>{showMethodPicker ? '^' : 'v'}</Text>
        </TouchableOpacity>

        {showMethodPicker && (
          <View style={styles.methodsContainer}>
            {Object.entries(CALCULATION_METHODS).map(([id, name]) => (
              <TouchableOpacity
                key={id}
                style={[
                  styles.methodOption,
                  prayer.calculationMethod === Number(id) && styles.methodOptionActive,
                ]}
                onPress={() => handleMethodSelect(Number(id))}
              >
                <Text
                  style={[
                    styles.methodOptionText,
                    prayer.calculationMethod === Number(id) && styles.methodOptionTextActive,
                  ]}
                >
                  {name}
                </Text>
                {prayer.calculationMethod === Number(id) && (
                  <Text style={styles.checkmark}>check</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.settingRow} onPress={handleAsrToggle}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Asr Calculation</Text>
            <Text style={styles.settingDescription}>
              {prayer.asrCalculation === 'standard' ? 'Standard (Shafi\'i, Maliki, Hanbali)' : 'Hanafi'}
            </Text>
          </View>
          <Text style={styles.settingValue}>
            {prayer.asrCalculation === 'standard' ? 'Standard' : 'Hanafi'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Display Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>12-Hour Format</Text>
            <Text style={styles.settingDescription}>
              Show times as 5:30 PM instead of 17:30
            </Text>
          </View>
          <Switch
            value={prayer.use12HourFormat}
            onValueChange={(value) => updatePrayerSettings({ use12HourFormat: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Show Sunrise</Text>
            <Text style={styles.settingDescription}>
              Display sunrise time alongside prayers
            </Text>
          </View>
          <Switch
            value={prayer.showSunrise}
            onValueChange={(value) => updatePrayerSettings({ showSunrise: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Show Hijri Date</Text>
            <Text style={styles.settingDescription}>
              Display Islamic calendar date
            </Text>
          </View>
          <Switch
            value={display.showHijriDate}
            onValueChange={(value) => updateDisplaySettings({ showHijriDate: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Calculation Methods</Text>
        <Text style={styles.infoText}>
          Different Islamic organizations use slightly different methods to calculate prayer times. The main differences are in Fajr and Isha times.
        </Text>
        <Text style={styles.infoText}>
          If you're unsure which method to use, check with your local mosque or Islamic center, or use ISNA (Islamic Society of North America) for North America.
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  locationText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  settingRow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  settingArrow: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  settingValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  methodsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  methodOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodOptionActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  methodOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  methodOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  checkmark: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
  infoSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  bottomPadding: {
    height: 40,
  },
});

export default PrayerSettingsScreen;
