import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { UserProfile } from '../types/auth';

// Get config from app.json extra
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================
// AUTH FUNCTIONS
// ============================================

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export const createUserProfile = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('user_profiles').insert({
    user_id: userId,
    trial_start_date: new Date().toISOString(),
    subscription_status: 'trial',
  });

  // Ignore duplicate key error (profile already exists)
  if (error && error.code !== '23505') {
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If profile doesn't exist, create it
    if (error.code === 'PGRST116') {
      await createUserProfile(userId);
      return getUserProfile(userId);
    }
    throw error;
  }

  return data;
};

export const updateSubscriptionStatus = async (
  userId: string,
  status: string
): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ subscription_status: status })
    .eq('user_id', userId);

  if (error) throw error;
};

// ============================================
// AUTH STATE LISTENER
// ============================================

export const onAuthStateChange = (
  callback: (event: string, session: any) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};
