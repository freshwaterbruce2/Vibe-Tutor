import React, { Suspense, lazy, useEffect, useState } from 'react';
import AchievementToast from './components/AchievementToast';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import OfflineIndicator from './components/OfflineIndicator';
import Sidebar from './components/Sidebar';
import { AI_TUTOR_PROMPT } from './constants';
import { AchievementEvent, checkAndUnlockAchievements, getAchievements } from './services/achievementService';
import { sendMessageToBuddy } from './services/buddyService';
import { getSubjectProgress } from './services/progressionService';
import { createChatCompletion, type DeepSeekMessage } from './services/secureClient';
import { triggerVibration } from './services/uiService';
import { usageMonitor } from './services/usageMonitor';
import type { Achievement, BrainGameType, ClaimedReward, DifficultyLevel, HomeworkItem, MusicPlaylist, ParsedHomework, Reward, SubjectType, View, WorksheetSession } from './types';

// Lazy-loaded components
const HomeworkDashboard = lazy(() => import('./components/HomeworkDashboard'));
const ChatWindow = lazy(() => import('./components/ChatWindow'));
const ParentDashboard = lazy(() => import('./components/ParentDashboard'));
const AchievementCenter = lazy(() => import('./components/AchievementCenter'));
const MusicLibrary = lazy(() => import('./components/MusicLibrary').then(m => ({ default: m.MusicLibrary })));
const SensorySettings = lazy(() => import('./components/SensorySettings'));
const FocusTimer = lazy(() => import('./components/FocusTimer'));
const SubjectCards = lazy(() => import('./components/SubjectCards'));
const BrainGames = lazy(() => import('./components/BrainGamesHub'));
const WorksheetView = lazy(() => import('./components/WorksheetView'));
const WorksheetResults = lazy(() => import('./components/WorksheetResults'));
const VisualSchedule = lazy(() => import('./components/schedule/VisualSchedule'));
const ConversationBuddy = lazy(() => import('./components/ConversationBuddy'));
const TokenWallet = lazy(() => import('./components/TokenWallet'));
const ParentRulesPage = lazy(() => import('./components/ParentRulesPage'));
const FirstThenGate = lazy(() => import('./components/FirstThenGate'));

