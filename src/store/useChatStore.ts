// Chat Store - State management for AI Islamic chat history
// Persists chat conversations and tracks usage limits

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../services/aiChatService';
import { ANTHROPIC_CONFIG } from '../constants/config';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  // Current conversation
  currentMessages: ChatMessage[];
  isLoading: boolean;

  // Chat sessions (history)
  sessions: ChatSession[];
  currentSessionId: string | null;

  // Usage tracking
  dailyQueries: number;
  lastQueryDate: string;

  // Actions
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearCurrentChat: () => void;
  saveCurrentSession: (title?: string) => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  incrementQueryCount: () => boolean; // Returns false if limit reached
  canMakeQuery: () => boolean;
  getRemainingQueries: () => number;
  resetDailyLimit: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const generateSessionId = () =>
  `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const generateSessionTitle = (messages: ChatMessage[]): string => {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (firstUserMessage) {
    // Take first 40 characters of first message as title
    const title = firstUserMessage.content.substring(0, 40);
    return title.length < firstUserMessage.content.length ? `${title}...` : title;
  }
  return 'New Conversation';
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // State
      currentMessages: [],
      isLoading: false,
      sessions: [],
      currentSessionId: null,
      dailyQueries: 0,
      lastQueryDate: getToday(),

      // Actions
      addMessage: (message: ChatMessage) => {
        set((state) => ({
          currentMessages: [...state.currentMessages, message],
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearCurrentChat: () => {
        // Save current session if it has messages
        const { currentMessages } = get();
        if (currentMessages.length > 0) {
          get().saveCurrentSession();
        }

        set({
          currentMessages: [],
          currentSessionId: null,
        });
      },

      saveCurrentSession: (title?: string) => {
        const { currentMessages, currentSessionId, sessions } = get();

        if (currentMessages.length === 0) return;

        const now = new Date().toISOString();
        const sessionTitle = title || generateSessionTitle(currentMessages);

        if (currentSessionId) {
          // Update existing session
          set({
            sessions: sessions.map((s) =>
              s.id === currentSessionId
                ? { ...s, messages: currentMessages, updatedAt: now }
                : s
            ),
          });
        } else {
          // Create new session
          const newSession: ChatSession = {
            id: generateSessionId(),
            title: sessionTitle,
            messages: currentMessages,
            createdAt: now,
            updatedAt: now,
          };

          set({
            sessions: [newSession, ...sessions].slice(0, 50), // Keep last 50 sessions
            currentSessionId: newSession.id,
          });
        }
      },

      loadSession: (sessionId: string) => {
        const { sessions } = get();
        const session = sessions.find((s) => s.id === sessionId);

        if (session) {
          set({
            currentMessages: session.messages,
            currentSessionId: sessionId,
          });
        }
      },

      deleteSession: (sessionId: string) => {
        const { sessions, currentSessionId } = get();

        set({
          sessions: sessions.filter((s) => s.id !== sessionId),
          // Clear current if deleting active session
          ...(currentSessionId === sessionId && {
            currentMessages: [],
            currentSessionId: null,
          }),
        });
      },

      incrementQueryCount: (): boolean => {
        const { dailyQueries, lastQueryDate } = get();
        const today = getToday();

        // Reset count if new day
        if (lastQueryDate !== today) {
          set({ dailyQueries: 1, lastQueryDate: today });
          return true;
        }

        // Check limit
        if (dailyQueries >= ANTHROPIC_CONFIG.dailyFreeQueries) {
          return false;
        }

        set({ dailyQueries: dailyQueries + 1 });
        return true;
      },

      canMakeQuery: (): boolean => {
        const { dailyQueries, lastQueryDate } = get();
        const today = getToday();

        if (lastQueryDate !== today) {
          return true; // New day, reset
        }

        return dailyQueries < ANTHROPIC_CONFIG.dailyFreeQueries;
      },

      getRemainingQueries: (): number => {
        const { dailyQueries, lastQueryDate } = get();
        const today = getToday();

        if (lastQueryDate !== today) {
          return ANTHROPIC_CONFIG.dailyFreeQueries;
        }

        return Math.max(0, ANTHROPIC_CONFIG.dailyFreeQueries - dailyQueries);
      },

      resetDailyLimit: () => {
        set({ dailyQueries: 0, lastQueryDate: getToday() });
      },
    }),
    {
      name: 'revert-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        dailyQueries: state.dailyQueries,
        lastQueryDate: state.lastQueryDate,
      }),
    }
  )
);

// Selectors
export const useChatMessages = () => useChatStore((state) => state.currentMessages);
export const useChatSessions = () => useChatStore((state) => state.sessions);
export const useIsLoading = () => useChatStore((state) => state.isLoading);

export default useChatStore;
