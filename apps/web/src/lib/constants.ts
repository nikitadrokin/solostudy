/** Background the focus room falls back to. */
export const DEFAULT_VIDEO_ID = 'jfKfPfyJRdk';

/**
 * Backdrop for the landing page hero. Deliberately not DEFAULT_VIDEO_ID: the
 * landing page has to render for a first-time visitor, so it points at a video
 * confirmed to allow off-site embedding and to serve a poster frame.
 */
export const LANDING_BACKDROP_VIDEO_ID = 'SE5ByHj0HDA';

// YouTube URL validation patterns
export const YOUTUBE_VALIDATION_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];
