import { Bot, GraduationCap, Heart, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types';
import { GradientIcon } from './icons/GradientIcon';
import LifeSkillsChecklist from './LifeSkillsChecklist';
import SocialSkillsTips from './SocialSkillsTips';

interface ChatWindowProps {
  title: string;
  description: string;
  onSendMessage: (message: string) => Promise<string>;
  type?: 'tutor' | 'friend';
}

const formatAIResponse = (text: string): string => {
  // Ensure proper spacing
  let formatted = text.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines

  // Limit emojis (keep first 2, remove rest)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
  const emojis = formatted.match(emojiRegex) || [];
  if (emojis.length > 2) {
    let count = 0;
    formatted = formatted.replace(emojiRegex, (match) => {
      count++;
      return count > 2 ? '' : match;
    });
  }

  return formatted;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ title, description, onSendMessage, type = 'tutor' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem(`chat-history-${type}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Save chat history whenever messages change
  useEffect(() => {
    localStorage.setItem(`chat-history-${type}`, JSON.stringify(messages));
  }, [messages, type]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLifeSkills, setShowLifeSkills] = useState(false);
  const [showSocialTips, setShowSocialTips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseContent = await onSendMessage(input);
      if (!responseContent) {
        throw new Error('No response received');
      }
      const formattedResponse = formatAIResponse(responseContent);
      const modelMessage: ChatMessage = { role: 'model', content: formattedResponse, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessages = [
        "I'm having trouble connecting right now. Please try again in a moment.",
        "Something went wrong on my end. Let me try to help you again.",
        "I'm experiencing some technical difficulties. Please retry your message.",
        "Oops! I couldn't process that. Mind giving it another shot?"
      ];

      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      const errorMessage: ChatMessage = {
        role: 'model',
        content: randomError,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskBuddy = (question: string) => {
    setInput(question);
    setShowSocialTips(false);
    setShowLifeSkills(false);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 pb-24 md:pb-8 relative">
      {/* AI Buddy Tools Overlay (Life Skills + Social Tips) */}
      {type === 'friend' && (showLifeSkills || showSocialTips) && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                {showLifeSkills ? '📋 Daily Life Skills' : '💡 Social Skills Tips'}
              </h2>
              <button
                onClick={() => {
                  setShowLifeSkills(false);
                  setShowSocialTips(false);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            {showLifeSkills && <LifeSkillsChecklist />}
            {showSocialTips && <SocialSkillsTips onAskBuddy={handleAskBuddy} />}
          </div>
        </div>
      )}

      <header className="mb-4 md:mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          {type === 'tutor' ? (
            <GradientIcon Icon={GraduationCap} size={48} gradientId="vibe-gradient-primary" className="icon-pulse" />
          ) : (
            <GradientIcon Icon={Heart} size={48} gradientId="vibe-gradient-secondary" className="icon-bounce" />
          )}
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] neon-text-primary">
              {title}
            </h1>
            {type === 'friend' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowLifeSkills(true)}
                  className="glass-card px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-all text-sm flex items-center gap-1"
                  title="Daily Life Skills Checklist"
                >
                  <span>📋</span>
                  <span className="text-gray-300 text-xs">Life Skills</span>
                </button>
                <button
                  onClick={() => setShowSocialTips(true)}
                  className="glass-card px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-all text-sm flex items-center gap-1"
                  title="Social Skills Tips"
                >
                  <span>💡</span>
                  <span className="text-gray-300 text-xs">Social Tips</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-text-secondary text-lg">{description}</p>
        {messages.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="px-3 py-1 bg-[var(--primary-accent)]/20 border border-[var(--primary-accent)]/40 rounded-full text-xs text-[var(--primary-accent)] font-medium flex items-center gap-2">
              <Sparkles size={14} className="icon-spin" />
              {messages.length} saved
            </div>
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem(`chat-history-${type}`);
              }}
              className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-200 transition-all duration-200 hover:scale-105"
            >
              Clear Chat
            </button>
          </div>
        )}
      </header>

      <div aria-live="polite" className="flex-1 overflow-y-auto mb-4 p-6 glass-card space-y-6">
        {messages.map((msg, index) => (
          <div
            key={msg.timestamp}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.3s_ease-out]`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`group max-w-xl relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              {msg.role !== 'user' && (
                <div className="flex items-center gap-2 mb-2">
                  {type === 'tutor' ? (
                    <GradientIcon Icon={GraduationCap} size={24} gradientId="vibe-gradient-primary" />
                  ) : (
                    <GradientIcon Icon={Heart} size={24} gradientId="vibe-gradient-accent" />
                  )}
                  <span className="text-xs text-text-muted">
                    {type === 'tutor' ? 'AI Tutor' : 'AI Buddy'}
                  </span>
                </div>
              )}
              <div className={`p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] ${msg.role === 'user'
                ? 'bg-gradient-to-br from-[var(--primary-accent)] to-[var(--tertiary-accent)] text-white border-[var(--primary-accent)]/30 shadow-lg shadow-[var(--primary-accent)]/20'
                : 'bg-[var(--glass-surface)] text-text-primary border-[var(--glass-border)] hover:border-[var(--border-hover)]'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className="flex justify-end mt-2">
                  <span className="text-xs opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-[fadeInUp_0.3s_ease-out]">
            <div className="group max-w-xl relative">
              <div className="flex items-center gap-2 mb-2">
                {type === 'tutor' ? (
                  <GradientIcon Icon={Bot} size={24} gradientId="vibe-gradient-primary" className="animate-pulse" />
                ) : (
                  <GradientIcon Icon={Sparkles} size={24} gradientId="vibe-gradient-secondary" className="animate-pulse" />
                )}
                <span className="text-xs text-text-muted">
                  {type === 'tutor' ? 'AI Tutor is thinking...' : 'AI Buddy is typing...'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--glass-surface)] border border-[var(--glass-border)] backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[var(--primary-accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-[var(--secondary-accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-[var(--tertiary-accent)] rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        <div className="flex items-center glass-card p-3 border-[var(--glass-border)] hover:border-[var(--border-hover)] transition-all duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${type === 'tutor' ? 'your AI Tutor' : 'your AI Buddy'}... (Enter to send, Shift+Enter for new line)`}
            className="flex-1 bg-transparent px-4 py-3 text-text-primary outline-none placeholder-text-muted"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="glass-button p-3 ml-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <GradientIcon Icon={Send} size={20} gradientId="vibe-gradient-mobile" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-text-muted opacity-70">
            Press Ctrl+Enter or click send • {messages.length} messages
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
