// Secure client that communicates with backend proxy
// No API keys stored client-side

import API_CONFIG from '../src/config';
import { CapacitorHttp } from '@capacitor/core';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  response_format?: any;
  retryCount?: number;
  fallbackMessage?: string;
}

class SecureAPIClient {
  private baseURL: string;
  private sessionToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Use configuration for API URL that works on mobile
    this.baseURL = API_CONFIG.baseURL;
    console.log('API Client initialized with URL:', this.baseURL);
  }

  private async initSession(): Promise<void> {
    try {
      console.log('[DEBUG] Initializing session with URL:', `${this.baseURL}${API_CONFIG.endpoints.initSession}`);
      const response = await CapacitorHttp.request({
        url: `${this.baseURL}${API_CONFIG.endpoints.initSession}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('[DEBUG] Session init response status:', response.status);
      if (response.status !== 200) {
        throw new Error('Failed to initialize session');
      }

      const data = response.data;
      console.log('[DEBUG] Session data received:', { token: data.token.substring(0, 8) + '...', expiresIn: data.expiresIn });
      this.sessionToken = data.token;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000);

      // Store token securely in sessionStorage (not localStorage)
      sessionStorage.setItem('vibetutor_session', this.sessionToken);
      sessionStorage.setItem('vibetutor_expiry', String(this.tokenExpiry));
      console.log('[DEBUG] Session stored in sessionStorage');

    } catch (error) {
      console.error('[DEBUG] Session initialization failed:', error);
      throw error;
    }
  }

  private async ensureValidSession(): Promise<void> {
    // Check if we have a valid session
    if (!this.sessionToken || Date.now() >= this.tokenExpiry) {
      // Try to restore from sessionStorage first
      const storedToken = sessionStorage.getItem('vibetutor_session');
      const storedExpiry = sessionStorage.getItem('vibetutor_expiry');

      if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
        this.sessionToken = storedToken;
        this.tokenExpiry = Number(storedExpiry);
      } else {
        // Initialize new session
        await this.initSession();
      }
    }
  }

  async chatCompletion(messages: DeepSeekMessage[], options: ChatOptions = {}): Promise<any> {
    console.log('[DEBUG] Starting chat completion, messages:', messages.length, 'options:', options);
    await this.ensureValidSession();
    console.log('[DEBUG] Session validated, token exists:', !!this.sessionToken);

    const maxRetries = options.retryCount || 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log('[DEBUG] Attempt', attempt, 'of', maxRetries);

        const requestBody = { messages, options };
        console.log('[DEBUG] Sending request to:', `${this.baseURL}${API_CONFIG.endpoints.chat}`);
        console.log('[DEBUG] Request body:', JSON.stringify(requestBody, null, 2));

        const response = await CapacitorHttp.request({
          url: `${this.baseURL}${API_CONFIG.endpoints.chat}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sessionToken}`
          },
          data: requestBody,
          connectTimeout: 30000,
          readTimeout: 30000
        });

        console.log('[DEBUG] Response status:', response.status);

        if (response.status === 401) {
          // Session expired, reinitialize
          await this.initSession();
          continue;
        }

        if (response.status === 429) {
          // Rate limited
          const retryAfter = response.data.retryAfter || 60;
          console.warn(`Rate limited. Retry after ${retryAfter} seconds`);

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            continue;
          }
        }

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`API error: ${response.status}`);
        }

        return response.data;

      } catch (error) {
        lastError = error as Error;

        // ENHANCED ERROR LOGGING
        console.error(`[DEBUG] Attempt ${attempt} failed:`, {
          errorName: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : String(error),
          url: `${this.baseURL}${API_CONFIG.endpoints.chat}`,
          hasToken: !!this.sessionToken
        });

        if (error instanceof Error && error.name === 'AbortError') {
          console.error('[DEBUG] Request timeout after 30s');
        }

        // Log network errors specifically
        if (error instanceof Error) {
          console.error('[DEBUG] Network error - check backend accessibility');
          console.error('[DEBUG] Backend URL:', this.baseURL);
          console.error('[DEBUG] Protocol:', window.location.protocol);
          console.error('[DEBUG] Error details:', error.message);
        }

        if (attempt < maxRetries) {
          // Exponential backoff
          const backoff = Math.min(Math.pow(2, attempt - 1) * 1000, 10000);
          console.log(`[DEBUG] Retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    console.error('[DEBUG] All retries exhausted. Final error:', lastError);
    throw lastError || new Error('Request failed after all retries');
  }

  async getUsageStats(): Promise<any> {
    if (!this.sessionToken) {
      return null;
    }

    try {
      const response = await CapacitorHttp.request({
        url: `${this.baseURL}/api/stats/${this.sessionToken}`,
        method: 'GET'
      });
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  }
}

// Create singleton instance
export const secureClient = new SecureAPIClient();

// Helper function for chat completions
export async function createChatCompletion(
  messages: DeepSeekMessage[],
  options: ChatOptions = {}
): Promise<string | null> {
  try {
    const response = await secureClient.chatCompletion(messages, options);

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      return options.fallbackMessage || null;
    }

    return content;
  } catch (error) {
    console.error('Chat completion error:', error);

    // Check if we're offline
    if (!navigator.onLine) {
      return "I'm currently offline. Please check your internet connection and try again.";
    }

    // Return fallback message
    return options.fallbackMessage || "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export type { DeepSeekMessage };
export { secureClient as deepseekClient };