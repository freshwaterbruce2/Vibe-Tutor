import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const breakdownSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            description: "A list of actionable, small steps to complete the homework task.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['steps']
};

export const breakDownTask = async (taskTitle: string, subject: string): Promise<string[]> => {
    const cacheKey = `breakdown_${subject}_${taskTitle}`.toLowerCase().replace(/\s/g, '');
    
    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {
        console.error("Error reading from sessionStorage", e);
    }
    
    try {
        const prompt = `Break down the following homework task into a series of small, manageable steps.
        Task: "${taskTitle}"
        Subject: "${subject}"
        Provide the steps as a simple list of strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: breakdownSchema,
            },
        });

        const jsonString = response.text.trim();
        if (jsonString) {
            const parsed = JSON.parse(jsonString);
            const steps = parsed.steps || [];
            if (steps.length > 0) {
                 try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(steps));
                 } catch (e) {
                     console.error("Error writing to sessionStorage", e);
                 }
            }
            return steps;
        }
        return [];

    } catch (error) {
        console.error("Error breaking down task with Gemini:", error);
        return [];
    }
};