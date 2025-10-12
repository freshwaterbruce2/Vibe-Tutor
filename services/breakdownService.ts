import { createChatCompletion } from './secureClient';
import { usageMonitor } from './usageMonitor';

const breakdownSchema = {
    type: "object",
    properties: {
        steps: {
            type: "array",
            description: "A list of actionable, small steps to complete the homework task.",
            items: {
                type: "string"
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
    
    const fallbackSteps = [
        `Start by reading and understanding the ${subject} topic`,
        "Gather all necessary materials and resources",
        "Break the work into 25-minute focused sessions",
        "Take notes on key concepts as you work",
        "Review and organize your completed work",
        "Double-check for accuracy and completion"
    ];

    try {
        const prompt = `Break down the following homework task into a series of small, manageable steps.
        Task: "${taskTitle}"
        Subject: "${subject}"
        Provide the steps as a simple list of strings.`;

        const response = await createChatCompletion([
            {
                role: 'user',
                content: prompt
            }
        ], {
            model: "deepseek-chat",
            temperature: 0.3,
            retryCount: 2,
        });

        const jsonString = response?.trim();
        if (jsonString) {
            try {
                const parsed = JSON.parse(jsonString);
                const steps = parsed.steps || fallbackSteps;
                if (steps.length > 0) {
                     try {
                        sessionStorage.setItem(cacheKey, JSON.stringify(steps));
                     } catch (e) {
                         console.error("Error writing to sessionStorage", e);
                     }
                }
                return steps;
            } catch (parseError) {
                console.error("Error parsing JSON response:", parseError);
                return fallbackSteps;
            }
        }
        return fallbackSteps;

    } catch (error) {
        console.error("Error breaking down task with DeepSeek:", error);
        return fallbackSteps;
    }
};