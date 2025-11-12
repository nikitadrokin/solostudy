import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FocusState {
  // Video settings
  videoId: string;
  volume: number;
  isMuted: boolean;

  // UI state
  isZenMode: boolean;
}

interface FocusActions {
  // Video actions
  setVideoId: (id: string) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;

  // UI actions
  setIsZenMode: (zenMode: boolean) => void;

  // Reset action
  resetSettings: () => void;
}

type FocusStore = FocusState & FocusActions;

const initialState: FocusState = {
  // Video settings - using only ID's from the YouTube URL
  videoId: 'jfKfPfyJRdk',
  volume: 50,
  isMuted: false,

  // UI state
  isZenMode: false,
};

export const useFocusStore = create<FocusStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Video actions - store video ID without link prefix
      setVideoId: (id: string) => set({ videoId: id }),
      setVolume: (volume: number) => set({ volume }),
      setIsMuted: (muted: boolean) => set({ isMuted: muted }),

      // UI actions
      setIsZenMode: (zenMode: boolean) => set({ isZenMode: zenMode }),

      // Reset action
      resetSettings: () => set(initialState),
    }),
    {
      name: 'focus-room-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain parts of the state - exclude transient state like isPlaying
      partialize: (state) => ({
        videoId: state.videoId,
        volume: state.volume,
        isMuted: state.isMuted,
        isZenMode: state.isZenMode,
      }),
    }
  )
);
