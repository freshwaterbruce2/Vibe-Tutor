/**
 * Buddy Role-Play Scenarios
 * Structured social interaction practice with safety guardrails
 */

export type ScenarioCategory = 'greeting' | 'conversation' | 'conflict' | 'group' | 'online';

export interface RolePlayScenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  context: string;
  yourRole: string;
  otherRole: string;
  goal: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skillsTaught: string[];
  safetyBoundaries: string[];
  reflectionPrompts: string[];
}

export const SCENARIOS: RolePlayScenario[] = [
  {
    id: 'greeting-classmate',
    category: 'greeting',
    title: 'Greeting a Classmate',
    description: 'Practice saying hi to someone you know from class',
    context: 'You see a classmate from your math class in the hallway. You\'ve worked together on a project before, but you don\'t usually talk outside of class.',
    yourRole: 'You',
    otherRole: 'Classmate (Alex)',
    goal: 'Start a brief, friendly conversation',
    difficulty: 'easy',
    skillsTaught: ['Initiating conversation', 'Small talk', 'Reading social cues'],
    safetyBoundaries: [
      'Keep it brief and casual',
      'It\'s okay if they seem busy',
      'No pressure to become best friends',
    ],
    reflectionPrompts: [
      'How did it feel to start the conversation?',
      'What went well?',
      'What would you do differently next time?',
    ],
  },
  {
    id: 'joining-conversation',
    category: 'group',
    title: 'Joining a Group Conversation',
    description: 'Learn when and how to join people who are already talking',
    context: 'It\'s lunch time. You see a group of 3-4 people you know talking and laughing near the cafeteria. You want to join them.',
    yourRole: 'You',
    otherRole: 'Group of friends',
    goal: 'Join the conversation naturally without interrupting',
    difficulty: 'medium',
    skillsTaught: ['Timing', 'Group dynamics', 'Non-verbal cues', 'Finding entry points'],
    safetyBoundaries: [
      'Wait for a natural pause',
      'It\'s okay to just listen at first',
      'If they seem deep in conversation, it\'s fine to wait or come back later',
    ],
    reflectionPrompts: [
      'How did you know when to join in?',
      'What signals did you notice from the group?',
      'Did you feel welcomed? Why or why not?',
    ],
  },
  {
    id: 'misunderstanding-friend',
    category: 'conflict',
    title: 'Clearing Up a Misunderstanding',
    description: 'Practice addressing when a friend seems upset with you',
    context: 'Your friend has been acting distant for the past few days. They\'ve been short with you and haven\'t responded to your messages like they usually do. You\'re not sure what happened.',
    yourRole: 'You',
    otherRole: 'Friend (Jordan)',
    goal: 'Gently ask what\'s wrong and listen to their perspective',
    difficulty: 'hard',
    skillsTaught: ['Conflict resolution', 'Active listening', 'Empathy', 'Taking responsibility'],
    safetyBoundaries: [
      'Stay calm and non-defensive',
      'Listen more than you explain',
      'It\'s okay to say "I didn\'t realize that hurt you"',
      'Not all conflicts resolve immediately',
    ],
    reflectionPrompts: [
      'How did you approach the situation?',
      'What did you learn about your friend\'s perspective?',
      'What could help prevent this in the future?',
    ],
  },
  {
    id: 'sharing-interest',
    category: 'conversation',
    title: 'Sharing Your Interest',
    description: 'Practice talking about something you care about without over-sharing',
    context: 'Someone asks you about your weekend. You spent most of it doing something you really enjoy (gaming, reading, a hobby, etc.). You want to share but also keep them engaged.',
    yourRole: 'You',
    otherRole: 'Acquaintance (Sam)',
    goal: 'Share your interest while reading their engagement level',
    difficulty: 'medium',
    skillsTaught: ['Balanced conversation', 'Reading interest cues', 'Asking follow-up questions'],
    safetyBoundaries: [
      'Watch for signs they\'re interested or losing interest',
      'Pause to let them respond',
      'Ask about their weekend too',
      'It\'s okay if they don\'t share your interest',
    ],
    reflectionPrompts: [
      'Did they seem interested in what you shared?',
      'How did you balance talking and listening?',
      'What cues did you notice about their engagement?',
    ],
  },
  {
    id: 'online-group-chat',
    category: 'online',
    title: 'Joining an Online Group Chat',
    description: 'Practice entering an ongoing group chat conversation',
    context: 'You\'re in a Discord/group chat with people from school. There\'s an active conversation happening about weekend plans. You want to join in.',
    yourRole: 'You',
    otherRole: 'Group chat members',
    goal: 'Join the conversation naturally in a text-based setting',
    difficulty: 'easy',
    skillsTaught: ['Online communication', 'Timing in text', 'Group chat etiquette'],
    safetyBoundaries: [
      'Read the last few messages first',
      'It\'s okay to just react with an emoji at first',
      'Don\'t feel pressure to respond to everything',
      'Online conversations move fast - that\'s normal',
    ],
    reflectionPrompts: [
      'How is online conversation different from in-person?',
      'What made it easier or harder?',
      'Did you feel included?',
    ],
  },
];

