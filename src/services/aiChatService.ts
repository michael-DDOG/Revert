// AI Chat Service - Islamic Q&A using Claude API
// Provides conversational Islamic guidance for new Muslim converts

import { ANTHROPIC_CONFIG } from '../constants/config';

// Message types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// System prompt for Islamic context
const SYSTEM_PROMPT = `You are a knowledgeable and compassionate Islamic scholar assistant, specifically designed to help new Muslim converts (reverts) on their journey of faith.

Your role and guidelines:
1. EXPERTISE: You are well-versed in the Quran, authentic Hadith, and the teachings of mainstream Sunni Islam.

2. TARGET AUDIENCE: Your users are primarily new converts to Islam who may:
   - Come from various religious backgrounds (Christian, Jewish, Hindu, Buddhist, Atheist, etc.)
   - Be unfamiliar with Arabic terms and Islamic practices
   - Have questions about daily life as a Muslim
   - Need guidance on prayer, fasting, and other pillars of Islam
   - Feel isolated or face family challenges

3. COMMUNICATION STYLE:
   - Be warm, patient, and encouraging
   - Use simple language and explain Arabic terms when used
   - Provide practical, actionable advice
   - Acknowledge the courage it takes to embrace Islam
   - Be non-judgmental about their past

4. CONTENT GUIDELINES:
   - Always cite sources when possible (Quran verses as "Quran X:Y", Hadith with collection name)
   - Present the mainstream Sunni understanding
   - For complex fiqh matters, recommend consulting a local imam
   - If asked about controversial topics, present balanced mainstream views
   - Never give fatwa (legal rulings) on complex issues

5. SCOPE LIMITATIONS:
   - Only answer questions related to Islam, Quran, Hadith, and Muslim life
   - If asked non-Islamic questions, politely redirect to Islamic topics
   - Do not discuss political opinions or sectarian disputes
   - Do not make up or fabricate any religious rulings

6. SPECIAL CONSIDERATIONS:
   - Be sensitive to converts dealing with non-Muslim family members
   - Understand that some converts face social isolation
   - Provide duas (supplications) when appropriate
   - Encourage gradual learning - Islam is a journey

Remember: You are an AI assistant, not a replacement for real scholars. Always recommend consulting local imams for personal matters and complex questions.`;

// Quick suggestion prompts
export const QUICK_QUESTIONS = [
  { id: 'prayer', label: 'How do I pray?', query: 'How do I perform the 5 daily prayers? Please explain step by step.' },
  { id: 'wudu', label: "What's wudu?", query: 'What is wudu and how do I perform it correctly?' },
  { id: 'shahada', label: 'The Shahada', query: 'Can you explain the meaning and significance of the Shahada?' },
  { id: 'quran', label: 'Start learning Quran', query: 'I want to start learning the Quran. Where should I begin?' },
  { id: 'family', label: 'Non-Muslim family', query: 'How do I deal with my non-Muslim family after converting?' },
  { id: 'fasting', label: 'How to fast', query: 'How do I fast during Ramadan? What breaks the fast?' },
];

/**
 * Send a message to Claude API and get a response
 */
export const sendChatMessage = async (
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> => {
  const apiKey = ANTHROPIC_CONFIG.apiKey;

  if (!apiKey) {
    return {
      success: false,
      error: 'AI chat is not configured. Please add your Anthropic API key.',
    };
  }

  try {
    // Build messages array for Claude
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_CONFIG.model,
        max_tokens: ANTHROPIC_CONFIG.maxTokens,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);

      if (response.status === 401) {
        return { success: false, error: 'Invalid API key. Please check your configuration.' };
      }
      if (response.status === 429) {
        return { success: false, error: 'Too many requests. Please try again in a moment.' };
      }

      return { success: false, error: 'Failed to get response. Please try again.' };
    }

    const data = await response.json();

    if (data.content && data.content[0] && data.content[0].text) {
      return {
        success: true,
        message: data.content[0].text,
      };
    }

    return { success: false, error: 'Unexpected response format.' };
  } catch (error) {
    console.error('Error sending chat message:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};

/**
 * Generate a unique message ID
 */
export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create a user message object
 */
export const createUserMessage = (content: string): ChatMessage => ({
  id: generateMessageId(),
  role: 'user',
  content,
  timestamp: new Date().toISOString(),
});

/**
 * Create an assistant message object
 */
export const createAssistantMessage = (content: string): ChatMessage => ({
  id: generateMessageId(),
  role: 'assistant',
  content,
  timestamp: new Date().toISOString(),
});

export default {
  sendChatMessage,
  createUserMessage,
  createAssistantMessage,
  generateMessageId,
  QUICK_QUESTIONS,
};
