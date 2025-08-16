import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AmbientSoundId } from '@/components/focus-room/ambient-player';

interface FocusState {
  // Video settings
  videoUrl: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;

  // Ambient sound settings
  ambientSound: AmbientSoundId;
  ambientVolume: number;
  isAmbientMuted: boolean;

  // UI state
  isZenMode: boolean;
}

interface FocusActions {
  // Video actions
  setVideoUrl: (url: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;

  // Ambient sound actions
  setAmbientSound: (sound: AmbientSoundId) => void;
  setAmbientVolume: (volume: number) => void;
  setIsAmbientMuted: (muted: boolean) => void;

  // UI actions
  setIsZenMode: (zenMode: boolean) => void;

  // Reset action
  resetSettings: () => void;
}

type FocusStore = FocusState & FocusActions;

const initialState: FocusState = {
  // Video settings
  videoUrl:
    'https://www.youtube.com/embed/We4uRmMjjhM?start=0&loop=1&playlist=We4uRmMjjhM&showinfo=0&controls=0&disablekb=0&fs=0&rel=0&iv_load_policy=3&autoplay=1&mute=1&modestbranding=1&playsinline=1&enablejsapi=1&origin=https%3A%2F%2Fapp.studytogether.com&widgetid=1',
  isPlaying: false,
  volume: 50,
  isMuted: false,

  // Ambient sound settings
  ambientSound: 'none',
  ambientVolume: 30,
  isAmbientMuted: false,

  // UI state
  isZenMode: false,
};

export const useFocusStore = create<FocusStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Video actions
      setVideoUrl: (url: string) => set({ videoUrl: url }),
      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setVolume: (volume: number) => set({ volume }),
      setIsMuted: (muted: boolean) => set({ isMuted: muted }),

      // Ambient sound actions
      setAmbientSound: (sound: AmbientSoundId) => set({ ambientSound: sound }),
      setAmbientVolume: (volume: number) => set({ ambientVolume: volume }),
      setIsAmbientMuted: (muted: boolean) => set({ isAmbientMuted: muted }),

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
        videoUrl: state.videoUrl,
        volume: state.volume,
        isMuted: state.isMuted,
        ambientSound: state.ambientSound,
        ambientVolume: state.ambientVolume,
        isAmbientMuted: state.isAmbientMuted,
        isZenMode: state.isZenMode,
      }),
    }
  )
);
