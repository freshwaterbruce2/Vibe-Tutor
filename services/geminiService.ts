import { GoogleGenAI, Type } from "@google/genai";
import type { ParsedHomework } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parsingSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: 'The subject of the homework, e.g., Math, Science.' },
        title: { type: Type.STRING, description: 'The specific assignment title, e.g., "Chapter 5 Reading", "Algebra Worksheet".' },
        dueDate: { type: Type.STRING, description: 'The due date in YYYY-MM-DD format.' },
    },
    required: ['subject', 'title', 'dueDate']
};

export const parseHomeworkFromVoice = async (transcript: string): Promise<ParsedHomework | null> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const prompt = `Parse the following user transcript to extract homework details. The current date is ${today}.
        - The subject should be a school subject.
        - The title is the description of the task.
        - The due date must be converted to YYYY-MM-DD format. "Tomorrow" means one day after today. "Next Friday" means the upcoming Friday.
        
        Transcript: "${transcript}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: parsingSchema,
            },
        });
        
        const jsonString = response.text.trim();
        if (jsonString) {
            const parsed = JSON.parse(jsonString);
            return {
                subject: parsed.subject || '',
                title: parsed.title || '',
                dueDate: parsed.dueDate || '',
            };
        }
        return null;
    } catch (error) {
        console.error("Error parsing homework with Gemini:", error);
        return null;
    }
};