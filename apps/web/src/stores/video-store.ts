import { create } from 'zustand';
import { useFocusStore } from './focus-store';

// YouTube player type
interface YTPlayer {
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
  getCurrentTime(): number;
  seekTo(seconds: number): void;
  getPlayerState(): number;
}

interface VideoState {
  // Player instance (not persisted)
  player: YTPlayer | null;

  // Video loading state (not persisted - should reset on page visit)
  isVideoLoaded: boolean;
  videoError: string | undefined;

  // Timestamp preservation for reconnection (not persisted)
  savedTimestamp: number | null;

  // Reload trigger (not persisted)
  reloadKey: number;

  // Player state (not persisted)
  isPlaying: boolean;

  // Persistence callback (optional, set by components that need persistence)
  onVideoUrlChangePersist?: (url: string) => void;
}

interface VideoActions {
  // Player management
  setPlayer: (player: YTPlayer | null) => void;

  // Video state management
  setIsVideoLoaded: (loaded: boolean) => void;
  setVideoError: (error: string | undefined) => void;
  setIsPlaying: (playing: boolean) => void;

  // Timestamp management
  saveCurrentTimestamp: () => void;
  restoreTimestamp: () => void;

  // Reload management
  triggerReload: () => void;

  // Persistence
  setOnVideoUrlChangePersist: (
    callback: ((url: string) => void) | undefined
  ) => void;

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
  syncPlayerState: () => void;
}

type VideoStore = VideoState & VideoActions;

const initialState: VideoState = {
  player: null,
  isVideoLoaded: false,
  videoError: undefined,
  savedTimestamp: null,
  reloadKey: 0,
  isPlaying: false,
  onVideoUrlChangePersist: undefined,
};

export const useVideoStore = create<VideoStore>()((set, get) => ({
  ...initialState,

  // Player management
  setPlayer: (player) => set({ player }),

  // Video state management
  setIsVideoLoaded: (loaded) => set({ isVideoLoaded: loaded }),
  setVideoError: (error) => set({ videoError: error }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),

  // Timestamp management
  saveCurrentTimestamp: () => {
    const { player } = get();
    if (player) {
      try {
        const currentTime = player.getCurrentTime();
        set({ savedTimestamp: currentTime });
      } catch {
        // Failed to get timestamp, no need to save
      }
    }
  },

  restoreTimestamp: () => {
    const { player, savedTimestamp } = get();
    if (player && savedTimestamp !== null) {
      try {
        player.seekTo(savedTimestamp);
        set({ savedTimestamp: null }); // Clear after use
      } catch {
        // Failed to seek, clear the saved timestamp
        set({ savedTimestamp: null });
      }
    }
  },

  // Reload management
  triggerReload: () => {
    const { player } = get();

    // Save current timestamp before reloading
    if (player) {
      try {
        const currentTime = player.getCurrentTime();
        set({ savedTimestamp: currentTime });
      } catch {
        // Could not get timestamp, proceed without it
      }
    }

    // Increment reload key to trigger component reload
    set((state) => ({
      reloadKey: state.reloadKey + 1,
      player: null,
      isVideoLoaded: false,
      videoError: undefined,
    }));
  },

  // Player control actions
  handlePlayerReady: (event) => {
    set({
      player: event.target,
      isVideoLoaded: true,
      videoError: undefined,
    });

    // Restore timestamp if we have one saved (from reconnection)
    setTimeout(() => {
      get().restoreTimestamp();
    }, 500); // Small delay to ensure player is fully ready
  },

  handlePlay: () => {
    set({ isPlaying: true });
  },

  handlePause: () => {
    set({ isPlaying: false });
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

  setOnVideoUrlChangePersist: (callback) =>
    set({ onVideoUrlChangePersist: callback }),

  handleVideoUrlChange: (newUrl) => {
    useFocusStore.getState().setVideoUrl(newUrl);
    set({
      isVideoLoaded: false,
      videoError: undefined,
    });
    // Call persistence callback if set
    const { onVideoUrlChangePersist } = get();
    if (onVideoUrlChangePersist) {
      onVideoUrlChangePersist(newUrl);
    }
    // Trigger reload to sync player with new video
    get().triggerReload();
  },

  handleLoadVideo: () => {
    set({
      isVideoLoaded: false,
      videoError: undefined,
    });
  },

  handlePlayPause: () => {
    const { player } = get();

    if (!player) {
      // Trigger actual reload when player is disconnected
      get().triggerReload();
      return;
    }

    try {
      // Get the current player state directly from the player
      const playerState = player.getPlayerState();
      const currentlyPlaying = playerState === 1; // 1 = playing

      if (currentlyPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }

      // Update our store state to match
      set({ isPlaying: !currentlyPlaying });
    } catch {
      // If player methods fail, trigger reload with timestamp preservation
      get().triggerReload();
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

  syncPlayerState: () => {
    const { player } = get();
    if (!player) {
      return;
    }

    try {
      const playerState = player.getPlayerState();
      // YouTube player states: 1 = playing, 2 = paused
      const actuallyPlaying = playerState === 1;
      set({ isPlaying: actuallyPlaying });
    } catch {
      // Could not get player state, ignore
    }
  },
}));
