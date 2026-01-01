import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../constants/theme';

interface PrayerStep {
  id: number;
  name: string;
  nameArabic: string;
  description: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  notes?: string;
  icon: string;
}

const prayerSteps: PrayerStep[] = [
  {
    id: 1,
    name: 'Standing (Qiyam)',
    nameArabic: 'القيام',
    description: 'Stand facing the Qibla (direction of Mecca). Make intention in your heart for the specific prayer.',
    icon: '🧍',
    notes: 'Your feet should be shoulder-width apart. Focus your gaze on the place of prostration.',
  },
  {
    id: 2,
    name: 'Opening Takbir',
    nameArabic: 'تكبيرة الإحرام',
    description: 'Raise both hands to ear level (or shoulder level) and say:',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    icon: '🙌',
    notes: 'This marks the beginning of your prayer. Place right hand over left on your chest after.',
  },
  {
    id: 3,
    name: 'Opening Supplication',
    nameArabic: 'دعاء الاستفتاح',
    description: 'Recite the opening supplication (optional but recommended):',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
    transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakas-muka, wa ta'ala jadduka, wa la ilaha ghayruka",
    translation: 'Glory be to You, O Allah, and praise. Blessed is Your Name and exalted is Your Majesty. There is no god but You.',
    icon: '🤲',
  },
  {
    id: 4,
    name: 'Seeking Refuge',
    nameArabic: 'التعوذ',
    description: 'Seek refuge from Satan:',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "A'udhu billahi min ash-shaytanir-rajim",
    translation: 'I seek refuge in Allah from the accursed Satan.',
    icon: '🛡️',
  },
  {
    id: 5,
    name: 'Bismillah',
    nameArabic: 'البسملة',
    description: 'Say:',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillahir-Rahmanir-Raheem',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    icon: '📖',
  },
  {
    id: 6,
    name: 'Surah Al-Fatiha',
    nameArabic: 'سورة الفاتحة',
    description: 'Recite Surah Al-Fatiha (required in every rakah):',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: "Al-hamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim, ghayril-maghdubi 'alayhim wa lad-dallin.",
    translation: 'All praise is due to Allah, Lord of the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
    icon: '📜',
    notes: 'After Fatiha, say "Ameen" (O Allah, accept). In the first two rakahs, recite another short surah after Fatiha.',
  },
  {
    id: 7,
    name: 'Bowing (Ruku)',
    nameArabic: 'الركوع',
    description: 'Say "Allahu Akbar" and bow with back straight, hands on knees:',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: "Subhana Rabbiyal-'Azim",
    translation: 'Glory be to my Lord, the Most Great.',
    icon: '🙇',
    notes: 'Say this 3 times. Keep your back straight and parallel to the ground.',
  },
  {
    id: 8,
    name: 'Rising from Ruku',
    nameArabic: 'الرفع من الركوع',
    description: 'Stand up straight while saying:',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
    transliteration: "Sami'a Allahu liman hamidah",
    translation: 'Allah hears those who praise Him.',
    icon: '🧍',
    notes: 'When fully upright, say: "Rabbana wa lakal-hamd" (Our Lord, to You belongs all praise).',
  },
  {
    id: 9,
    name: 'Prostration (Sujud)',
    nameArabic: 'السجود',
    description: 'Say "Allahu Akbar" and prostrate with 7 body parts touching ground:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhana Rabbiyal-A'la",
    translation: 'Glory be to my Lord, the Most High.',
    icon: '🧎',
    notes: 'The 7 parts: forehead with nose, both palms, both knees, and toes of both feet. Say this 3 times.',
  },
  {
    id: 10,
    name: 'Sitting between Prostrations',
    nameArabic: 'الجلوس بين السجدتين',
    description: 'Sit upright and say:',
    arabic: 'رَبِّ اغْفِرْ لِي',
    transliteration: 'Rabbighfir li',
    translation: 'My Lord, forgive me.',
    icon: '🧘',
    notes: 'Sit on your left foot with right foot upright. Then make the second prostration.',
  },
  {
    id: 11,
    name: 'Second Prostration',
    nameArabic: 'السجدة الثانية',
    description: 'Repeat the prostration with the same words:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhana Rabbiyal-A'la",
    translation: 'Glory be to my Lord, the Most High.',
    icon: '🧎',
    notes: 'This completes one rakah. Stand up for the next rakah saying "Allahu Akbar".',
  },
  {
    id: 12,
    name: 'Tashahhud (Sitting)',
    nameArabic: 'التشهد',
    description: 'After 2 rakahs (and at the end), sit and recite:',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallah wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
    translation: 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.',
    icon: '🪑',
  },
  {
    id: 13,
    name: 'Salawat upon the Prophet',
    nameArabic: 'الصلاة على النبي',
    description: 'In the final sitting, add:',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid.",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
    icon: '🌙',
  },
  {
    id: 14,
    name: 'Tasleem (Closing)',
    nameArabic: 'التسليم',
    description: 'Turn your head to the right, then left, saying each time:',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-salamu alaykum wa rahmatullah',
    translation: 'Peace be upon you and the mercy of Allah.',
    icon: '✨',
    notes: 'This completes your prayer. You may now make personal dua.',
  },
];

