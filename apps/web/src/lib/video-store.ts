import { create } from 'zustand';
import { useFocusStore } from './focus-store';

// YouTube player type
interface YTPlayer {
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
}

interface VideoState {
  // Player instance (not persisted)
  player: YTPlayer | null;

  // Video loading state (not persisted - should reset on page visit)
  isVideoLoaded: boolean;
  videoError: string | undefined;
}

interface VideoActions {
  // Player management
  setPlayer: (player: YTPlayer | null) => void;

  // Video state management
  setIsVideoLoaded: (loaded: boolean) => void;
  setVideoError: (error: string | undefined) => void;

  // Player control actions
  handlePlayerReady: (event: { target: YTPlayer }) => void;
  handlePlay: () => void;
  handlePause: () => void;
  handleError: (error: number) => void;
  handleVideoUrlChange: (newUrl: string) => void;
  handleLoadVideo: () => void;
  handlePlayPause: () => void;
  handleVolumeChange: (newVolume: number) => void;
  handleMuteToggle: () => void;
}

type VideoStore = VideoState & VideoActions;

const initialState: VideoState = {
  player: null,
  isVideoLoaded: false,
  videoError: undefined,
};

export const useVideoStore = create<VideoStore>()((set, get) => ({
  ...initialState,

  // Player management
  setPlayer: (player) => set({ player }),

  // Video state management
  setIsVideoLoaded: (loaded) => set({ isVideoLoaded: loaded }),
  setVideoError: (error) => set({ videoError: error }),

  // Player control actions
  handlePlayerReady: (event) => {
    set({
      player: event.target,
      isVideoLoaded: true,
      videoError: undefined,
    });
  },

  handlePlay: () => {
    useFocusStore.getState().setIsPlaying(true);
  },

  handlePause: () => {
    useFocusStore.getState().setIsPlaying(false);
  },

  handleError: (error) => {
    const errorMessages: Record<number, string> = {
      2: 'Invalid video ID',
      5: 'Video cannot be played in HTML5 player',
      100: 'Video not found or private',
      101: 'Video owner does not allow embedding',
      150: 'Video owner does not allow embedding',
    };

    set({
      videoError: errorMessages[error] || 'Unknown error occurred',
      isVideoLoaded: false,
    });
  },

  handleVideoUrlChange: (newUrl) => {
    useFocusStore.getState().setVideoUrl(newUrl);
    set({
      isVideoLoaded: false,
      videoError: undefined,
    });
  },

  handleLoadVideo: () => {
    set({
      isVideoLoaded: false,
      videoError: undefined,
    });
  },

  handlePlayPause: () => {
    const { player } = get();
    const { isPlaying } = useFocusStore.getState();

    if (!player) {
      return;
    }

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  },

  handleVolumeChange: (newVolume) => {
    const { player } = get();
    const { setVolume, setIsMuted, isMuted } = useFocusStore.getState();

    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        player.unMute();
      }
    }
  },

  handleMuteToggle: () => {
    const { player } = get();
    const { setIsMuted, isMuted } = useFocusStore.getState();

    if (!player) {
      return;
    }

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  },
}));
