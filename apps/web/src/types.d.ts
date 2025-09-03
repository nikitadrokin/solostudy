/**
 * YouTube thumbnail data structure
 */
export interface YoutubeThumbnail {
  url: string;
  height: number;
  width: number;
  id?: string;
  resolution?: string;
}

/**
 * Individual video entry in a YouTube playlist
 */
export interface YoutubeVideoEntry {
  _type: 'url';
  ie_key: 'Youtube';
  id: string;
  url: string;
  title: string;
  description: string | null;
  duration: number | null;
  channel_id: string | null;
  channel: string | null;
  channel_url: string | null;
  uploader: string | null;
  uploader_id: string | null;
  uploader_url: string | null;
  thumbnails: YoutubeThumbnail[];
  timestamp: number | null;
  release_timestamp: number | null;
  availability: string | null;
  view_count?: number | null;
  concurrent_view_count?: number | null;
  live_status: string | null;
  channel_is_verified: boolean | null;
  __x_forwarded_for_ip: string | null;
}

/**
 * YouTube playlist data structure for ambient/background videos
 */
export interface YoutubePlaylist {
  id: string;
  title: string;
  availability: string;
  channel_follower_count: number | null;
  description: string;
  tags: string[];
  thumbnails: YoutubeThumbnail[];
  modified_date: string;
  view_count: number;
  playlist_count: number;
  channel: string | null;
  channel_id: string | null;
  uploader_id: string | null;
  uploader: string | null;
  channel_url: string | null;
  uploader_url: string | null;
  _type: 'playlist';
  entries: YoutubeVideoEntry[];
  extractor_key: string;
  extractor: string;
  webpage_url: string;
  original_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  release_year: number | null;
  epoch: number;
  __files_to_move: Record<string, string>;
  _version: {
    version: string;
    current_git_head: string | null;
    release_git_head: string | null;
    repository: string;
  };
}

/**
 * Simplified video data for dropdown menu rendering
 */
export interface AmbientVideoOption {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string;
  channel: string;
}
