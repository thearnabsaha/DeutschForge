'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  key: string; // localStorage key for persistence
  totalSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({ key, totalSeconds, onExpire, autoStart = false }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(() => {
    if (typeof window === 'undefined') return totalSeconds;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const { remaining: savedRemaining, savedAt } = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - savedAt) / 1000);
        return Math.max(0, savedRemaining - elapsed);
      } catch {
        return totalSeconds;
      }
    }
    return totalSeconds;
  });

  const [running, setRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Save to localStorage on every tick
  useEffect(() => {
    if (running && typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify({ remaining, savedAt: Date.now() }));
    }
  }, [remaining, running, key]);

  useEffect(() => {
    if (!running || remaining <= 0) {
      if (remaining <= 0 && running) {
        setRunning(false);
        onExpireRef.current?.();
      }
      return;
    }
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, [totalSeconds, key]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const isExpired = remaining <= 0;

  return { remaining, minutes, seconds, progress, isExpired, running, start, pause, reset };
}
