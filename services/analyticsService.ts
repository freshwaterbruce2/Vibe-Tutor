import { GoogleGenAI } from "@google/genai";
import type { HomeworkItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProgressReport = async (items: HomeworkItem[], focusSessions: number): Promise<string> => {
    const completedTasks = items.filter(i => i.completed).length;
    const totalTasks = items.length;
    const subjects = [...new Set(items.map(i => i.subject))];

    const prompt = `
    Analyze the following student progress data and generate a brief, encouraging report for a parent.
    The report should be 2-3 paragraphs.
    - Start with a positive summary.
    - Mention the number of completed tasks vs. total tasks.
    - Mention the number of focus sessions completed.
    - Mention the subjects the student is working on.
    - Conclude with an encouraging note.

    Data:
    - Total homework assignments: ${totalTasks}
    - Completed assignments: ${completedTasks}
    - Subjects covered: ${subjects.join(', ')}
    - Focus sessions completed: ${focusSessions}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating progress report:", error);
        return "Could not generate a report at this time. Please check the raw data for progress.";
    }
};
