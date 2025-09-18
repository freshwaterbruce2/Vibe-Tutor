import { GoogleGenAI, Chat } from "@google/genai";
import { AI_FRIEND_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let buddyChat: Chat | null = null;

const getBuddyChat = (): Chat => {
    if (!buddyChat) {
        buddyChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: AI_FRIEND_PROMPT,
                temperature: 0.8,
                topP: 0.95,
            },
        });
    }
    return buddyChat;
};

export const sendMessageToBuddy = async (message: string): Promise<string> => {
    try {
        const chat = getBuddyChat();
        const response = await chat.sendMessage({ message });
        return response.text;
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 100,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting mood analysis:", error);
        return "It's okay to feel your feelings. Be kind to yourself today.";
    }
};
