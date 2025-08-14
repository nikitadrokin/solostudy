'use client';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AMBIENT_SOUNDS, type AmbientSoundId } from './ambient-player';

interface AmbientControlsProps {
  selectedSound: AmbientSoundId;
  onSoundChange: (soundId: AmbientSoundId) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function AmbientControls({
  selectedSound,
  onSoundChange,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  isLoading = false,
  error,
}: AmbientControlsProps) {
  const selectedSoundInfo = AMBIENT_SOUNDS.find(
    (sound) => sound.id === selectedSound
  );

  return (
    <div className="space-y-4">
      <h3 className="mb-2 font-medium">Ambient Sounds</h3>

      {/* Sound Selection */}
      <div className="space-y-2">
        <Label htmlFor="ambient-sound">Sound Environment</Label>
        <select
          className="w-full rounded border bg-background px-3 py-2"
          id="ambient-sound"
          onChange={(e) => onSoundChange(e.target.value as AmbientSoundId)}
          value={selectedSound}
        >
          {AMBIENT_SOUNDS.map((sound) => (
            <option key={sound.id} value={sound.id}>
              {sound.icon} {sound.name}
            </option>
          ))}
        </select>

        {/* Sound Description */}
        {selectedSoundInfo && selectedSoundInfo.id !== 'none' && (
          <p className="text-muted-foreground text-xs">
            {selectedSoundInfo.description}
          </p>
        )}
      </div>

      {/* Volume Control - Only show if not 'none' */}
      {selectedSound !== 'none' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ambient-volume">Ambient Volume</Label>
            <span className="text-muted-foreground text-sm">
              {isMuted ? 'Muted' : `${volume}%`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="shrink-0"
              disabled={isLoading}
              onClick={onMuteToggle}
              size="sm"
              variant="outline"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <input
              className="flex-1"
              disabled={isLoading}
              id="ambient-volume"
              max="100"
              min="0"
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              type="range"
              value={isMuted ? 0 : volume}
            />
          </div>
        </div>
      )}

      {/* Loading/Error States */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          Loading audio...
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Audio Presets Placeholder */}
      <div className="space-y-2">
        <Label>Audio Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button className="text-xs" disabled size="sm" variant="outline">
            🎯 Focus Mode
          </Button>
          <Button className="text-xs" disabled size="sm" variant="outline">
            😌 Relaxed
          </Button>
          <Button className="text-xs" disabled size="sm" variant="outline">
            ☕ Coffee Shop
          </Button>
          <Button className="text-xs" disabled size="sm" variant="outline">
            🌿 Nature
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Preset saving coming in Phase 5
        </p>
      </div>
    </div>
  );
}
