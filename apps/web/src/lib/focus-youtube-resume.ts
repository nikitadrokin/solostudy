const STORAGE_KEY = 'solostudy:focus-youtube-resume';

/** Persisted shape for resuming the focus-room embed after a full reload. */
export type FocusYouTubeResumePayload = {
  /** YouTube video id (11 chars). */
  videoId: string;
  /** Playback position in seconds. */
  seconds: number;
  /** Unix ms when written (for optional staleness checks). */
  updatedAt: number;
};

/**
 * Reads the last saved position for this video from sessionStorage, if any.
 */
export function readFocusYouTubeResume(videoId: string): number | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as FocusYouTubeResumePayload;
    if (
      typeof parsed.videoId !== 'string' ||
      parsed.videoId !== videoId ||
      typeof parsed.seconds !== 'number' ||
      !Number.isFinite(parsed.seconds) ||
      parsed.seconds <= 0
    ) {
      return;
    }

    return Math.floor(parsed.seconds);
  } catch {
    return;
  }
}

/**
 * Saves playback position for the focus-room YouTube embed (same tab / session).
 */
export function writeFocusYouTubeResume(
  videoId: string,
  seconds: number
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (
    !videoId ||
    typeof seconds !== 'number' ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return;
  }

  try {
    const payload: FocusYouTubeResumePayload = {
      videoId,
      seconds: Math.floor(seconds),
      updatedAt: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode — ignore
  }
}
