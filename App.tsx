import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeworkDashboard from './components/HomeworkDashboard';
import ChatWindow from './components/ChatWindow';
import FocusTimer from './components/FocusTimer';
import ParentDashboard from './components/ParentDashboard';
import AchievementCenter from './components/AchievementCenter';
import AchievementPopup from './components/AchievementPopup';
import type { View, HomeworkItem, ParsedHomework, Achievement } from './types';
import { sendMessageToBuddy } from './services/buddyService';
import { getAchievements, checkAndUnlockAchievements, AchievementEvent } from './services/achievementService';
import { AI_TUTOR_PROMPT } from './constants';
import { GoogleGenAI, Chat } from "@google/genai";

// A simple ID generator
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock initial data
const initialHomework: HomeworkItem[] = [
  { id: generateId(), subject: 'Math', title: 'Algebra II Worksheet', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
  { id: generateId(), subject: 'History', title: 'Read Chapter 5: The Roman Empire', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
  { id: generateId(), subject: 'Science', title: 'Lab Report on Photosynthesis', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
];


// START: Inlined tutorService to avoid creating a new file as per project constraints.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let tutorChat: Chat | null = null;

const getTutorChat = (): Chat => {
    if (!tutorChat) {
        tutorChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: AI_TUTOR_PROMPT,
                temperature: 0.7,
                topP: 0.95,
            },
        });
    }
    return tutorChat;
};

const sendMessageToTutor = async (message: string): Promise<string> => {
    try {
        const chat = getTutorChat();
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to tutor:", error);
        return "Sorry, I'm having a little trouble connecting right now. Let's try again in a moment.";
    }
};
// END: Inlined tutorService

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [homeworkItems, setHomeworkItems] = useState<HomeworkItem[]>(() => {
    const saved = localStorage.getItem('homeworkItems');
    return saved ? JSON.parse(saved) : initialHomework;
  });
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);


  useEffect(() => {
    localStorage.setItem('homeworkItems', JSON.stringify(homeworkItems));
  }, [homeworkItems]);

  const handleAchievementEvent = (event: AchievementEvent) => {
    const previousAchievements = [...achievements];
    const updatedAchievements = checkAndUnlockAchievements(event);
    setAchievements(updatedAchievements);

    const justUnlocked = updatedAchievements.find(
      (ach) => ach.unlocked && !previousAchievements.find(pach => pach.id === ach.id)?.unlocked
    );
    
    if (justUnlocked) {
      setNewlyUnlocked(justUnlocked);
      setTimeout(() => setNewlyUnlocked(null), 5000); // Popup disappears after 5s
    }
  };

  const handleAddHomework = (item: ParsedHomework) => {
    const newItem: HomeworkItem = {
      ...item,
      id: generateId(),
      completed: false,
    };
    setHomeworkItems(prev => [...prev, newItem]);
    handleAchievementEvent({ type: 'HOMEWORK_UPDATE', payload: { items: [...homeworkItems, newItem] }});
  };

  const handleToggleComplete = (id: string) => {
    let taskWasJustCompleted = false;
    const updatedItems = homeworkItems.map(item => {
      if (item.id === id) {
        if (!item.completed) { // If it was incomplete before clicking
          taskWasJustCompleted = true;
        }
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setHomeworkItems(updatedItems);
    if (taskWasJustCompleted) {
        handleAchievementEvent({ type: 'TASK_COMPLETED' });
    }
    handleAchievementEvent({ type: 'HOMEWORK_UPDATE', payload: { items: updatedItems }});
  };

  const handleSessionComplete = () => {
      handleAchievementEvent({ type: 'FOCUS_SESSION_COMPLETED' });
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <HomeworkDashboard items={homeworkItems} onAdd={handleAddHomework} onToggleComplete={handleToggleComplete} />;
      case 'tutor':
        return <ChatWindow title="AI Tutor" description="Get help with your homework concepts." onSendMessage={sendMessageToTutor} />;
      case 'friend':
        return <ChatWindow title="AI Buddy" description="Chat about anything on your mind." onSendMessage={sendMessageToBuddy} />;
      case 'focus':
        return <FocusTimer onSessionComplete={handleSessionComplete}/>;
      case 'achievements':
        return <AchievementCenter achievements={achievements} />;
      case 'parent':
          return <ParentDashboard items={homeworkItems} />;
      default:
        return <HomeworkDashboard items={homeworkItems} onAdd={handleAddHomework} onToggleComplete={handleToggleComplete} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-background-main text-text-primary flex font-sans">
      <Sidebar currentView={view} onNavigate={setView} />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
      {newlyUnlocked && <AchievementPopup achievement={newlyUnlocked} />}
    </div>
  );
};

export default App;
