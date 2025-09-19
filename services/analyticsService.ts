import { GoogleGenAI } from "@google/genai";
import type { HomeworkItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProgressReport = async (
    items: HomeworkItem[], 
    focusSessions: number,
    points: number,
    subjectStats: Record<string, { total: number, completed: number }>
): Promise<string> => {
    const completedTasks = items.filter(i => i.completed).length;
    const totalTasks = items.length;

    const subjectDataForPrompt = Object.entries(subjectStats).map(([subject, stats]) => 
        `${subject}: ${stats.completed}/${stats.total} completed`
    ).join('; ');

    const prompt = `
    Analyze the following student progress data and generate a brief, encouraging report (2-3 paragraphs) for a parent.
    Use a friendly and positive tone.

    Data:
    - Total homework assignments: ${totalTasks}
    - Completed assignments: ${completedTasks}
    - Total student points earned: ${points}
    - Focus sessions completed: ${focusSessions}
    - Breakdown by subject: ${subjectDataForPrompt}

    Instructions:
    1.  Start with a positive and encouraging summary of the student's overall effort.
    2.  Mention the total points earned as a great indicator of their hard work.
    3.  Comment on their focus sessions as a sign of dedication.
    4.  Review the subject breakdown. Highlight subjects where the completion rate is high as areas of strength.
    5.  If any subject has a completion rate below 60%, gently mention it as an area that might benefit from a little extra attention, without being negative.
    6.  Conclude with an uplifting and forward-looking note.
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