// Secure fetch-based DeepSeek API client for browser use
// No API keys exposed to client-side code

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  response_format?: {
    type: string;
    json_schema?: {
      name: string;
      schema: any;
    };
  };
}

class DeepSeekClient {
  private apiKey: string | null;
  private baseURL: string = 'https://api.deepseek.com';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async chatCompletion(request: DeepSeekRequest, retryCount = 3): Promise<DeepSeekResponse> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();

          // Don't retry on authentication errors
          if (response.status === 401 || response.status === 403) {
            throw new Error(`DeepSeek API authentication error: ${errorText}`);
          }

          // Don't retry on client errors (except rate limiting)
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`DeepSeek API client error (${response.status}): ${errorText}`);
          }

          throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();

      } catch (error) {
        const isLastAttempt = attempt === retryCount;

        if (error instanceof Error) {
          // Don't retry on authentication or client errors
          if (error.message.includes('authentication') || error.message.includes('client error')) {
            throw error;
          }

          if (isLastAttempt) {
            throw new Error(`DeepSeek API request failed after ${retryCount} attempts: ${error.message}`);
          }

          // Exponential backoff: 1s, 2s, 4s
          const backoffMs = Math.pow(2, attempt - 1) * 1000;
          await this.delay(backoffMs);
        } else {
          if (isLastAttempt) {
            throw new Error(`Unknown error occurred while calling DeepSeek API after ${retryCount} attempts`);
          }
          await this.delay(1000);
        }
      }
    }

    throw new Error('DeepSeek API request failed after all retry attempts');
  }
}

// Create singleton instance
export const deepseekClient = new DeepSeekClient(process.env.API_KEY);

// Helper function for chat completions with enhanced error handling
export async function createChatCompletion(
  messages: DeepSeekMessage[],
  options: {
    model?: string;
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    response_format?: DeepSeekRequest['response_format'];
    retryCount?: number;
    fallbackMessage?: string;
  } = {}
): Promise<string | null> {
  try {
    const response = await deepseekClient.chatCompletion({
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.95,
      max_tokens: options.max_tokens,
      response_format: options.response_format,
    }, options.retryCount || 3);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return options.fallbackMessage || null;
    }

    return content;
  } catch (error) {
    console.error('DeepSeek API error:', error);

    // Return fallback message if provided, otherwise null
    return options.fallbackMessage || null;
  }
}

export type { DeepSeekMessage };