/**
 * Assistant Client Service
 * Proxies conversation buddy chat to IPC bridge or backend
 */

import type { IPCMessage } from '../../packages/vibetech-shared/src/ipc-protocol';

const IPC_BRIDGE_URL = 'ws://localhost:5004';
const FALLBACK_ENABLED = true;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

const ASSISTANT_SYSTEM_PROMPT = `You are a friendly AI buddy for a 13-year-old boy with level 1 autism (high-functioning). Your role is to:

- Talk about his interests, especially Roblox and games
- Help with homework by making it relatable to his interests
- Teach life skills through conversation (chores, morning/evening routines, time management)
- Build social skills through supportive dialogue
- Use direct, literal language (no idioms or sarcasm)
- Keep responses to 2-3 sentences max (executive function support)
- Use 1-2 emojis only when natural (sensory awareness)
- Be patient, encouraging, and non-judgmental
- Connect learning to Roblox mechanics when relevant (e.g., "Completing chores is like earning Robux - you level up your real-life skills!")

Communication style:
- Bullet points over paragraphs
- One question at a time
- Celebrate small wins
- Relate abstract concepts to concrete Roblox examples

Remember: You're a supportive friend helping him build confidence and independence while respecting his neurodivergent needs.`;

// Chat history storage
const CHAT_HISTORY_KEY = 'conversation_buddy_history';
const MAX_HISTORY_LENGTH = 20; // Keep last 20 messages for context

function getChatHistory(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [
      {
        role: 'system',
        content: ASSISTANT_SYSTEM_PROMPT,
        timestamp: Date.now(),
      },
    ];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [
      {
        role: 'system',
        content: ASSISTANT_SYSTEM_PROMPT,
        timestamp: Date.now(),
      },
    ];
  }
}

function saveChatHistory(history: ChatMessage[]): void {
  try {
    // Keep only last MAX_HISTORY_LENGTH messages (plus system prompt)
    const systemMsg = history.find(m => m.role === 'system');
    const recentMessages = history
      .filter(m => m.role !== 'system')
      .slice(-MAX_HISTORY_LENGTH);

    const toSave = systemMsg ? [systemMsg, ...recentMessages] : recentMessages;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
}

// IPC Bridge WebSocket client
let ws: WebSocket | null = null;
let wsConnected = false;
let pendingRequests = new Map<string, (response: string) => void>();

function connectToBridge(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (wsConnected && ws && ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }

    try {
      ws = new WebSocket(IPC_BRIDGE_URL);

      ws.onopen = () => {
        console.log('[Assistant Client] Connected to IPC Bridge');
        wsConnected = true;
        resolve();
      };

      ws.onmessage = (event) => {
        try {
          const message: IPCMessage = JSON.parse(event.data);

          if (message.type === 'ASSISTANT_RESPONSE' && message.payload) {
            const { requestId, response } = message.payload as any;
            const callback = pendingRequests.get(requestId);
            if (callback) {
              callback(response);
              pendingRequests.delete(requestId);
            }
          }
        } catch (error) {
          console.error('[Assistant Client] Failed to parse message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[Assistant Client] WebSocket error:', error);
        wsConnected = false;
        reject(error);
      };

      ws.onclose = () => {
        console.log('[Assistant Client] Disconnected from IPC Bridge');
        wsConnected = false;
      };
    } catch (error) {
      console.error('[Assistant Client] Failed to connect:', error);
      reject(error);
    }
  });
}

function sendToBridge(userMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ws || !wsConnected) {
      reject(new Error('Not connected to IPC Bridge'));
      return;
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const history = getChatHistory();

    const message: IPCMessage = {
      source: 'Vibe-Tutor',
      type: 'ASSISTANT_REQUEST',
      timestamp: Date.now(),
      payload: {
        requestId,
        userMessage,
        chatHistory: history.map(m => ({ role: m.role, content: m.content })),
      },
    };

    pendingRequests.set(requestId, resolve);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }
    }, 30000);

    ws.send(JSON.stringify(message));
  });
}

// Fallback: Use existing secure client (DeepSeek backend proxy)
async function sendToBackendFallback(userMessage: string): Promise<string> {
  try {
    const history = getChatHistory();
    const messages = history.map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Backend request failed');
    }

    const data = await response.json();
    return data.message || 'Sorry, I had trouble understanding that. Can you try again?';
  } catch (error) {
    console.error('[Assistant Client] Backend fallback error:', error);
    return "I'm having trouble connecting right now. Let's try again in a moment!";
  }
}

// Public API
export async function sendMessageToAssistant(userMessage: string): Promise<string> {
  const history = getChatHistory();

  // Add user message to history
  history.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
  });

  let assistantResponse: string;

  try {
    // Try IPC Bridge first
    await connectToBridge();
    assistantResponse = await sendToBridge(userMessage);
  } catch (error) {
    console.warn('[Assistant Client] IPC Bridge unavailable, using fallback:', error);

    if (FALLBACK_ENABLED) {
      assistantResponse = await sendToBackendFallback(userMessage);
    } else {
      assistantResponse = "I'm offline right now, but I'll be back soon! Try asking me again later.";
    }
  }

  // Add assistant response to history
  history.push({
    role: 'assistant',
    content: assistantResponse,
    timestamp: Date.now(),
  });

  saveChatHistory(history);
  return assistantResponse;
}

export function getConversationHistory(): ChatMessage[] {
  return getChatHistory().filter(m => m.role !== 'system');
}

export function clearConversationHistory(): void {
  const systemMsg: ChatMessage = {
    role: 'system',
    content: ASSISTANT_SYSTEM_PROMPT,
    timestamp: Date.now(),
  };
  saveChatHistory([systemMsg]);
}
