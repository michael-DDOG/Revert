// Onboarding Types - Real data structures for user journey

export type SpiritualBackground = 
  | 'christianity'
  | 'judaism'
  | 'hinduism_buddhism'
  | 'other_religion'
  | 'atheist_agnostic'
  | 'spiritual_not_religious'
  | 'prefer_not_say';

export type ShahadaTiming =
  | 'exploring'
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'over_month'
  | 'over_year';

export type KnowledgeLevel =
  | 'complete_beginner'
  | 'know_basics'
  | 'can_pray'
  | 'comfortable';

export type BiggestChallenge =
  | 'learning_prayer'
  | 'arabic'
  | 'family_support'
  | 'finding_community'
  | 'changing_habits'
  | 'feeling_alone'
  | 'judgment_worry'
  | 'information_overload';

export type DailyCommitment =
  | 'quick'      // 5-10 minutes
  | 'steady'     // 15-20 minutes
  | 'deep';      // 30+ minutes

export type AttractionToIslam =
  | 'tawhid'
  | 'quran'
  | 'muslim_connection'
  | 'seeking_truth'
  | 'peace_spirituality'
  | 'community'
  | 'other';

export type JourneyGoal =
  | 'pray_confidently'
  | 'understand_beliefs'
  | 'learn_arabic'
  | 'feel_connected'
  | 'build_friendships'
  | 'tell_family'
  | 'feel_peace';

export interface NotificationPreferences {
  prayerTimes: boolean;
  dailyLesson: boolean;
  streakProtection: boolean;
  weeklyReflection: boolean;
  islamicEvents: boolean;
}

export interface OnboardingData {
  name: string;
  shahadaDate: string | null;
  shahadaTiming: ShahadaTiming;
  spiritualBackground: SpiritualBackground;
  attractionsToIslam: AttractionToIslam[];
  knowledgeLevel: KnowledgeLevel;
  biggestChallenge: BiggestChallenge;
  journeyGoals: JourneyGoal[];
  dailyCommitment: DailyCommitment;
  notifications: NotificationPreferences;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
}

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  name: '',
  shahadaDate: null,
  shahadaTiming: 'today',
  spiritualBackground: 'prefer_not_say',
  attractionsToIslam: [],
  knowledgeLevel: 'complete_beginner',
  biggestChallenge: 'learning_prayer',
  journeyGoals: [],
  dailyCommitment: 'steady',
  notifications: {
    prayerTimes: true,
    dailyLesson: true,
    streakProtection: true,
    weeklyReflection: true,
    islamicEvents: true,
  },
  onboardingCompleted: false,
  onboardingCompletedAt: null,
};

// Display labels for UI
export const SPIRITUAL_BACKGROUND_LABELS: Record<SpiritualBackground, string> = {
  christianity: 'Christianity (Catholic, Protestant, Orthodox)',
  judaism: 'Judaism',
  hinduism_buddhism: 'Hinduism / Buddhism / Sikhism',
  other_religion: 'Other religion',
  atheist_agnostic: 'Atheist / Agnostic',
  spiritual_not_religious: 'Spiritual but not religious',
  prefer_not_say: 'Prefer not to say',
};

export const SHAHADA_TIMING_LABELS: Record<ShahadaTiming, string> = {
  exploring: "I haven't yet (I'm exploring)",
  today: 'Today',
  this_week: 'Within the last week',
  this_month: 'Within the last month',
  over_month: 'More than a month ago',
  over_year: 'More than a year ago',
};

export const KNOWLEDGE_LEVEL_LABELS: Record<KnowledgeLevel, string> = {
  complete_beginner: 'Complete beginner - I know almost nothing',
  know_basics: 'Know the basics - 5 Pillars, general concepts',
  can_pray: 'Can pray - but still learning',
  comfortable: 'Comfortable - looking to deepen my knowledge',
};

export const CHALLENGE_LABELS: Record<BiggestChallenge, string> = {
  learning_prayer: 'Learning to pray (it seems complicated)',
  arabic: 'Reading/understanding Arabic',
  family_support: "Family doesn't understand/support me",
  finding_community: 'Finding Muslim community',
  changing_habits: 'Changing habits (diet, lifestyle)',
  feeling_alone: 'Feeling alone in this journey',
  judgment_worry: 'Worried about judgment from others',
  information_overload: 'Information overload - too much to learn',
};

export const ATTRACTION_LABELS: Record<AttractionToIslam, string> = {
  tawhid: 'The concept of One God (Tawhid)',
  quran: "The Quran's message",
  muslim_connection: 'A Muslim friend, family, or spouse',
  seeking_truth: 'Research and seeking truth',
  peace_spirituality: 'Peace and spirituality',
  community: 'Community and brotherhood/sisterhood',
  other: 'Other',
};

export const GOAL_LABELS: Record<JourneyGoal, string> = {
  pray_confidently: 'Pray 5 times daily with confidence',
  understand_beliefs: 'Understand basic Islamic beliefs',
  learn_arabic: 'Learn essential Arabic phrases',
  feel_connected: 'Feel connected to Allah',
  build_friendships: 'Build Muslim friendships',
  tell_family: 'Tell my family about my conversion',
  feel_peace: 'Feel at peace with my decision',
};

export const COMMITMENT_LABELS: Record<DailyCommitment, { label: string; description: string }> = {
  quick: { label: '5-10 minutes', description: 'Quick learner' },
  steady: { label: '15-20 minutes', description: 'Steady pace' },
  deep: { label: '30+ minutes', description: 'Deep dive' },
};
