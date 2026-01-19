'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * Handles SSR safely by only accessing localStorage on the client
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  // Wrapped setter that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Clear this specific key from localStorage
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

/**
 * Hook specifically for chat message history
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function useChatHistory(storageKey: string = 'architect-chat-history') {
  const [messages, setMessages, clearMessages] = useLocalStorage<ChatMessage[]>(
    storageKey,
    []
  );

  const addMessage = useCallback(
    (role: 'user' | 'assistant', content: string) => {
      const newMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [setMessages]
  );

  return { messages, addMessage, clearMessages };
}

/**
 * Hook for tracking success portal progress
 */
export interface ProgressState {
  completedItems: string[];
  currentPhase: number;
  brandData: BrandData | null;
}

export interface BrandData {
  businessName: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  voiceTone: string;
  targetAudience: string;
}

const defaultProgressState: ProgressState = {
  completedItems: [],
  currentPhase: 0,
  brandData: null,
};

export function useProgressTracker(storageKey: string = 'success-portal-progress') {
  const [progress, setProgress, clearProgress] = useLocalStorage<ProgressState>(
    storageKey,
    defaultProgressState
  );

  const markItemComplete = useCallback(
    (itemId: string) => {
      setProgress((prev) => ({
        ...prev,
        completedItems: prev.completedItems.includes(itemId)
          ? prev.completedItems
          : [...prev.completedItems, itemId],
      }));
    },
    [setProgress]
  );

  const setCurrentPhase = useCallback(
    (phase: number) => {
      setProgress((prev) => ({ ...prev, currentPhase: phase }));
    },
    [setProgress]
  );

  const saveBrandData = useCallback(
    (data: BrandData) => {
      setProgress((prev) => ({ ...prev, brandData: data }));
    },
    [setProgress]
  );

  return {
    progress,
    markItemComplete,
    setCurrentPhase,
    saveBrandData,
    clearProgress,
  };
}
