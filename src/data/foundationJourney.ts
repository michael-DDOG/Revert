// Foundation Track - Days 1-30: Your First Month
// Real, meaningful content for new Muslims

import { Day } from '../types';

export const foundationJourney: Day[] = [
  {
    id: 1,
    title: 'Day 1: Your New Beginning',
    description: 'The Shahada - your declaration of faith.',
    guidance: `Today marks the beginning of your journey. The Shahada (testimony of faith) is the foundation of Islam: "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasul Allah" - "I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah."

By saying these words with sincere belief, you have entered Islam. Your past sins are forgiven - you are like a newborn, pure and clean. This is a gift from Allah.

Don't worry about everything you don't know yet. Islam is learned gradually, with patience and compassion for yourself.`,
    reflection: 'How do you feel right now? What hopes do you have for this journey?',
    resources: [
      {
        type: 'website',
        title: 'New Muslim Academy',
        url: 'https://newmuslimacademy.org/',
        description: 'Free courses designed specifically for new Muslims',
      },
      {
        type: 'website',
        title: 'SeekersGuidance',
        url: 'https://seekersguidance.org/articles/featured-articles/new-muslims/',
        description: 'Resources and guidance for new Muslims',
      },
    ],
  },
  {
    id: 2,
    title: 'Day 2: Understanding Tawhid',
    description: 'The oneness of Allah - the heart of Islam.',
    guidance: `Tawhid is the belief in the absolute oneness of Allah. This is what makes Islam unique and is its most fundamental teaching.

Allah is One - with no partners, no children, no equals. He is the Creator of everything, the All-Knowing, the Most Merciful. He is not like anything in creation, yet He is closer to you than your jugular vein.

Unlike other faiths you may have known, there is no intermediary between you and Allah. You speak directly to Him in prayer, and He hears you always.`,
    reflection: 'How does the concept of One God change how you see the world?',
  },
  {
    id: 3,
    title: 'Day 3: The Five Pillars Overview',
    description: 'The framework of Muslim life.',
    guidance: `Islam is built upon five pillars that structure a Muslim's life:

1. Shahada - The declaration of faith (which you've taken)
2. Salah - Five daily prayers
3. Zakat - Annual charity (2.5% of savings)
4. Sawm - Fasting during Ramadan
5. Hajj - Pilgrimage to Mecca once in lifetime if able

Don't feel overwhelmed. These are introduced gradually. Right now, focus on the first two: strengthening your faith and learning to pray. The others will come naturally in time.`,
    reflection: 'Which pillar seems most meaningful to you right now?',
  },
  {
    id: 4,
    title: 'Day 4: Introduction to Prayer',
    description: 'Why Muslims pray five times daily.',
    guidance: `Prayer (Salah) is the direct connection between you and Allah. Muslims pray five times daily:

• Fajr - Before sunrise
• Dhuhr - Midday
• Asr - Afternoon  
• Maghrib - Just after sunset
• Isha - Night

These prayers are like spiritual anchors throughout your day. They remind you of your purpose, cleanse your heart, and keep you connected to Allah.

Don't worry about perfection yet. We'll learn the physical movements and words step by step. For now, just know that Allah is waiting to hear from you.`,
    reflection: 'How might regular prayer change your daily routine?',
  },
  {
    id: 5,
    title: 'Day 5: Learning Wudu',
    description: 'Purification before prayer.',
    guidance: `Before praying, Muslims perform Wudu (ablution) - a ritual washing that purifies the body and prepares the mind.

The steps of Wudu:
1. Make intention in your heart
2. Say "Bismillah" (In the name of Allah)
3. Wash hands three times
4. Rinse mouth three times
5. Rinse nose three times
6. Wash face three times
7. Wash arms to elbows three times (right first)
8. Wipe head once
9. Wipe ears once
10. Wash feet to ankles three times (right first)

Wudu remains valid until it's broken by using the bathroom, passing gas, bleeding, or sleeping deeply.`,
    reflection: 'How does physical cleanliness prepare you mentally for worship?',
  },
  {
    id: 6,
    title: 'Day 6: The Prayer Positions',
    description: 'Standing, bowing, and prostrating to Allah.',
    guidance: `Prayer has specific positions, each with meaning:

• Qiyam (Standing): Standing before Allah in humility
• Ruku (Bowing): Acknowledging Allah's greatness
• Sujud (Prostration): The closest position to Allah - your forehead touches the ground in complete submission
• Sitting: Peaceful reflection and supplication

These positions are the same worldwide - a Muslim in Tokyo prays exactly as one in Toronto. This unity across the ummah (community) is beautiful.

Tomorrow we'll learn the words recited in each position.`,
    reflection: 'Which position feels most meaningful to you?',
  },
  {
    id: 7,
    title: 'Day 7: One Week Complete!',
    description: 'Celebrating your first milestone.',
    guidance: `Alhamdulillah (Praise be to Allah)! You've completed one week.

This is significant. The Prophet Muhammad ﷺ said: "The most beloved of deeds to Allah are those that are most consistent, even if they are small."

Take a moment to appreciate your progress:
✓ You've taken your Shahada
✓ You understand Tawhid (Oneness of Allah)
✓ You know the Five Pillars
✓ You've learned about prayer
✓ You know how to make Wudu
✓ You know the prayer positions

You're building the foundation. Keep going.`,
    reflection: 'What has surprised you most about this first week?',
  },
  {
    id: 8,
    title: 'Day 8: Al-Fatiha Introduction',
    description: 'The opening chapter of the Quran.',
    guidance: `Al-Fatiha ("The Opening") is the first chapter of the Quran and is recited in every prayer. It's called "The Mother of the Book" because it summarizes all Islamic teachings.

بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
Bismillah ir-Rahman ir-Rahim
"In the name of Allah, the Most Gracious, the Most Merciful"

This verse begins almost every chapter of the Quran and should begin every action in your life.

Don't worry about memorizing in Arabic immediately. Understanding the meaning is equally important.`,
    reflection: 'What does it mean to begin everything "in the name of Allah"?',
    audio: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatiha',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        description: 'Listen to Al-Fatiha recited by Mishary Alafasy',
      },
    ],
    resources: [
      {
        type: 'website',
        title: 'Quran.com - Al-Fatiha',
        url: 'https://quran.com/1',
        description: 'Read Al-Fatiha with multiple translations and tafsir',
      },
      {
        type: 'app',
        title: 'Tarteel AI',
        url: 'https://tarteel.ai/',
        description: 'AI-powered Quran recitation practice',
      },
    ],
    isPrayerRelated: true,
    tags: ['quran', 'memorization', 'prayer'],
  },
  {
    id: 9,
    title: 'Day 9: Al-Fatiha Meaning',
    description: 'Understanding what you recite.',
    guidance: `Let's understand Al-Fatiha verse by verse:

"All praise is due to Allah, Lord of all the worlds" - Acknowledging Allah's sovereignty

"The Most Gracious, the Most Merciful" - His infinite mercy toward creation

"Master of the Day of Judgment" - Reminder of accountability

"You alone we worship, and You alone we ask for help" - The essence of Tawhid

"Guide us to the straight path" - Our constant prayer

"The path of those who have received Your grace; not of those who have brought Your anger, nor of those who have gone astray" - Seeking the path of the righteous

This is a conversation with Allah. Every prayer is an audience with the Creator.`,
    reflection: 'Which line resonates most with where you are in life?',
    audio: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatiha',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        description: 'Listen to Al-Fatiha - follow along with the meaning above',
      },
    ],
  },
  {
    id: 10,
    title: 'Day 10: Prophet Muhammad ﷺ',
    description: 'Learning about the final Messenger.',
    guidance: `Muhammad ﷺ (peace be upon him) is the final prophet in a line that includes Adam, Noah, Abraham, Moses, and Jesus (peace be upon them all).

Born in Mecca in 570 CE, he received the first revelation of the Quran at age 40. For 23 years, he taught Islam, enduring persecution, migration, and eventually establishing the first Muslim community.

His character is described as the "walking Quran" - embodying its teachings. He was known for:
• Truthfulness (Al-Sadiq)
• Trustworthiness (Al-Amin)
• Mercy to all creation
• Humility despite leadership

We follow his example (Sunnah) as the best model for human conduct.`,
    reflection: 'What quality of the Prophet inspires you most?',
  },
  {
    id: 11,
    title: 'Day 11: Islamic Manners',
    description: 'Adab - the beauty of Islamic etiquette.',
    guidance: `Islam teaches beautiful manners (Adab) that elevate daily life:

• Greet with "Assalamu Alaikum" (Peace be upon you)
• Reply with "Wa Alaikum Assalam" (And upon you peace)
• Say "Bismillah" before eating
• Say "Alhamdulillah" after eating
• Use your right hand for eating and giving
• Enter with your right foot, exit with your left
• Smile - it's charity
• Speak truthfully or remain silent
• Honor your parents
• Be kind to neighbors

These aren't just cultural customs - they're acts of worship that bring reward and barakah (blessing) to your life.`,
    reflection: 'Which manner will you practice today?',
  },
  {
    id: 12,
    title: 'Day 12: Dhikr - Remembrance of Allah',
    description: 'Keeping Allah in your heart.',
    guidance: `Dhikr means remembering Allah through phrases repeated with intention. The three most common:

SubhanAllah - "Glory be to Allah" (33 times)
Recognizing Allah's perfection

Alhamdulillah - "Praise be to Allah" (33 times)
Gratitude for all blessings

Allahu Akbar - "Allah is the Greatest" (34 times)
Acknowledging nothing compares to Allah

These can be said anytime - while walking, waiting, before sleep. Many Muslims use tasbeeh (prayer beads) to count.

The Prophet ﷺ said these three phrases are more beloved to Allah than everything the sun rises upon.`,
    reflection: 'Try saying each phrase 10 times. How does it feel?',
  },
  {
    id: 13,
    title: 'Day 13: Halal and Haram',
    description: 'Understanding permissible and forbidden.',
    guidance: `Islam provides clear guidance on what is halal (permissible) and haram (forbidden):

Haram foods include:
• Pork and its byproducts
• Alcohol and intoxicants
• Blood
• Animals not slaughtered Islamically
• Carnivorous animals

But halal goes beyond food:
• Earn money honestly
• Treat others justly
• Guard your tongue from lies and gossip
• Protect your gaze
• Avoid interest (riba) in financial dealings

Most things in life are halal - Islam prohibits only what harms us physically, spiritually, or socially.`,
    reflection: 'What halal change feels most doable for you right now?',
  },
  {
    id: 14,
    title: 'Day 14: Two Weeks Complete!',
    description: 'Reflection on your progress.',
    guidance: `Two weeks! SubhanAllah.

You've learned so much:
✓ The core beliefs of Islam
✓ The basics of prayer and purification
✓ Al-Fatiha and its meaning
✓ About Prophet Muhammad ﷺ
✓ Islamic manners and dhikr
✓ Halal and haram basics

Remember: Islam is not learned overnight. Scholars spend lifetimes studying. Your job is simply to take one step at a time.

The Prophet ﷺ said: "Make things easy and do not make them difficult. Give good news and do not turn people away."

Be gentle with yourself.`,
    reflection: 'What has been the biggest challenge so far? The biggest joy?',
  },
  {
    id: 15,
    title: 'Day 15: Introduction to Fasting',
    description: 'The pillar of Sawm.',
    guidance: `Fasting during Ramadan (the 9th Islamic month) is one of the Five Pillars. Muslims abstain from food, drink, and other physical needs from dawn to sunset.

But fasting is so much more than hunger:
• It builds self-discipline and willpower
• Creates empathy for the hungry
• Purifies the soul
• Brings immense reward

You won't fast until your first Ramadan (and you can work up to it). But understanding its purpose helps you appreciate this beautiful practice.

The Prophet ﷺ said: "Whoever fasts Ramadan with faith and seeking reward, all their past sins will be forgiven."`,
    reflection: 'What do you think you would learn about yourself through fasting?',
    isRamadanRelevant: true,
    tags: ['ramadan', 'fasting', 'sawm', 'pillars'],
  },
  {
    id: 16,
    title: 'Day 16: Charity in Islam',
    description: 'Zakat and Sadaqah - purifying wealth.',
    guidance: `Giving is central to Islam:

Zakat (obligatory):
• 2.5% of savings above nisab (minimum threshold)
• Given annually to specific categories of people
• Purifies your wealth
• A pillar of Islam

Sadaqah (voluntary):
• Any act of giving - money, time, even a smile
• No minimum or maximum
• Can be given anytime to anyone
• Removes sins and protects from calamity

The Prophet ﷺ said: "Charity does not decrease wealth." 

In fact, wealth that is shared is blessed and grows. What you give returns to you multiplied.`,
    reflection: 'How can you practice generosity this week?',
    resources: [
      {
        type: 'website',
        title: 'Islamic Relief',
        url: 'https://www.islamic-relief.org/',
        description: 'Global Islamic charity for humanitarian aid',
      },
      {
        type: 'website',
        title: 'LaunchGood',
        url: 'https://www.launchgood.com/',
        description: 'Crowdfunding platform for Muslim causes',
      },
    ],
  },
  {
    id: 17,
    title: 'Day 17: Tawakkul - Trust in Allah',
    description: 'Relying on Allah while taking action.',
    guidance: `Tawakkul is trusting Allah with your affairs after taking proper action.

The Prophet ﷺ explained it perfectly: A man asked, "Should I tie my camel and trust in Allah, or leave it untied and trust in Allah?" He replied: "Tie your camel, then trust in Allah."

This means:
1. Make your best effort
2. Take all reasonable precautions
3. Then release anxiety about results to Allah
4. Accept the outcome as Allah's wisdom

This brings incredible peace. You do your part; Allah does His. You are not responsible for outcomes - only your effort and intention.`,
    reflection: 'What worry can you release to Allah today?',
  },
  {
    id: 18,
    title: 'Day 18: Understanding Prayer Times',
    description: 'When to pray and why.',
    guidance: `The five prayers are tied to the sun's position:

Fajr (Dawn): From first light until just before sunrise
• 2 rakats (units)
• Best time to start your day with Allah

Dhuhr (Noon): After the sun passes its zenith until mid-afternoon
• 4 rakats
• A midday spiritual reset

Asr (Afternoon): Mid-afternoon until just before sunset
• 4 rakats
• The Prophet ﷺ warned not to miss this

Maghrib (Sunset): Just after sunset until twilight ends
• 3 rakats
• Shortest window - pray promptly

Isha (Night): After twilight until midnight (or dawn)
• 4 rakats
• Peaceful end to the day

Use a prayer time app to get accurate times for your location.`,
    reflection: 'Which prayer time might be easiest to establish first?',
  },
  {
    id: 19,
    title: 'Day 19: Seeking Forgiveness',
    description: 'Allah\'s infinite mercy.',
    guidance: `"Say: O My servants who have transgressed against themselves, do not despair of Allah's mercy. Indeed, Allah forgives all sins. Indeed, He is the Forgiving, the Merciful." (Quran 39:53)

This is one of the most hopeful verses in the Quran. Allah's mercy is greater than His wrath. No sin is too big if you turn back sincerely.

Istighfar (seeking forgiveness):
"Astaghfirullah" - "I seek forgiveness from Allah"

Say it 100 times daily. The Prophet ﷺ did, though he was guaranteed Paradise.

Remember: You converted to Islam. All previous sins are wiped clean. You start fresh. This is Allah's gift to you.`,
    reflection: 'What does divine mercy mean to your life?',
  },
  {
    id: 20,
    title: 'Day 20: Islamic Greetings',
    description: 'Spreading peace with your words.',
    guidance: `The Islamic greeting is beautiful and powerful:

"Assalamu Alaikum" - Peace be upon you
Response: "Wa Alaikum Assalam" - And upon you peace

For extra blessing:
"Assalamu Alaikum wa Rahmatullahi wa Barakatuh"
"Peace be upon you and Allah's mercy and blessings"

The Prophet ﷺ said: "You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I tell you what will strengthen that? Spread peace (Salam) among yourselves."

Every greeting earns reward and spreads goodness. Even strangers - especially strangers - deserve your Salam.`,
    reflection: 'How can spreading peace change your interactions?',
  },
  {
    id: 21,
    title: 'Day 21: Three Weeks!',
    description: 'A major milestone reached.',
    guidance: `Three weeks. You're 70% through the foundation journey!

Let's recap your knowledge:
✓ Core beliefs (Tawhid, Prophets, Scripture, Angels, Day of Judgment, Qadr)
✓ Five Pillars
✓ Prayer basics (Wudu, positions, Al-Fatiha)
✓ Islamic character (manners, greetings, dhikr)
✓ Lifestyle (halal/haram, charity, trust)
✓ Prayer times

You've built a strong foundation. The next nine days will deepen this knowledge and prepare you for lifelong learning.

The Prophet ﷺ said: "Whoever treads a path seeking knowledge, Allah will make easy for them a path to Paradise."`,
    reflection: 'What habit has become easier for you?',
  },
  {
    id: 22,
    title: 'Day 22: Modesty in Islam',
    description: 'Haya - inner and outer modesty.',
    guidance: `Haya (modesty/shyness) is a comprehensive concept covering:

Inner modesty:
• Humility before Allah
• Shame at sinning
• Avoiding arrogance
• Guarding the heart

Outer modesty:
• Dressing appropriately
• Lowering the gaze
• Speaking respectfully
• Avoiding vulgar behavior

For women, hijab is often part of this - but modesty applies to everyone.

The Prophet ﷺ said: "Haya is a branch of faith." And "Haya brings nothing but good."

Modesty isn't repression - it's protection of your dignity and inner peace.`,
    reflection: 'How do you understand modesty in your life?',
  },
  {
    id: 23,
    title: 'Day 23: Family in Islam',
    description: 'Honoring parents and keeping ties.',
    guidance: `Family relationships are sacred in Islam:

Parents:
"And your Lord has decreed that you worship none but Him, and that you be kind to parents." (Quran 17:23)

Kindness to parents is mentioned immediately after worship of Allah. Even if they're non-Muslim or difficult, treat them with respect (unless they command you to sin).

Extended family:
Maintaining family ties (silat ar-rahm) is obligatory. Breaking them is a major sin.

If your family doesn't understand your conversion:
• Be patient
• Show them Islam through your improved character
• Don't argue - let your actions speak
• Keep communication open
• Make dua for their guidance`,
    reflection: 'How can you strengthen your family relationships?',
  },
  {
    id: 24,
    title: 'Day 24: Belief in Angels',
    description: 'The unseen servants of Allah.',
    guidance: `Belief in angels is one of the six pillars of Iman (faith).

Angels are created from light and:
• Worship Allah constantly
• Never disobey Him
• Have no free will (unlike humans and jinn)
• Carry out Allah's commands

Key angels:
• Jibril (Gabriel): Revealed the Quran to Muhammad ﷺ
• Mikail (Michael): Controls rain and provisions
• Israfil: Will blow the trumpet on Judgment Day
• Izrail: The Angel of Death
• Kiraman Katibin: Two angels recording your deeds
• Munkar and Nakir: Question souls in the grave

You are never alone. Angels are with you, recording everything.`,
    reflection: 'How does knowing your deeds are recorded affect your choices?',
  },
  {
    id: 25,
    title: 'Day 25: The Day of Judgment',
    description: 'Accountability and the afterlife.',
    guidance: `Belief in the Last Day is fundamental to Islam:

What will happen:
1. Israfil blows the trumpet
2. All creation dies
3. He blows again; all are resurrected
4. Everyone stands before Allah
5. Deeds are weighed on scales
6. People cross the Sirat (bridge)
7. Destination: Paradise or Hellfire

This isn't meant to terrify you - it's meant to put life in perspective. This world is temporary. Your actions matter eternally.

But remember: Allah's mercy encompasses everything. Sincere believers, despite their sins, will ultimately enter Paradise.`,
    reflection: 'How does accountability shape your choices?',
  },
  {
    id: 26,
    title: 'Day 26: Islamic History',
    description: 'Where we come from.',
    guidance: `Understanding Islamic history provides context:

Key periods:
• Prophet Muhammad's life (570-632 CE): Revelation of Quran, establishment of Islam
• The Rightly Guided Caliphs (632-661 CE): Abu Bakr, Umar, Uthman, Ali
• The Umayyad Dynasty (661-750 CE): Expansion across continents
• The Abbasid Dynasty (750-1258 CE): The Islamic Golden Age
• The Ottoman Empire (1299-1922 CE): Last major caliphate

Islamic Golden Age achievements:
• Algebra, algorithms (from Arabic names!)
• Preservation of Greek philosophy
• Advances in medicine, astronomy, architecture
• Universities, hospitals, libraries

You join a rich tradition spanning continents and centuries.`,
    reflection: 'Which period of Islamic history interests you most?',
  },
  {
    id: 27,
    title: 'Day 27: Dua - Personal Supplication',
    description: 'Speaking to Allah in your own words.',
    guidance: `Dua is personal conversation with Allah. Unlike Salah (formal prayer), dua can be:

• In any language
• At any time
• In any position
• About anything

The Prophet ﷺ said: "Dua is the essence of worship."

Best times for dua:
• Last third of the night
• Between adhan and iqama
• While prostrating in prayer
• While fasting
• While traveling
• When it rains

What to ask for:
• Guidance
• Forgiveness
• Help with problems
• Good for others
• Protection from evil
• Anything your heart needs

Allah is Al-Mujeeb - The One who answers.`,
    reflection: 'What dua is in your heart today?',
  },
  {
    id: 28,
    title: 'Day 28: Overcoming Doubts',
    description: 'It\'s okay to have questions.',
    guidance: `Doubts are normal. Even great companions had questions.

The Prophet ﷺ said: "That is pure faith" - referring to someone who feared their whispered doubts.

When doubts arise:
1. Seek refuge in Allah: "A'udhu billahi min ash-shaytan ir-rajim"
2. Say "Amantu billah" (I believe in Allah)
3. Don't obsess - move on
4. Seek knowledge from reliable sources
5. Ask knowledgeable Muslims
6. Make dua for certainty

Remember: Shaytan (Satan) targets believers with doubts precisely because you matter. A person unconcerned with faith isn't his target.

Questions lead to deeper understanding. Never be afraid to ask.`,
    reflection: 'What question about Islam would you like answered?',
  },
  {
    id: 29,
    title: 'Day 29: Your Muslim Identity',
    description: 'Embracing who you are.',
    guidance: `Being Muslim is now part of your identity. But what does that mean?

You are:
• Part of a global ummah of 1.8 billion
• Connected to 1,400 years of tradition
• The same before Allah as any born Muslim
• Free to integrate Islam with your culture

You don't have to:
• Change your name (though you may)
• Change your personality
• Abandon your heritage
• Become someone else

Islam is like a river that flows through every culture, adapting to the terrain while staying the same water.

You bring your unique background to Islam. That's a gift to the ummah.`,
    reflection: 'How does Islam fit into your life long-term?',
  },
  {
    id: 30,
    title: 'Day 30: Journey Complete!',
    description: 'New beginnings.',
    guidance: `Masha'Allah! Tabarak'Allah! Alhamdulillah!

You did it. 30 days of consistent learning. This is remarkable.

What you've built:
• Foundation in core beliefs
• Understanding of prayer
• Knowledge of Islamic lifestyle
• Connection to Muslim heritage
• Tools for lifelong learning

But remember: This is just the beginning.

The Prophet ﷺ said: "Seek knowledge from the cradle to the grave."

Your journey continues:
• Days 31-60: Establishing Prayer
• Days 61-90: Understanding Quran
• Days 91+: Living Islam

You are ready. And you are not alone.

Welcome to the ummah, forever.`,
    reflection: 'What commitment will you make moving forward?',
  },
];

export default foundationJourney;