interface RakahInfo {
  prayer: string;
  rakahs: number;
  fard: number;
  sunnah?: string;
}

const rakahsInfo: RakahInfo[] = [
  { prayer: 'Fajr', rakahs: 2, fard: 2, sunnah: '2 before' },
  { prayer: 'Dhuhr', rakahs: 4, fard: 4, sunnah: '4 before, 2 after' },
  { prayer: 'Asr', rakahs: 4, fard: 4, sunnah: '4 before (optional)' },
  { prayer: 'Maghrib', rakahs: 3, fard: 3, sunnah: '2 after' },
  { prayer: 'Isha', rakahs: 4, fard: 4, sunnah: '4 before, 2 after, 3 Witr' },
];

export const PrayerGuideScreen: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>How to Pray Salah</Text>
        <Text style={styles.headerSubtitle}>
          Step-by-step guide to the five daily prayers
        </Text>
      </View>

      {/* Rakahs Info */}
      <View style={styles.rakahsCard}>
        <Text style={styles.rakahsTitle}>Number of Rakahs</Text>
        <View style={styles.rakahsGrid}>
          {rakahsInfo.map((info) => (
            <View key={info.prayer} style={styles.rakahItem}>
              <Text style={styles.rakahPrayer}>{info.prayer}</Text>
              <Text style={styles.rakahCount}>{info.fard}</Text>
              <Text style={styles.rakahLabel}>Fard</Text>
              {info.sunnah && (
                <Text style={styles.rakahSunnah}>{info.sunnah}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Prerequisites */}
      <View style={styles.prerequisitesCard}>
        <Text style={styles.prerequisitesTitle}>Before You Pray</Text>
        <View style={styles.prerequisiteItem}>
          <Text style={styles.prerequisiteIcon}>💧</Text>
          <Text style={styles.prerequisiteText}>Perform Wudu (ablution)</Text>
        </View>
        <View style={styles.prerequisiteItem}>
          <Text style={styles.prerequisiteIcon}>🧭</Text>
          <Text style={styles.prerequisiteText}>Face the Qibla (toward Mecca)</Text>
        </View>
        <View style={styles.prerequisiteItem}>
          <Text style={styles.prerequisiteIcon}>👕</Text>
          <Text style={styles.prerequisiteText}>Ensure proper coverage (awrah)</Text>
        </View>
        <View style={styles.prerequisiteItem}>
          <Text style={styles.prerequisiteIcon}>🕐</Text>
          <Text style={styles.prerequisiteText}>Pray within the designated time</Text>
        </View>
        <View style={styles.prerequisiteItem}>
          <Text style={styles.prerequisiteIcon}>🧹</Text>
          <Text style={styles.prerequisiteText}>Pray in a clean place</Text>
        </View>
      </View>

      {/* Prayer Steps */}
      <Text style={styles.sectionTitle}>Prayer Steps</Text>

      {prayerSteps.map((step) => (
        <TouchableOpacity
          key={step.id}
          style={styles.stepCard}
          onPress={() => toggleStep(step.id)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{step.id}</Text>
            </View>
            <View style={styles.stepTitleContainer}>
              <Text style={styles.stepName}>{step.name}</Text>
              <Text style={styles.stepNameArabic}>{step.nameArabic}</Text>
            </View>
            <Text style={styles.stepIcon}>{step.icon}</Text>
          </View>

          {expandedStep === step.id && (
            <View style={styles.stepContent}>
              <Text style={styles.stepDescription}>{step.description}</Text>

              {step.arabic && (
                <View style={styles.arabicBox}>
                  <Text style={styles.stepArabic}>{step.arabic}</Text>
                </View>
              )}

              {step.transliteration && (
                <Text style={styles.stepTransliteration}>
                  {step.transliteration}
                </Text>
              )}

              {step.translation && (
                <Text style={styles.stepTranslation}>
                  "{step.translation}"
                </Text>
              )}

              {step.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Note</Text>
                  <Text style={styles.notesText}>{step.notes}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}

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
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  rakahsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  rakahsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  rakahsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rakahItem: {
    alignItems: 'center',
    flex: 1,
  },
  rakahPrayer: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  rakahCount: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  rakahLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  rakahSunnah: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  prerequisitesCard: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  prerequisitesTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  prerequisiteIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    width: 24,
  },
  prerequisiteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  stepCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  stepNameArabic: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  stepIcon: {
    fontSize: 24,
  },
  stepContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stepDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  arabicBox: {
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  stepArabic: {
    fontSize: 22,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  stepTransliteration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepTranslation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  notesBox: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  notesLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

export default PrayerGuideScreen;
