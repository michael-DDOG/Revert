import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { PrayerScreen } from '../screens/PrayerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LearnScreen } from '../screens/LearnScreen';
import { DuaLibraryScreen } from '../screens/DuaLibraryScreen';
import { NamesOfAllahScreen } from '../screens/NamesOfAllahScreen';
import { PrayerGuideScreen } from '../screens/PrayerGuideScreen';
import { QuranBasicsScreen } from '../screens/QuranBasicsScreen';
import { QuranScreen } from '../screens/QuranScreen';
import { SurahReaderScreen } from '../screens/SurahReaderScreen';
import { AskImamScreen } from '../screens/AskImamScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { PrayerSettingsScreen } from '../screens/PrayerSettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();
const JourneyStack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator();
const QuranStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Tab Icon Component
const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

// Journey Stack (includes DayDetail)
const JourneyStackNavigator = () => (
  <JourneyStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerShadowVisible: false,
    }}
  >
    <JourneyStack.Screen 
      name="JourneyList" 
      component={JourneyScreen}
      options={{ headerShown: false }}
    />
    <JourneyStack.Screen 
      name="DayDetail" 
      component={DayDetailScreen}
      options={{ 
        headerTitle: '',
        headerBackTitle: 'Journey',
      }}
    />
  </JourneyStack.Navigator>
);

// Learn Stack (includes all learn sub-screens and Quran)
const LearnStackNavigator = () => (
  <LearnStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerShadowVisible: false,
    }}
  >
    <LearnStack.Screen
      name="LearnHome"
      component={LearnScreen}
      options={{ headerShown: false }}
    />
    <LearnStack.Screen
      name="Quran"
      component={QuranScreen}
      options={{ headerTitle: 'Holy Quran' }}
    />
    <LearnStack.Screen
      name="SurahReader"
      component={SurahReaderScreen}
      options={{
        headerTitle: '',
        headerBackTitle: 'Quran',
      }}
    />
    <LearnStack.Screen
      name="DuaLibrary"
      component={DuaLibraryScreen}
      options={{ headerTitle: 'Dua Library' }}
    />
    <LearnStack.Screen
      name="NamesOfAllah"
      component={NamesOfAllahScreen}
      options={{ headerTitle: '99 Names of Allah' }}
    />
    <LearnStack.Screen
      name="PrayerGuide"
      component={PrayerGuideScreen}
      options={{ headerTitle: 'Prayer Guide' }}
    />
    <LearnStack.Screen
      name="QuranBasics"
      component={QuranBasicsScreen}
      options={{ headerTitle: 'Quran Basics' }}
    />
    <LearnStack.Screen
      name="AskImam"
      component={AskImamScreen}
      options={{ headerTitle: 'Ask an Islamic Guide' }}
    />
  </LearnStack.Navigator>
);

// Quran Stack (Full Quran reader - for dedicated Quran tab)
const QuranStackNavigator = () => (
  <QuranStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerShadowVisible: false,
    }}
  >
    <QuranStack.Screen
      name="QuranHome"
      component={QuranScreen}
      options={{ headerShown: false }}
    />
    <QuranStack.Screen
      name="SurahReader"
      component={SurahReaderScreen}
      options={{
        headerTitle: '',
        headerBackTitle: 'Quran',
      }}
    />
  </QuranStack.Navigator>
);

// Profile Stack (includes settings screens)
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerShadowVisible: false,
    }}
  >
    <ProfileStack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="NotificationSettings"
      component={NotificationSettingsScreen}
      options={{ headerTitle: 'Notifications' }}
    />
    <ProfileStack.Screen
      name="PrayerSettings"
      component={PrayerSettingsScreen}
      options={{ headerTitle: 'Prayer Settings' }}
    />
    <ProfileStack.Screen
      name="About"
      component={AboutScreen}
      options={{ headerTitle: 'About' }}
    />
  </ProfileStack.Navigator>
);

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitle: 'The Revert',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Journey" 
        component={JourneyStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🌱" label="Journey" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📖" label="Learn" focused={focused} />
          ),
        }}
      />
      <Tab.Screen 
        name="Prayer" 
        component={PrayerScreen}
        options={{
          headerTitle: 'Prayer',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🤲" label="Prayer" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default MainTabNavigator;
