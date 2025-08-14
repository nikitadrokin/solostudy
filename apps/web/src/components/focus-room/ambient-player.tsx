'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// For development: Create placeholder audio URLs
// In production, these would be actual audio file URLs
const createPlaceholderUrls = () => {
  if (typeof window === 'undefined') return {};

  // Create data URLs for very short silent audio clips for demo
  const silentAudio =
    'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dytmn9BzeP2fPNeSsFJHfJ8N2QQAoXYbPl65xL';

  return {
    rain: silentAudio,
    forest: silentAudio,
    cafe: silentAudio,
    ocean: silentAudio,
    'white-noise': silentAudio,
    fireplace: silentAudio,
  };
};

// Available ambient sounds with their metadata
// Get placeholder URLs for development
const placeholderUrls = createPlaceholderUrls();

export const AMBIENT_SOUNDS = [
  {
    id: 'none',
    name: 'None',
    description: 'No ambient sound',
    url: null,
    icon: '🔇',
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Gentle rainfall',
    url: placeholderUrls.rain || '/audio/rain.mp3',
    icon: '🌧️',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Birds and rustling leaves',
    url: placeholderUrls.forest || '/audio/forest.mp3',
    icon: '🌲',
  },
  {
    id: 'cafe',
    name: 'Cafe',
    description: 'Coffee shop ambience',
    url: placeholderUrls.cafe || '/audio/cafe.mp3',
    icon: '☕',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Calming ocean sounds',
    url: placeholderUrls.ocean || '/audio/ocean.mp3',
    icon: '🌊',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    description: 'Focus-enhancing white noise',
    url: placeholderUrls['white-noise'] || '/audio/white-noise.mp3',
    icon: '📻',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire sounds',
    url: placeholderUrls.fireplace || '/audio/fireplace.mp3',
    icon: '🔥',
  },
] as const;

export type AmbientSoundId = (typeof AMBIENT_SOUNDS)[number]['id'];

interface AmbientPlayerProps {
  soundId: AmbientSoundId;
  volume: number; // 0-100
  isPlaying: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

export default function AmbientPlayer({
  soundId,
  volume,
  isPlaying,
  onLoadStart,
  onLoadEnd,
  onError,
}: AmbientPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentSound = AMBIENT_SOUNDS.find((sound) => sound.id === soundId);

  // Create audio element and set up event listeners
  useEffect(() => {
    if (!currentSound?.url) {
      // Clean up previous audio if switching to 'none'
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    // Create new audio element
    const audio = new Audio(currentSound.url);
    audio.loop = true;
    audio.preload = 'auto';

    // Set up event listeners
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      onLoadEnd?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.(`Failed to load ${currentSound.name} audio`);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Cleanup function
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [currentSound, onLoadStart, onLoadEnd, onError]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle play/pause
  useEffect(() => {
    if (!(audioRef.current && currentSound?.url)) {
      return;
    }

    if (isPlaying && !hasError) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setHasError(true);
          onError?.(`Failed to play ${currentSound.name} audio`);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, hasError, currentSound, onError]);

  // Provide audio context for parent components
  const getAudioContext = useCallback(() => {
    return {
      audio: audioRef.current,
      isLoading,
      hasError,
      currentSound,
    };
  }, [isLoading, hasError, currentSound]);

  // Expose audio context (could be used by parent if needed)
  useEffect(() => {
    // This effect exists to satisfy any future needs for audio context
    getAudioContext();
  }, [getAudioContext]);

  // This component doesn't render anything visible
  return null;
}
