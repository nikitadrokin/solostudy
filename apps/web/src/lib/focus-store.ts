import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AmbientSoundId } from '@/components/focus-room/ambient-player';
import { normalizeYouTubeUrl } from '@/components/focus-room/youtube-player';

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
  // Video settings - using normalized URL format
  videoUrl: normalizeYouTubeUrl('https://www.youtube.com/watch?v=We4uRmMjjhM'),
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

      // Video actions - normalize YouTube URLs to ensure clean embed format
      setVideoUrl: (url: string) => set({ videoUrl: normalizeYouTubeUrl(url) }),
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
