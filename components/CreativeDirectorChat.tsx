'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGenesisChat } from '@/hooks/useGenesisChat';
import { BriefProgressBar } from './BriefProgressBar';
import { BriefSummaryCard } from './BriefSummaryCard';
import { ProductionMonitor } from './ProductionMonitor';

export function CreativeDirectorChat() {
  const sessionId = useRef(`session-${Date.now()}`).current;
  const [inputValue, setInputValue] = useState('');
  const [isProducing, setIsProducing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    briefState,
    isLoading,
    error,
    sendMessage,
    confirmProduction,
  } = useGenesisChat(sessionId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleStartProduction = async () => {
    await confirmProduction();
    if (briefState.triggerProduction) {
      setIsProducing(true);
    }
  };

  const handleProductionComplete = (result: any) => {
    setIsProducing(false);
    console.log('Production complete:', result);
    // Show completion UI or download link
  };

  const handleProductionError = (errorMsg: string) => {
    console.error('Production error:', errorMsg);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-950 rounded-xl border border-cyan-500/30">
      {/* Progress bar */}
      <div className="p-4 border-b border-gray-800">
        <BriefProgressBar
          progress={briefState.progress}
          missingFields={briefState.missingFields}
          isComplete={briefState.isComplete}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">👋 Hi! I'm Alex, your Creative Director.</p>
              <p className="text-sm mt-2">Tell me about the video you want to create.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-400 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Side panel */}
        <div className="w-80 space-y-4">
          {/* Brief summary */}
          {briefState.progress > 0 && !isProducing && (
            <BriefSummaryCard
              brief={briefState.extractedData}
              isComplete={briefState.isComplete}
              onConfirm={handleStartProduction}
              onEdit={(field) => sendMessage(`Let me update the ${field}`)}
            />
          )}

          {/* Production monitor */}
          {isProducing && (
            <ProductionMonitor
              sessionId={sessionId}
              isActive={isProducing}
              onComplete={handleProductionComplete}
              onError={handleProductionError}
            />
          )}
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your video..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                       text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            disabled={isLoading || isProducing}
          />
          <button
            type="submit"
            disabled={isLoading || isProducing || !inputValue.trim()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700
                       disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
          >
            Send
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-400 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}
