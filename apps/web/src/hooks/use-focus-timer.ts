'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { api, apiClient } from '@/utils/trpc';

const MIN_SESSION_DURATION_SECONDS = 30;

export function useFocusTimer() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [focusTime, setFocusTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabId = useRef(`tab-${Math.random().toString(36).slice(2)}`);
  const sessionStartRef = useRef<Date | null>(null);
  const accumulatedTimeRef = useRef(0);

  const { mutate: saveFocusSession } = useMutation({
    mutationFn: (input: {
      durationSeconds: number;
      startedAt: Date;
      endedAt: Date;
    }) => apiClient.focus.saveFocusSession.mutate(input),
    onSuccess: () => {
      // Invalidate the today focus time query to refresh dashboard
      queryClient.invalidateQueries({
        queryKey: api.focus.getTodayFocusTime.queryKey(),
      });
    },
  });

  const isOwner = useCallback(() => {
    return localStorage.getItem('FOCUS_OWNER') === tabId.current;
  }, []);

  const claimOwnership = useCallback(() => {
    localStorage.setItem('FOCUS_OWNER', tabId.current);
    setIsActive(true);
  }, []);

  const syncSession = useCallback(() => {
    // Only sync if user is logged in and session duration meets threshold
    if (
      session &&
      sessionStartRef.current &&
      accumulatedTimeRef.current >= MIN_SESSION_DURATION_SECONDS
    ) {
      const endedAt = new Date();
      saveFocusSession({
        durationSeconds: accumulatedTimeRef.current,
        startedAt: sessionStartRef.current,
        endedAt,
      });
    }
    // Reset session tracking
    sessionStartRef.current = null;
    accumulatedTimeRef.current = 0;
  }, [session, saveFocusSession]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    // Start a new session if we don't have one
    if (!sessionStartRef.current) {
      sessionStartRef.current = new Date();
      accumulatedTimeRef.current = 0;
    }

    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible' && isOwner()) {
        setFocusTime((prev) => prev + 1);
        accumulatedTimeRef.current += 1;
      }
    }, 1000);
  }, [isOwner]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    // Sync the session when stopping
    syncSession();
  }, [syncSession]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        claimOwnership();
        startTimer();
      } else {
        stopTimer();
      }
    };

    const handleFocus = () => {
      claimOwnership();
      startTimer();
    };

    const handleBlur = () => {
      stopTimer();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'FOCUS_OWNER' && !isOwner()) {
        stopTimer();
      }
    };

    const handleBeforeUnload = () => {
      syncSession();
    };

    // Initial setup
    claimOwnership();
    startTimer();

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [claimOwnership, startTimer, stopTimer, isOwner, syncSession]);

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
