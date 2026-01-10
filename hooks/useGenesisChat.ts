'use client';

import { useState, useCallback } from 'react';

const GENESIS_URL = 'https://barrios-genesis-flawless.onrender.com';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BriefState {
  progress: number;
  missingFields: string[];
  extractedData: Record<string, string>;
  isComplete: boolean;
  triggerProduction: boolean;
  ragnarokReady: boolean;
}

interface UseGenesisChatReturn {
  messages: ChatMessage[];
  briefState: BriefState;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  confirmProduction: () => Promise<void>;
  resetChat: () => void;
}

export function useGenesisChat(sessionId: string): UseGenesisChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [briefState, setBriefState] = useState<BriefState>({
    progress: 0,
    missingFields: ['business_name', 'primary_offering', 'target_demographic', 'call_to_action', 'tone'],
    extractedData: {},
    isComplete: false,
    triggerProduction: false,
    ragnarokReady: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${GENESIS_URL}/api/genesis/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message,
          conversation_history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update brief state with fallback values
      setBriefState({
        progress: data.progress_percentage || 0,
        missingFields: data.missing_fields || [],
        extractedData: data.extracted_data || {},
        isComplete: data.is_complete || false,
        triggerProduction: data.trigger_production || false,
        ragnarokReady: data.ragnarok_ready || false,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, messages]);

  const confirmProduction = useCallback(async () => {
    await sendMessage('Yes, start production!');
  }, [sendMessage]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setBriefState({
      progress: 0,
      missingFields: ['business_name', 'primary_offering', 'target_demographic', 'call_to_action', 'tone'],
      extractedData: {},
      isComplete: false,
      triggerProduction: false,
      ragnarokReady: false,
    });
    setError(null);
  }, []);

  return {
    messages,
    briefState,
    isLoading,
    error,
    sendMessage,
    confirmProduction,
    resetChat,
  };
}
