'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { Send, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { useChatHistory, ChatMessage } from '@/hooks/useLocalStorage';

// Mock AI responses for demo (will be replaced with real API later)
const MOCK_RESPONSES = [
  "I've analyzed your requirements. Based on your brand profile, I recommend starting with a content series that highlights your unique value proposition. Would you like me to draft some initial concepts?",
  "Great question! For your industry, the most effective approach would be to combine educational content with product showcases. I can create a 4-week content calendar that balances both.",
  "I understand your goals. Let me break this down into actionable steps: 1) Define your core message, 2) Identify key platforms, 3) Create a content matrix. Shall I elaborate on any of these?",
  "Based on the data I have, your target audience responds best to authentic, behind-the-scenes content. I suggest we create a 'day in the life' series that showcases your team and process.",
  "That's a smart strategy. I can help you implement this by creating automated workflows that handle the repetitive tasks while you focus on creative direction. Want me to map out the automation opportunities?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-2 h-2 rounded-full bg-[#00bfff]"
        />
      ))}
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-[#00bfff]' : 'bg-white/10'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-[#0B1220]" />
        ) : (
          <Bot size={16} className="text-[#00bfff]" />
        )}
      </div>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-[#00bfff] text-[#0B1220]'
            : 'bg-white/5 border border-white/10 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-[10px] mt-2 ${
            isUser ? 'text-[#0B1220]/60' : 'text-slate-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}

export default function ArchitectChatPage() {
  const { user } = useUser();
  const { messages, addMessage, clearMessages } = useChatHistory();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Add initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(
          'assistant',
          `Hello${user?.firstName ? `, ${user.firstName}` : ''}! I'm your AI Architect. I'm here to help you plan campaigns, brainstorm ideas, and optimize your automation workflows.\n\nWhat would you like to work on today?`
        );
      }, 500);
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);

    // Simulate AI thinking
    setIsTyping(true);

    // Mock delay and response
    setTimeout(() => {
      const randomResponse =
        MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      addMessage('assistant', randomResponse);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    clearMessages();
    // Re-add greeting after clear
    setTimeout(() => {
      addMessage(
        'assistant',
        `Hello${user?.firstName ? `, ${user.firstName}` : ''}! I'm your AI Architect. I'm here to help you plan campaigns, brainstorm ideas, and optimize your automation workflows.\n\nWhat would you like to work on today?`
      );
    }, 300);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bfff] to-[#ffd700] flex items-center justify-center">
            <Sparkles size={20} className="text-[#0B1220]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Architect</h1>
            <p className="text-xs text-slate-500">Your strategic planning assistant</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm"
        >
          <Trash2 size={16} />
          Clear Chat
        </button>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <MessageBubble key={message.id} message={message} index={idx} />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot size={16} className="text-[#00bfff]" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-t border-white/10"
      >
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI Architect anything..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00bfff] transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`p-3 rounded-xl transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-[#00bfff] text-[#0B1220] hover:bg-[#00bfff]/90'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          AI responses are simulated. Full AI integration coming soon.
        </p>
      </motion.div>
    </div>
  );
}
