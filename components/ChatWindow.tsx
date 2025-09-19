import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';

interface ChatWindowProps {
  title: string;
  description: string;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ title, description, onSendMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        const modelMessage: ChatMessage = { role: 'model', content: responseContent, timestamp: Date.now() };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = { role: 'model', content: 'Oops! Something went wrong.', timestamp: Date.now() };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <header className="mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-1">{description}</p>
      </header>

      <div aria-live="polite" className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-800/50 rounded-lg space-y-4">
        {messages.map((msg) => (
          <div key={msg.timestamp} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--primary-accent)] text-background-main' : 'bg-background-surface text-text-primary'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-xl p-3 rounded-2xl bg-background-surface text-text-primary">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        <div className="flex items-center bg-background-surface border border-[var(--border-color)] rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 text-text-primary outline-none"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 bg-[var(--primary-accent)] rounded-lg disabled:opacity-50 hover:opacity-80 transition-opacity" aria-label="Send message">
            <SendIcon className="w-5 h-5 text-background-main" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;