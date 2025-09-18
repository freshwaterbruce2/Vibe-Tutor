import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let lastMessage = '';

export const getMotivationalMessage = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a short, punchy motivational quote for a student who is studying hard. It should be one sentence. Make it unique and not a common cliche. For context, the last quote was: "${lastMessage}". Provide a different one.`,
            config: {
                temperature: 0.9,
                topP: 1,
                topK: 1,
                maxOutputTokens: 50,
                thinkingConfig: { thinkingBudget: 0 } // low latency for quick quotes
            },
        });

        const message = response.text.trim().replace(/^"|"$/g, ''); // Remove quotes
        if (message) {
          lastMessage = message;
          return message;
        }
        return "Keep up the great work!";

    } catch (error) {
        console.error("Error getting motivational message:", error);
        return "You're doing an amazing job. Keep going!";
    }
};
