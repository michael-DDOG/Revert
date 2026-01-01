import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../constants/theme';
import { useOnboardingStore, OnboardingScreen } from '../store/useOnboardingStore';

// Import all onboarding screens
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { ShahadaDateScreen } from '../screens/onboarding/ShahadaDateScreen';
import { BackgroundScreen } from '../screens/onboarding/BackgroundScreen';
import { AttractionScreen } from '../screens/onboarding/AttractionScreen';
import { KnowledgeLevelScreen } from '../screens/onboarding/KnowledgeLevelScreen';
import { ChallengeScreen } from '../screens/onboarding/ChallengeScreen';
import { GoalsScreen } from '../screens/onboarding/GoalsScreen';
import { CommitmentScreen } from '../screens/onboarding/CommitmentScreen';
import { NotificationsScreen } from '../screens/onboarding/NotificationsScreen';
import { PromiseScreen } from '../screens/onboarding/PromiseScreen';
import { FirstMomentScreen } from '../screens/onboarding/FirstMomentScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Name: undefined;
  ShahadaDate: undefined;
  Background: undefined;
  Attraction: undefined;
  KnowledgeLevel: undefined;
  Challenge: undefined;
  Goals: undefined;
  Commitment: undefined;
  Notifications: undefined;
  Promise: undefined;
  FirstMoment: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  const currentScreen = useOnboardingStore((state) => state.currentOnboardingScreen);

  return (
    <Stack.Navigator
      initialRouteName={currentScreen as keyof OnboardingStackParamList}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 350,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="ShahadaDate" component={ShahadaDateScreen} />
      <Stack.Screen name="Background" component={BackgroundScreen} />
      <Stack.Screen name="Attraction" component={AttractionScreen} />
      <Stack.Screen name="KnowledgeLevel" component={KnowledgeLevelScreen} />
      <Stack.Screen name="Challenge" component={ChallengeScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Commitment" component={CommitmentScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Promise" component={PromiseScreen} />
      <Stack.Screen name="FirstMoment" component={FirstMomentScreen} />
    </Stack.Navigator>
  );
};
