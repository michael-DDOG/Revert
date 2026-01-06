// Establishing Prayer Track - Days 31-60: Making Salah Second Nature
// Real, meaningful content for new Muslims who completed Foundation

import { Day } from '../types';

export const prayerJourney: Day[] = [
  {
    id: 31,
    title: 'Day 31: Starting the Prayer Journey',
    description: 'Moving from knowledge to practice.',
    guidance: `Welcome to Track 2! You've built the foundation. Now it's time to establish your prayer.

The Prophet ﷺ said: "The first thing people will be asked about on the Day of Judgment is prayer."

This month we'll transform prayer from "something you know about" to "the anchor of your day."

Our goals:
• Perfect your Wudu
• Learn to pray confidently
• Memorize essential surahs
• Understand what you're reciting
• Experience the sweetness of Salah

Let's begin.`,
    reflection: 'What excites you most about establishing prayer?',
    resources: [
      {
        type: 'app',
        title: 'Pillars - Learn to Pray',
        url: 'https://pillarsapp.com/',
        description: 'Step-by-step prayer learning app',
      },
      {
        type: 'website',
        title: 'Prayer Guide - IslamicFinder',
        url: 'https://www.islamicfinder.org/prayer/',
        description: 'Detailed prayer instructions with images',
      },
    ],
  },
  {
    id: 32,
    title: 'Day 32: Perfecting Wudu',
    description: 'Detailed purification guide.',
    guidance: `Let's revisit Wudu with more detail:

Before you start:
• Remove anything that blocks water (nail polish, heavy makeup)
• Have pure water available
• Face the Qibla if possible

The method of Prophet Muhammad ﷺ:
1. Make intention (in your heart, not aloud)
2. Say "Bismillah"
3. Wash hands 3x - between fingers too
4. Rinse mouth 3x - swish water thoroughly
5. Rinse nose 3x - sniff water, blow out
6. Wash face 3x - hairline to chin, ear to ear
7. Wash right arm to elbow 3x
8. Wash left arm to elbow 3x
9. Wipe head once - front to back to front
10. Wipe ears once - index inside, thumbs outside
11. Wash right foot to ankle 3x - between toes
12. Wash left foot to ankle 3x

End with: "Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan abduhu wa rasuluh."`,
    reflection: 'Practice Wudu now. Which step feels least natural?',
  },
  {
    id: 33,
    title: 'Day 33: What You Recite',
    description: 'Understanding the words of Salah.',
    guidance: `Prayer has specific phrases at each point. Today, let's understand them:

Standing (Qiyam):
"Allahu Akbar" - "Allah is the Greatest" (starting prayer)
Then Al-Fatiha (which you know)
Then a short surah

Bowing (Ruku):
"SubhanAllah Rabbi al-Adheem" - "Glory be to my Lord, the Most Great" (3x)

Rising:
"Sami'Allahu liman hamidah" - "Allah hears those who praise Him"
"Rabbana wa lakal hamd" - "Our Lord, to You belongs all praise"

Prostration (Sujud):
"SubhanAllah Rabbi al-A'la" - "Glory be to my Lord, the Most High" (3x)

Sitting:
The Tashahhud (we'll learn this in detail)

These aren't random words - each one is meaningful worship.`,
    reflection: 'Try saying each phrase slowly. Feel the meaning.',
  },
  {
    id: 34,
    title: 'Day 34: Al-Fatiha Deep Dive',
    description: 'The dialogue with Allah.',
    guidance: `The Prophet ﷺ taught us that Al-Fatiha is a dialogue:

You say: "All praise be to Allah, Lord of the worlds"
Allah responds: "My servant has praised Me"

You say: "The Most Gracious, the Most Merciful"
Allah responds: "My servant has extolled Me"

You say: "Master of the Day of Judgment"  
Allah responds: "My servant has glorified Me"

You say: "You alone we worship, and You alone we ask for help"
Allah responds: "This is between Me and My servant, and My servant will have what they ask"

You say: "Guide us to the straight path..."
Allah responds: "This is for My servant, and My servant will have what they ask"

When you recite Al-Fatiha, Allah is responding to you. Every single time.`,
    reflection: 'How does knowing Allah responds change your recitation?',
    audio: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatiha',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        description: 'Listen to Al-Fatiha and imagine Allah responding to each verse',
      },
    ],
  },
  {
    id: 35,
    title: 'Day 35: Learning Surah Al-Ikhlas',
    description: 'The essence of Tawhid in four verses.',
    guidance: `Surah Al-Ikhlas (Chapter 112) is called "one-third of the Quran" because it summarizes Tawhid:

قُلْ هُوَ اللَّهُ أَحَدٌ
Qul huwa Allahu ahad
"Say: He is Allah, the One"

اللَّهُ الصَّمَدُ
Allahu as-samad
"Allah, the Eternal Refuge"

لَمْ يَلِدْ وَلَمْ يُولَدْ
Lam yalid wa lam yulad
"He neither begets nor is begotten"

وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ
Wa lam yakun lahu kufuwan ahad
"And there is none comparable to Him"

This surah declares:
• Allah is absolutely One
• Allah is self-sufficient, everything depends on Him
• Allah has no children or parents
• Nothing resembles Allah

Memorize this surah. Recite it in your prayers.`,
    reflection: 'Practice reciting Al-Ikhlas 10 times.',
    audio: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
        description: 'Listen to Al-Ikhlas - repeat after the reciter',
      },
    ],
    isPrayerRelated: true,
    tags: ['quran', 'memorization', 'tawhid'],
  },
  {
    id: 36,
    title: 'Day 36: Learning Surah Al-Falaq',
    description: 'Seeking refuge in the Lord of dawn.',
    guidance: `Surah Al-Falaq (Chapter 113) is a protection surah:

قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
Qul a'udhu bi rabbi al-falaq
"Say: I seek refuge in the Lord of daybreak"

مِن شَرِّ مَا خَلَقَ
Min sharri ma khalaq
"From the evil of that which He created"

وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
Wa min sharri ghasiqin idha waqab
"And from the evil of darkness when it settles"

وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
Wa min sharri an-naffathati fi al-'uqad
"And from the evil of the blowers in knots" (those who practice magic)

وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ
Wa min sharri hasidin idha hasad
"And from the evil of an envier when they envy"

The Prophet ﷺ recited this and Al-Nas every night before sleep.`,
    reflection: 'What does seeking refuge in Allah feel like?',
    audio: [
      {
        surahNumber: 113,
        surahName: 'Al-Falaq',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
        description: 'Listen to Al-Falaq - a protection surah',
      },
    ],
    tags: ['quran', 'memorization', 'protection'],
  },
  {
    id: 37,
    title: 'Day 37: Learning Surah An-Nas',
    description: 'Seeking refuge from whispers.',
    guidance: `Surah An-Nas (Chapter 114) completes the protection pair:

قُلْ أَعُوذُ بِرَبِّ النَّاسِ
Qul a'udhu bi rabbi an-nas
"Say: I seek refuge in the Lord of mankind"

مَلِكِ النَّاسِ
Maliki an-nas
"The Sovereign of mankind"

إِلَٰهِ النَّاسِ
Ilahi an-nas
"The God of mankind"

مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
Min sharri al-waswasi al-khannas
"From the evil of the retreating whisperer"

الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
Alladhi yuwaswisu fi suduri an-nas
"Who whispers in the breasts of mankind"

مِنَ الْجِنَّةِ وَالنَّاسِ
Mina al-jinnati wa an-nas
"From among the jinn and mankind"

Together, Al-Ikhlas, Al-Falaq, and An-Nas are powerful protection.`,
    reflection: 'You now know 4 surahs! How does that feel?',
    audio: [
      {
        surahNumber: 114,
        surahName: 'An-Nas',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3',
        description: 'Listen to An-Nas - protection from whispers',
      },
    ],
    tags: ['quran', 'memorization', 'protection'],
  },
  {
    id: 38,
    title: 'Day 38: The Sunnah Prayers',
    description: 'Optional prayers with great reward.',
    guidance: `Beyond the 5 obligatory prayers, there are Sunnah (voluntary) prayers:

Rawatib (attached to obligatory):
• 2 before Fajr (most emphasized)
• 4 before Dhuhr, 2 after
• 2 after Maghrib
• 2 after Isha

The Prophet ﷺ said: "Whoever prays 12 rakats during the day and night, a house will be built for them in Paradise."

Other optional prayers:
• Duha (mid-morning): 2-8 rakats
• Tahajjud (night): As many as you wish
• Witr (after Isha): 1, 3, 5, 7, 9, or 11 rakats

Start small. Even 2 rakats of Sunnah is valuable. The key is consistency over quantity.`,
    reflection: 'Which Sunnah prayer might you add first?',
  },
  {
    id: 39,
    title: 'Day 39: Praying in Congregation',
    description: 'The blessing of jamaah.',
    guidance: `Praying in congregation (jamaah) is highly encouraged:

The Prophet ﷺ said: "Prayer in congregation is 27 times better than praying alone."

For men, attending the mosque for obligatory prayers is strongly encouraged (some scholars say obligatory for those nearby).

For everyone:
• Friday (Jummah) prayer is obligatory for men
• Eid prayers are highly recommended
• Family prayers at home bring barakah

How congregation works:
• One person leads (Imam)
• Others follow behind in rows
• You follow the Imam's movements
• Say "Ameen" after Al-Fatiha

Don't be nervous about your first mosque visit. Everyone was new once. Muslims welcome newcomers with joy.`,
    reflection: 'What concerns do you have about praying at a mosque?',
  },
  {
    id: 40,
    title: 'Day 40: Your First Jummah',
    description: 'The weekly gathering.',
    guidance: `Jummah (Friday) prayer is special:

• Replaces Dhuhr on Fridays
• Obligatory for adult males
• Highly recommended for women
• Best day of the week

What happens:
1. Arrive early, make Wudu
2. Pray 2-4 rakats Sunnah
3. Listen to the Khutbah (sermon) - 2 parts
4. Pray 2 rakats led by Imam
5. Pray Sunnah after (4 rakats recommended)

Etiquette:
• Dress nicely, use fragrance
• Listen silently during khutbah
• Don't step over people
• Arrive early for more reward
• Make lots of dua, especially in the last hour before Maghrib

The Prophet ﷺ said Friday contains an hour when all duas are accepted.`,
    reflection: 'Plan your first Jummah. Which mosque will you visit?',
    resources: [
      {
        type: 'mosque_finder',
        title: 'Find a Mosque Near You',
        url: 'https://www.islamicfinder.org/world/',
        description: 'Locate mosques for Jummah prayer',
      },
      {
        type: 'app',
        title: 'Muslim Pro',
        url: 'https://www.muslimpro.com/',
        description: 'Prayer times and mosque locator',
      },
    ],
  },
  {
    id: 41,
    title: 'Day 41: Tajweed Basics - Part 1',
    description: 'Beautiful recitation begins.',
    guidance: `Tajweed is the art of reciting Quran correctly. Today: the Arabic alphabet sounds.

Letters from the throat:
• ع (Ayn) - Deep in throat
• غ (Ghayn) - Like French "r"
• ح (Ha) - Breathy "h"
• خ (Kha) - Like clearing throat
• ء (Hamza) - Glottal stop
• ه (Ha) - Light "h"

Common mistakes for English speakers:
• ع is NOT like English "a"
• غ is NOT like "g"  
• ح is NOT like regular "h"

These sounds don't exist in English, so they require practice.

Tip: Listen to skilled Quran reciters like Mishary Rashid Alafasy. Repeat after them. Your ear will train your tongue.`,
    reflection: 'Practice saying "Alhamdulillah" with correct ح sound.',
  },
  {
    id: 42,
    title: 'Day 42: Tajweed Basics - Part 2',
    description: 'Heavy and light letters.',
    guidance: `Arabic letters have thickness (tafkheem) or thinness (tarqeeq):

Heavy letters (always): ص ض ط ظ غ خ ق
These are pronounced with the tongue raised

Light letters (always): Most others

Letters that change:
• ر (Ra) - Heavy or light based on context
• ل (Lam) in "Allah" - Heavy when preceded by fatha or damma
• ا (Alif) - Takes the quality of what precedes it

Why this matters:
Correct pronunciation changes meaning. The Quran was revealed to be recited beautifully.

The Prophet ﷺ said: "Beautify the Quran with your voices."

Don't worry about perfection. Even struggling to recite earns double reward.`,
    reflection: 'Notice the heavy sounds in "Allahu Akbar."',
  },
  {
    id: 43,
    title: 'Day 43: Tajweed Basics - Part 3',
    description: 'Rules of noon and tanween.',
    guidance: `When ن (noon) or tanween (ً ٍ ٌ) meet certain letters, rules apply:

1. Idh-har (Clear): Before throat letters
   • Pronounce noon clearly

2. Idgham (Merging): Before ي ر م ل و ن
   • Noon merges into the next letter
   • Sometimes with ghunnah (nasalization)

3. Iqlab (Conversion): Before ب
   • Noon becomes "m" sound
   • With ghunnah held 2 counts

4. Ikhfa (Hiding): Before remaining 15 letters
   • Noon is hidden with ghunnah

This sounds complex, but your ear will learn naturally by listening to qualified reciters.

Many new Muslims learn tajweed through apps or with a teacher. There's no rush - learn gradually.`,
    reflection: 'Listen to Surah Al-Fatiha by a qari. Notice the rules.',
  },
  {
    id: 44,
    title: 'Day 44: Tajweed Basics - Part 4',
    description: 'Lengthening vowels.',
    guidance: `Arabic vowels can be short or long (madd):

Short vowels (1 count):
• Fatha: "a" as in "cat"
• Kasra: "i" as in "bit"
• Damma: "u" as in "put"

Long vowels (2 counts):
• Alif after fatha: "aa"
• Ya after kasra: "ee"
• Waw after damma: "oo"

Extended lengthening (4-6 counts):
• Before hamza
• At stops
• Various other rules

Example in Al-Fatiha:
"Ar-Rahmaaaan" - The "a" is held longer
"Ar-Raheeeem" - The "ee" is held longer

This elongation creates the beautiful, melodic sound of Quran recitation.`,
    reflection: 'Practice Al-Fatiha focusing on long vowels.',
  },
  {
    id: 45,
    title: 'Day 45: Tajweed Basics - Part 5',
    description: 'Stopping and starting.',
    guidance: `Where you pause (waqf) in Quran matters:

Types of stops:
• وقف لازم (Obligatory stop) - Must stop, meaning changes if you don't
• وقف جائز (Permissible stop) - Can stop or continue
• لا (Don't stop) - Meaning incomplete if you stop

When you must stop (out of breath):
• Stop at the end of a verse
• Don't stop in the middle of Allah's name
• Don't separate words that belong together

Starting rules:
• Always begin with "A'udhu billahi..." and "Bismillah" at surah start
• Can start with "Bismillah" mid-surah
• Resume from where meaning is complete

Don't worry - in prayer, just stop at verse endings. That's always safe.`,
    reflection: 'Practice reciting Al-Ikhlas with proper stops.',
  },
  {
    id: 46,
    title: 'Day 46: Duas After Prayer',
    description: 'Words after saying Salam.',
    guidance: `After completing prayer (saying Salam), the Prophet ﷺ taught us:

Immediate after Salam:
"Astaghfirullah" (3x) - I seek Allah's forgiveness
"Allahumma anta as-Salam, wa minka as-Salam, tabarakta ya dhal-jalali wal-ikram"
"O Allah, You are Peace, from You is peace, blessed are You, Possessor of majesty and honor"

Then:
• "La ilaha illallah, wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir" (Once or 10x)
• "SubhanAllah" (33x)
• "Alhamdulillah" (33x)
• "Allahu Akbar" (34x)

Then make personal dua - this is an accepted time. Ask Allah for anything in any language.`,
    reflection: 'Try the post-prayer adhkar after your next Salah.',
  },
  {
    id: 47,
    title: 'Day 47: The Tashahhud',
    description: 'What you say while sitting.',
    guidance: `The Tashahhud is recited while sitting in prayer:

التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ
At-tahiyyatu lillahi was-salawatu wat-tayyibat
"All greetings, prayers, and good things are for Allah"

السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh
"Peace be upon you, O Prophet, and Allah's mercy and blessings"

السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ
As-salamu 'alayna wa 'ala 'ibadillahis-salihin
"Peace be upon us and upon the righteous servants of Allah"

أَشْهَدُ أَن لَّا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh
"I bear witness there is no god but Allah, and Muhammad is His servant and messenger"

Take your time memorizing this. Read from paper until it's natural.`,
    reflection: 'Begin memorizing line by line.',
  },
  {
    id: 48,
    title: 'Day 48: Salawat on the Prophet ﷺ',
    description: 'The prayer after Tashahhud.',
    guidance: `In the final sitting, after Tashahhud, we send blessings on the Prophet ﷺ:

اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad
"O Allah, send blessings upon Muhammad and upon the family of Muhammad"

كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ
Kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim
"As You sent blessings upon Ibrahim and the family of Ibrahim"

إِنَّكَ حَمِيدٌ مَجِيدٌ
Innaka hamidun majid
"Indeed, You are Praiseworthy and Glorious"

(Then the same with "barik" - bless - instead of "salli")

The Prophet ﷺ said: "Whoever sends one blessing upon me, Allah sends ten upon him."`,
    reflection: 'Practice the Salawat slowly with meaning.',
  },
  {
    id: 49,
    title: 'Day 49: Complete 2-Rakat Prayer',
    description: 'Putting it all together.',
    guidance: `Let's walk through a complete 2-rakat prayer (like Fajr):

RAKAT 1:
1. Stand facing Qibla, intention in heart
2. "Allahu Akbar" (raise hands to ears)
3. Hands on chest, recite opening dua (optional)
4. Recite Al-Fatiha, then another surah
5. "Allahu Akbar," bow (Ruku)
6. "SubhanAllah Rabbi al-Adheem" (3x)
7. Rise: "Sami'Allahu liman hamidah, Rabbana wa lakal hamd"
8. "Allahu Akbar," prostrate (Sujud)
9. "SubhanAllah Rabbi al-A'la" (3x)
10. "Allahu Akbar," sit briefly
11. "Allahu Akbar," second prostration
12. "SubhanAllah Rabbi al-A'la" (3x)
13. "Allahu Akbar," stand for Rakat 2

RAKAT 2:
14. Same as Rakat 1 (steps 4-12)
15. After second sujud, remain seated
16. Recite Tashahhud + Salawat
17. Turn head right: "Assalamu alaikum wa rahmatullah"
18. Turn head left: "Assalamu alaikum wa rahmatullah"

You've completed Salah!`,
    reflection: 'Practice this sequence slowly, using notes.',
  },
  {
    id: 50,
    title: 'Day 50: Twenty Days of Prayer!',
    description: 'Milestone celebration.',
    guidance: `SubhanAllah! You've spent 20 days focused on prayer.

Look what you've learned:
✓ Perfect Wudu
✓ Four surahs (Fatiha, Ikhlas, Falaq, Nas)
✓ All prayer phrases with meaning
✓ Tajweed basics
✓ Post-prayer adhkar
✓ Tashahhud and Salawat
✓ Complete 2-rakat structure
✓ Sunnah prayers
✓ Jummah attendance

The remaining 10 days will focus on:
• Making prayer a habit
• Experiencing khushu (focus/humility)
• Solving common challenges
• Building consistency

You're not just learning prayer anymore - you're becoming someone who prays.`,
    reflection: 'How has your relationship with prayer changed?',
  },
  {
    id: 51,
    title: 'Day 51: Khushu in Prayer',
    description: 'The soul of Salah.',
    guidance: `Khushu is the heart's presence and humility in prayer. Without it, prayer is just movements.

The Prophet ﷺ said: "The first thing to be lifted from this Ummah is khushu, until you will see no one who has it."

How to achieve khushu:
• Prepare before prayer (Wudu, appropriate space)
• Pray as if it's your last prayer
• Understand what you're reciting
• Look at your place of prostration
• Don't rush - pause between movements
• Remember you're standing before Allah
• Visualize the meanings

Distractions will come. When they do:
• Don't stress - gently return focus
• Seek refuge from Shaytan
• Try changing your recitation (different surah)

Perfect khushu comes with practice. Even 10 seconds of focus is valuable.`,
    reflection: 'In your last prayer, when did you feel most present?',
  },
  {
    id: 52,
    title: 'Day 52: Overcoming Prayer Obstacles',
    description: 'Common challenges and solutions.',
    guidance: `Every Muslim faces prayer challenges. Here are solutions:

"I don't have time"
→ Prayer takes 5-10 minutes. You have time for social media.
→ The time windows are wide. Find what works.

"I keep forgetting"
→ Set phone alarms for each prayer
→ Use a prayer app with notifications
→ Link prayer to existing habits (after waking, lunch, etc.)

"I don't feel anything"
→ Learn meanings of what you recite
→ Quality over speed
→ Feelings follow actions

"I missed a prayer"
→ Make it up as soon as you remember
→ Don't spiral - just continue
→ Missing doesn't mean failing

"I'm at work/school"
→ Find a clean, quiet space
→ Many places have multi-faith rooms
→ You can combine Dhuhr/Asr if necessary

"My family/roommates don't understand"
→ Pray in your room
→ Most people respect religious practice when explained`,
    reflection: "What's your biggest prayer obstacle? What's the solution?",
  },
  {
    id: 53,
    title: 'Day 53: Building Consistency',
    description: 'Making prayer non-negotiable.',
    guidance: `The Prophet ﷺ said: "The most beloved deeds to Allah are those done consistently, even if small."

Strategies for consistency:

1. Start with what you can maintain
   • Can't do all 5? Start with 2-3
   • Build up gradually

2. Create environmental cues
   • Designate a prayer spot
   • Keep prayer clothes accessible
   • Have your prayer app prominent

3. Use habit stacking
   • Fajr → Before breakfast
   • Dhuhr → During lunch break
   • Asr → When you get home
   • Maghrib → Before dinner
   • Isha → Before bed routine

4. Track your prayers
   • Use our app's tracker
   • Notice patterns
   • Celebrate streaks

5. Have a recovery plan
   • Missed prayer = make it up immediately
   • Bad day ≠ bad week
   • Allah loves those who return

Consistency builds identity. Soon you won't be "someone trying to pray" - you'll be "someone who prays."`,
    reflection: 'What tracking system will you use?',
  },
  {
    id: 54,
    title: 'Day 54: Prayer in Different Situations',
    description: 'Travel, illness, and special cases.',
    guidance: `Islam accommodates real life:

Traveling:
• Can shorten 4-rakat prayers to 2
• Can combine Dhuhr+Asr and Maghrib+Isha
• Approximately 80km+ journey

Illness:
• Pray sitting if you can't stand
• Pray lying down if you can't sit
• Motion with your head/eyes if you can't move
• Never abandon prayer while conscious

At work:
• Combine prayers if absolutely necessary
• Pray in any clean space
• Shoes off, face Qibla

On a plane:
• Pray in your seat if you must
• Face Qibla direction as best you can
• Motions can be smaller

Uncertainty about Qibla:
• Use compass/app
• If truly unknown, make your best guess
• Allah knows your intention

Missed prayers:
• Make them up in order
• Can skip order if current prayer time ending
• No expiration on making up prayers`,
    reflection: 'Which situation have you faced or will likely face?',
  },
  {
    id: 55,
    title: 'Day 55: Understanding Arabic Prayer Words',
    description: 'What your mouth and heart are saying.',
    guidance: `Let's ensure you know what you're saying:

"Allahu Akbar" - Allah is Greater (than anything else)
"SubhanAllah" - Glory be to Allah (He is perfect, free from flaw)
"Alhamdulillah" - All praise is for Allah
"La ilaha illallah" - There is no god but Allah
"Bismillah" - In the name of Allah
"Ameen" - O Allah, answer/accept
"Sami'Allahu liman hamidah" - Allah hears the one who praises Him

In Ruku:
"SubhanAllah Rabbi al-Adheem" - Glory to my Lord, the Most Great

In Sujud:
"SubhanAllah Rabbi al-A'la" - Glory to my Lord, the Most High

Between prostrations:
"Rabbighfir li" - My Lord, forgive me

Understanding transforms empty words into heartfelt conversation with your Creator.`,
    reflection: 'Which phrase means most to you now?',
  },
  {
    id: 56,
    title: 'Day 56: The Night Prayer (Tahajjud)',
    description: 'The prayer of the devoted.',
    guidance: `Tahajjud is optional night prayer, prayed after Isha and before Fajr (best in the last third of the night).

Why it's special:
• Closest time to Allah's mercy descending
• Time when dua is especially accepted
• Sign of sincere faith
• Brings noor (light) to the face and heart

The Prophet ﷺ said: "The best prayer after the obligatory prayers is the night prayer."

How to pray:
• Wake before Fajr (even 30 minutes)
• Pray 2 rakats at a time
• As few as 2, as many as 12
• End with Witr (odd number, 1-11)

Tips for waking:
• Sleep early after Isha
• Set a gentle alarm
• Make intention before sleeping
• Start with once a week

This is advanced - don't stress if you're not ready. Just know it exists for when you seek more.`,
    reflection: 'Could you try Tahajjud once this week?',
  },
  {
    id: 57,
    title: 'Day 57: When Prayer Feels Difficult',
    description: 'Iman fluctuates - this is normal.',
    guidance: `Every Muslim experiences times when prayer feels hard:
• Feeling distant from Allah
• Going through the motions
• Struggling to get up for Fajr
• Skipping and feeling guilty

Know this: Iman (faith) rises and falls. Even the Companions experienced this.

What to do:
1. Don't stop praying
   • Even mechanical prayer is prayer
   • The act itself is worship
   • Feelings will return

2. Examine your life
   • Are you sinning more?
   • Are you neglecting Quran?
   • Who are you spending time with?

3. Change your approach
   • Pray in a different location
   • Listen to Quran recitation
   • Attend a class or lecture
   • Spend time with practicing Muslims

4. Talk to Allah
   • Make dua for sweetness in prayer
   • Be honest with Him
   • He knows your heart anyway

This too shall pass. The one who struggles to pray but keeps praying is beloved to Allah.`,
    reflection: 'When prayer is hard, what will you do?',
  },
  {
    id: 58,
    title: 'Day 58: The Sweetness of Salah',
    description: 'When prayer becomes joy.',
    guidance: `The Prophet ﷺ said: "The coolness of my eyes is in prayer."

Prayer isn't meant to be a burden - it's meant to be relief, comfort, joy.

Signs prayer is becoming sweet:
• You look forward to the next prayer
• Time passes quickly while praying
• You feel refreshed after
• Problems feel smaller
• You miss it when you skip

How to get there:
• Keep learning and understanding
• Beautify your recitation
• Pray slowly, don't rush
• Choose meaningful surahs
• Make extended sujud
• Talk to Allah in your own words after

The Prophet ﷺ would say "O Bilal, give us rest through prayer" - asking for the call to prayer because it was his peace.

May Allah grant you this sweetness.`,
    reflection: 'Describe a moment when prayer felt peaceful.',
  },
  {
    id: 59,
    title: 'Day 59: Your Prayer Identity',
    description: 'You are someone who prays.',
    guidance: `Look at who you've become:

30 days ago you were learning what prayer is.
Now you:
• Know how to make Wudu perfectly
• Have memorized essential surahs
• Understand what you recite
• Know the structure of prayer
• Have attended Jummah
• Have strategies for consistency
• Understand khushu
• Can pray in different situations

This is transformation.

The identity shift is important:
• You're not "trying to become someone who prays"
• You ARE someone who prays
• Missed prayer is an exception, not the rule
• Prayer is part of your day, like eating

When you see yourself as a praying person, decisions become easier:
"I can't meet at that time - I need to pray."
"Hold on, let me finish my prayer."

This is your new normal.`,
    reflection: 'How does it feel to identify as someone who prays?',
  },
  {
    id: 60,
    title: 'Day 60: Prayer Track Complete!',
    description: 'You\'ve established Salah.',
    guidance: `Allahu Akbar. Alhamdulillah. SubhanAllah.

You've completed the Prayer Track.

What you've mastered:
✓ Complete Wudu with understanding
✓ Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas
✓ Tajweed fundamentals
✓ Full prayer structure (2, 3, and 4 rakat)
✓ Tashahhud and Salawat
✓ Post-prayer adhkar
✓ Sunnah prayers
✓ Jummah attendance
✓ Night prayer basics
✓ Consistency strategies
✓ Overcoming obstacles
✓ Khushu and presence

You are now equipped to pray for the rest of your life.

Next journey: Understanding Quran (Days 61-90)

But for now, celebrate. You've done something beautiful. Allah sees your effort.

May your prayers be accepted. May they be light in your grave and on the Day of Judgment. May they be the coolness of your eyes.

Ameen.`,
    reflection: 'What commitment will you make about prayer going forward?',
  },
];

export default prayerJourney;
