'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useFocusTimer() {
  const [focusTime, setFocusTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabId = useRef(`tab-${Math.random().toString(36).slice(2)}`);

  const isOwner = useCallback(() => {
    return localStorage.getItem('FOCUS_OWNER') === tabId.current;
  }, []);

  const claimOwnership = useCallback(() => {
    localStorage.setItem('FOCUS_OWNER', tabId.current);
    setIsActive(true);
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isOwner()) {
        setFocusTime((prev) => prev + 1);
      }
    }, 1000);
  }, [isOwner]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'FOCUS_OWNER' && !isOwner()) {
        stopTimer();
      }
    };

    // Initial setup
    claimOwnership();
    startTimer();

    // Event listeners
    window.addEventListener('storage', handleStorage);

    return () => {
      stopTimer();
      window.removeEventListener('storage', handleStorage);
    };
  }, [claimOwnership, startTimer, stopTimer, isOwner]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    focusTime,
    isActive,
    formattedTime: formatTime(focusTime),
  };
}
