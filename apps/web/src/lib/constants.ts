/** Background the focus room falls back to, and the one the landing page shows. */
export const DEFAULT_VIDEO_ID = 'jfKfPfyJRdk';

// YouTube URL validation patterns
export const YOUTUBE_VALIDATION_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];
