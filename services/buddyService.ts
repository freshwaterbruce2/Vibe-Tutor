import { createChatCompletion, type DeepSeekMessage } from './secureClient';
import { AI_FRIEND_PROMPT } from '../constants';
import { usageMonitor } from './usageMonitor';

const conversationHistory: DeepSeekMessage[] = [
    { role: 'system', content: AI_FRIEND_PROMPT }
];

export const sendMessageToBuddy = async (message: string): Promise<string> => {
    try {
        // Check usage limits before making request
        const canRequest = usageMonitor.canMakeRequest();
        if (!canRequest.allowed) {
            return canRequest.reason || "Usage limit reached. Please try again later.";
        }

        conversationHistory.push({ role: 'user', content: message });

        const response = await createChatCompletion(conversationHistory, {
            model: 'deepseek-chat',
            temperature: 0.8,
            top_p: 0.95,
        });

        const assistantMessage = response || "Sorry, I'm having a little trouble connecting right now. Let's talk later.";

        conversationHistory.push({ role: 'assistant', content: assistantMessage });

        // Record successful request
        usageMonitor.recordRequest();

        return assistantMessage;
    } catch (error) {
        console.error("Error sending message to buddy:", error);
        return "Sorry, I'm having a little trouble connecting right now. Let's talk later.";
    }
};

export const getMoodAnalysis = async (mood: string, note?: string): Promise<string> => {
    const prompt = `A user has logged their mood as "${mood}". ${note ? `They added this note: "${note}".` : ''}
    Provide a short (2-3 sentences), gentle, and supportive reflection. Acknowledge their feeling and offer a word of encouragement.
    Do not give medical advice. Keep it brief and kind.`;

    try {
        const response = await createChatCompletion([
            {
                role: 'user',
                content: prompt
            }
        ], {
            model: 'deepseek-chat',
            temperature: 0.7,
            max_tokens: 100,
        });
        return response || "It's okay to feel your feelings. Be kind to yourself today.";
    } catch (error) {
        console.error("Error getting mood analysis:", error);
        return "It's okay to feel your feelings. Be kind to yourself today.";
    }
};