// A simple ID generator
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock initial data (includes all subjects for proper dashboard display)
const initialHomework: HomeworkItem[] = [
  { id: generateId(), subject: 'Math', title: 'Algebra II Worksheet', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
  { id: generateId(), subject: 'History', title: 'Read Chapter 5: The Roman Empire', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
  { id: generateId(), subject: 'Science', title: 'Lab Report on Photosynthesis', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
  { id: generateId(), subject: 'Bible', title: 'Study Psalms Chapter 23', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
  { id: generateId(), subject: 'Language Arts', title: 'Write Essay on Favorite Book', dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
];


// START: Inlined tutorService to avoid creating a new file as per project constraints.
const tutorHistory: DeepSeekMessage[] = [
  { role: 'system', content: AI_TUTOR_PROMPT }
];

const sendMessageToTutor = async (message: string): Promise<string> => {
  // Check usage limits before making request
  const canRequest = usageMonitor.canMakeRequest();
  if (!canRequest.allowed) {
    return canRequest.reason || "Usage limit reached. Please try again later.";
  }

  tutorHistory.push({ role: 'user', content: message });

  const fallbackResponses = [
    "I'm experiencing some technical difficulties right now. Let me try to help you again.",
    "Sorry, I'm having connection issues. Please try asking your question again.",
    "I'm having trouble processing that request. Could you rephrase your question?",
    "There seems to be a temporary issue. Let's give it another try."
  ];

  const response = await createChatCompletion(tutorHistory, {
    model: 'deepseek-chat',
    temperature: 0.7,
    top_p: 0.95,
    retryCount: 3,
    fallbackMessage: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  });

  const assistantMessage = response || fallbackResponses[0];
  tutorHistory.push({ role: 'assistant', content: assistantMessage });

  // Record successful request
  usageMonitor.recordRequest();

  return assistantMessage;
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
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [points, setPoints] = useState<number>(() => Number(localStorage.getItem('studentPoints') || '0'));
  const [rewards, setRewards] = useState<Reward[]>(() => JSON.parse(localStorage.getItem('parentRewards') || '[]'));
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>(() => JSON.parse(localStorage.getItem('claimedRewards') || '[]'));
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(() => {
    const saved = localStorage.getItem('musicPlaylists');
    return saved ? JSON.parse(saved) : [];
  });

  // Worksheet state
  const [worksheetSubject, setWorksheetSubject] = useState<SubjectType | null>(null);
  const [worksheetSession, setWorksheetSession] = useState<WorksheetSession | null>(null);
  const [worksheetLeveledUp, setWorksheetLeveledUp] = useState(false);
  const [worksheetNewDifficulty, setWorksheetNewDifficulty] = useState<DifficultyLevel | undefined>();
  const [worksheetStarsToNextLevel, setWorksheetStarsToNextLevel] = useState(0);

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);  // New state

  useEffect(() => {
    localStorage.setItem('homeworkItems', JSON.stringify(homeworkItems));
  }, [homeworkItems]);

  useEffect(() => {
    localStorage.setItem('studentPoints', String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('parentRewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('claimedRewards', JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  useEffect(() => {
    localStorage.setItem('musicPlaylists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAchievementEvent = (event: AchievementEvent) => {
    const result = checkAndUnlockAchievements(event);
    setAchievements(result.achievements);

    // If there are newly unlocked achievements, show toast and award bonus points
    if (result.newlyUnlocked.length > 0) {
      const firstUnlocked = result.newlyUnlocked[0];
      setNewlyUnlocked(firstUnlocked);
      setBonusPoints(result.totalBonusPoints);

      // Award bonus points to user
      setPoints(p => p + result.totalBonusPoints);

      // Auto-close toast after 5 seconds
      setTimeout(() => {
        setNewlyUnlocked(null);
        setBonusPoints(0);
      }, 5000);
    }
  };

  const handleAddHomework = (item: ParsedHomework) => {
    const newItem: HomeworkItem = {
      ...item,
      id: generateId(),
      completed: false,
    };
    setHomeworkItems(prev => [...prev, newItem]);
    handleAchievementEvent({ type: 'HOMEWORK_UPDATE', payload: { items: [...homeworkItems, newItem] } });
  };

  const handleToggleComplete = (id: string) => {
    let taskWasJustCompleted = false;
    triggerVibration(50); // Haptic feedback
    const updatedItems = homeworkItems.map(item => {
      if (item.id === id) {
        if (!item.completed) { // If it was incomplete before clicking
          taskWasJustCompleted = true;
        }
        return {
          ...item,
          completed: !item.completed,
          completedDate: !item.completed ? Date.now() : undefined
        };
      }
      return item;
    });
    setHomeworkItems(updatedItems);
    if (taskWasJustCompleted) {
      handleAchievementEvent({ type: 'TASK_COMPLETED' });
      setPoints(p => p + 10);
    }
    handleAchievementEvent({ type: 'HOMEWORK_UPDATE', payload: { items: updatedItems } });
  };

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && points >= reward.cost) {
      setPoints(p => p - reward.cost);
      const newClaimedReward: ClaimedReward = { ...reward, claimedDate: Date.now() };
      setClaimedRewards(prev => [...prev, newClaimedReward]);
      return true;
    }
    return false;
  };

  const handleRewardApproval = (claimedRewardId: string, isApproved: boolean) => {
    const rewardToHandle = claimedRewards.find(r => r.id === claimedRewardId);
    if (!rewardToHandle) return;

    if (!isApproved) { // Denied
      setPoints(p => p + rewardToHandle.cost); // Refund points
    }
    // Remove from claimed list in both cases
    setClaimedRewards(prev => prev.filter(r => r.id !== claimedRewardId));
  };

  const handleAddPlaylist = (playlist: MusicPlaylist) => {
    setPlaylists(prev => [...prev, playlist]);
  };

  const handleRemovePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  const handleStartWorksheet = (subject: SubjectType) => {
    setWorksheetSubject(subject);
    setWorksheetSession(null);
  };

  const handleWorksheetComplete = (session: WorksheetSession) => {
    // Import progression service to handle level up logic
    import('./services/progressionService').then(({ completeWorksheet }) => {
      const result = completeWorksheet(session);

      setWorksheetSession(session);
      setWorksheetLeveledUp(result.leveledUp);
      setWorksheetNewDifficulty(result.newDifficulty);
      setWorksheetStarsToNextLevel(result.starsToNextLevel);

      // Award points (1 point per star earned)
      setPoints(p => p + (session.starsEarned || 0));

      // Achievement event for completing worksheet
      if (session.starsEarned && session.starsEarned >= 3) {
        handleAchievementEvent({ type: 'TASK_COMPLETED' });
      }
    });
  };

  const handleWorksheetCancel = () => {
    setWorksheetSubject(null);
    setWorksheetSession(null);
  };

  const handleWorksheetTryAgain = () => {
    setWorksheetSession(null);
  };

  const handleWorksheetContinue = () => {
    setWorksheetSubject(null);
    setWorksheetSession(null);
  };

  const renderView = () => {
    const currentViewComponent = () => {
      switch (view) {
        case 'dashboard':
          return <HomeworkDashboard items={homeworkItems} onAdd={handleAddHomework} onToggleComplete={handleToggleComplete} points={points} />;
        case 'tutor':
          return <ChatWindow title="AI Tutor" description="Get help with your homework concepts." onSendMessage={sendMessageToTutor} type="tutor" />;
        case 'friend':
          return <ChatWindow title="AI Buddy" description="Chat about anything on your mind." onSendMessage={sendMessageToBuddy} type="friend" />;
        case 'achievements':
          return <AchievementCenter achievements={achievements} points={points} rewards={rewards} onClaimReward={handleClaimReward} claimedRewards={claimedRewards} />;
        case 'parent':
          return <ParentDashboard items={homeworkItems} rewards={rewards} onUpdateRewards={setRewards} claimedRewards={claimedRewards} onApproval={handleRewardApproval} onNavigate={setView} />;
        case 'music':
          return <MusicLibrary playlists={playlists} onAddPlaylist={handleAddPlaylist} onRemovePlaylist={handleRemovePlaylist} />;
        case 'sensory':
          return <SensorySettings />;
        case 'focus':
          return <FocusTimer onSessionComplete={(mins) => {
            setPoints(p => p + mins);
            handleAchievementEvent({ type: 'FOCUS_SESSION_COMPLETED', payload: { duration: mins } });
          }} />;
        case 'cards':
          // Worksheet system with three states: card selection, active worksheet, results
          if (worksheetSession) {
            // Show results after completing worksheet
            return <WorksheetResults
              session={worksheetSession}
              leveledUp={worksheetLeveledUp}
              newDifficulty={worksheetNewDifficulty}
              starsToNextLevel={worksheetStarsToNextLevel}
              onTryAgain={handleWorksheetTryAgain}
              onContinue={handleWorksheetContinue}
            />;
          } else if (worksheetSubject) {
            // Show active worksheet
            const progress = getSubjectProgress(worksheetSubject);
            return <WorksheetView
              subject={worksheetSubject}
              difficulty={progress.currentDifficulty}
              onComplete={handleWorksheetComplete}
              onCancel={handleWorksheetCancel}
            />;
          } else {
            // Show subject cards (main menu)
            return <SubjectCards onStartWorksheet={handleStartWorksheet} />;
          }
        case 'games':
          return (
            <FirstThenGate minimumStepsRequired={3}>
              <BrainGames onGameComplete={(gameType: BrainGameType, score: number, stars: number) => {
                setPoints(p => p + stars);
                handleAchievementEvent({ type: 'TASK_COMPLETED' });
              }} />
            </FirstThenGate>
          );
        case 'schedules':
          return <VisualSchedule
            type="morning"
            onEditSchedule={() => setView('dashboard')}
          />;
        case 'buddy':
          return <ConversationBuddy onClose={() => setView('dashboard')} />;
        case 'tokens':
          return <TokenWallet onClose={() => setView('dashboard')} />;
        case 'parent-rules':
          return <ParentRulesPage onClose={() => setView('parent')} />;
        default:
          return <HomeworkDashboard items={homeworkItems} onAdd={handleAddHomework} onToggleComplete={handleToggleComplete} points={points} />;
      }
    };

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {currentViewComponent()}
        </Suspense>
      </ErrorBoundary>
    )
  };

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className="h-screen w-screen bg-background-main text-text-primary flex font-sans">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        isCollapsed={isNavCollapsed}
        onToggle={toggleNav}
      />
      <main className="flex-1 overflow-y-auto relative pb-52 md:pb-0">
        {renderView()}
        {!isOnline && <OfflineIndicator />}
      </main>
      <AchievementToast
        achievement={newlyUnlocked}
        bonusPoints={bonusPoints}
        onClose={() => {
          setNewlyUnlocked(null);
          setBonusPoints(0);
        }}
      />
    </div>
  );
};

export default App;