/**
 * Get scenario by ID
 */
export function getScenario(id: string): RolePlayScenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}

/**
 * Get scenarios by category
 */
export function getScenariosByCategory(category: ScenarioCategory): RolePlayScenario[] {
  return SCENARIOS.filter(s => s.category === category);
}

/**
 * Get scenarios by difficulty
 */
export function getScenariosByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): RolePlayScenario[] {
  return SCENARIOS.filter(s => s.difficulty === difficulty);
}

/**
 * Get random scenario
 */
export function getRandomScenario(category?: ScenarioCategory): RolePlayScenario {
  const pool = category ? getScenariosByCategory(category) : SCENARIOS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate system prompt for role-play scenario
 */
export function generateScenarioPrompt(scenario: RolePlayScenario): string {
  return `You are Vibe, helping a high school student practice social interactions through role-play.

CURRENT SCENARIO: ${scenario.title}
Context: ${scenario.context}

YOUR ROLE: You are playing "${scenario.otherRole}"
Student's Role: ${scenario.yourRole}
Goal: ${scenario.goal}

SKILLS BEING PRACTICED:
${scenario.skillsTaught.map(skill => `- ${skill}`).join('\n')}

SAFETY BOUNDARIES (important reminders for the student):
${scenario.safetyBoundaries.map(boundary => `- ${boundary}`).join('\n')}

HOW TO PLAY THIS ROLE:
1. Stay in character as ${scenario.otherRole}
2. Respond naturally as this person would
3. Give realistic reactions (positive, neutral, or mildly negative as appropriate)
4. Provide subtle cues about how the interaction is going
5. Don't make it too easy or too hard - be realistic
6. If the student seems stuck, gently guide them
7. After 3-5 exchanges, offer to move to reflection

TONE:
- Natural and realistic (not overly positive or negative)
- Age-appropriate for high school
- Helpful but not preachy
- Keep responses brief (2-4 sentences usually)

Remember: This is practice. The goal is learning, not perfection.`;
}

/**
 * Generate reflection prompt after role-play
 */
export function generateReflectionPrompt(scenario: RolePlayScenario): string {
  return `Great job practicing! Let's reflect on that interaction.

${scenario.reflectionPrompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n')}

Take your time. There are no wrong answers - this is about learning what works for you.`;
}

/**
 * Track scenario progress
 */
export interface ScenarioProgress {
  scenarioId: string;
  completedAt: number;
  reflectionNotes?: string;
  skillsRating: number; // 1-5 self-rating
}

const PROGRESS_STORAGE_KEY = 'buddy-scenario-progress';

export function saveScenarioProgress(progress: ScenarioProgress): void {
  try {
    const existing = getScenarioProgress();
    existing.push(progress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save scenario progress:', error);
  }
}

export function getScenarioProgress(): ScenarioProgress[] {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to load scenario progress:', error);
    return [];
  }
}

export function getCompletedScenarios(): string[] {
  return getScenarioProgress().map(p => p.scenarioId);
}
