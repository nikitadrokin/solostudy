/**
 * Utility to create placeholder audio files for development
 * This creates simple audio contexts that can be used for testing
 */

export function createSilentAudioBlob(duration = 5): Blob {
  // Create a simple audio context to generate silence
  const sampleRate = 44_100;
  const numChannels = 1;
  const numSamples = sampleRate * duration;

  // Create WAV file header
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Fill with silence (zeros)
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, 0, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export function createSimpleToneBlob(
  frequency = 440,
  duration = 5,
  volume = 0.1
): Blob {
  const sampleRate = 44_100;
  const numChannels = 1;
  const numSamples = sampleRate * duration;

  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header (same as above)
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Generate simple sine wave
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequency * time) * volume * 32_767;
    view.setInt16(44 + i * 2, sample, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// Create placeholder URLs for development
export const createPlaceholderAudioUrls = () => {
  const urls: Record<string, string> = {};

  // Create different tones for different sounds
  const sounds = [
    { id: 'rain', frequency: 200, volume: 0.05 },
    { id: 'forest', frequency: 300, volume: 0.03 },
    { id: 'cafe', frequency: 150, volume: 0.04 },
    { id: 'ocean', frequency: 100, volume: 0.06 },
    { id: 'white-noise', frequency: 1000, volume: 0.02 },
    { id: 'fireplace', frequency: 80, volume: 0.05 },
  ];

  for (const { id, frequency, volume } of sounds) {
    const blob = createSimpleToneBlob(frequency, 10, volume);
    urls[id] = URL.createObjectURL(blob);
  }

  return urls;
};
