import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { theme } from '../constants/theme';

const APP_VERSION = '1.0.0';

const PRIVACY_POLICY = `Privacy Policy for The Revert

Last Updated: December 2024

1. Information We Collect
- Location data (for prayer times and Qibla direction)
- Usage data (app interactions, progress)
- Account information (if you create an account)

2. How We Use Your Information
- Provide accurate prayer times based on your location
- Track your learning progress
- Improve app functionality

3. Data Storage
- Your data is stored securely using industry-standard encryption
- We do not sell your personal information to third parties

4. Your Rights
- You can request deletion of your data at any time
- You can opt out of location services (prayer times will use manual location)

5. Contact
For privacy concerns, contact: privacy@therevert.app`;

const TERMS_OF_SERVICE = `Terms of Service for The Revert

Last Updated: December 2024

1. Acceptance of Terms
By using The Revert app, you agree to these terms.

2. Use of Service
- The app is for educational purposes about Islam
- Content is for guidance and should be verified with qualified scholars
- Prayer times are calculated estimates and may vary from local mosque times

3. User Conduct
- Use the app respectfully
- Do not attempt to reverse engineer or modify the app
- Do not use the app for any unlawful purpose

4. Intellectual Property
All content, including journey lessons, is protected by copyright.

5. Disclaimer
This app is a learning aid and not a substitute for consulting with qualified Islamic scholars.

6. Limitation of Liability
We are not liable for any damages arising from use of this app.

7. Changes to Terms
We may update these terms. Continued use constitutes acceptance.

8. Contact
For questions: support@therevert.app`;

export const AboutScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const showLegalDocument = (type: 'privacy' | 'terms') => {
    setModalContent({
      title: type === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
      content: type === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE,
    });
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* App Info */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>C</Text>
        </View>
        <Text style={styles.appName}>The Revert</Text>
        <Text style={styles.tagline}>Your 365-Day Journey to Islam</Text>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            The Revert is a companion app designed specifically for new Muslims (reverts) on their journey to understanding and practicing Islam.
          </Text>
          <Text style={styles.cardText}>
            Through a structured 365-day program, daily guidance, prayer tracking, and educational resources, we aim to support you every step of the way.
          </Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.card}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭐</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>365-Day Journey</Text>
              <Text style={styles.featureDescription}>
                Structured daily content from basics to advanced topics
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🕐</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Prayer Times</Text>
              <Text style={styles.featureDescription}>
                Accurate prayer times based on your location
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🧭</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Qibla Direction</Text>
              <Text style={styles.featureDescription}>
                Find the direction to Makkah for prayer
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📖</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Learn</Text>
              <Text style={styles.featureDescription}>
                Duas, Names of Allah, prayer guides, and more
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏆</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>
                Track your journey with XP, levels, and badges
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Credits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credits & Data Sources</Text>
        <View style={styles.card}>
          <Text style={styles.creditItem}>
            Prayer Times: Aladhan API (aladhan.com)
          </Text>
          <Text style={styles.creditItem}>
            Quran Audio: EveryAyah.com
          </Text>
          <Text style={styles.creditItem}>
            Islamic Content: Verified Islamic sources
          </Text>
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => showLegalDocument('privacy')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkButtonText}>Privacy Policy</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => showLegalDocument('terms')}
          activeOpacity={0.7}
        >
          <Text style={styles.linkButtonText}>Terms of Service</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Disclaimer */}
      <View style={styles.section}>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This app is intended as a learning aid and is not a substitute for consulting with qualified Islamic scholars. Prayer times are calculated based on your location and may vary slightly from local mosque times. Always verify important religious matters with knowledgeable sources.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with love for the Muslim ummah
        </Text>
        <Text style={styles.footerArabic}>
          Bismillah
        </Text>
      </View>

      <View style={styles.bottomPadding} />

      {/* Legal Document Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalContent.title}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{modalContent.content}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    fontSize: 36,
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  appName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  version: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
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
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  cardText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  creditItem: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  linkButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  linkButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  linkArrow: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  disclaimerTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  footerArabic: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
  },
  bottomPadding: {
    height: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  modalScroll: {
    padding: theme.spacing.lg,
  },
  modalText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});

export default AboutScreen;
