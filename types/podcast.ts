// Podcast-related types for iTunes API data

export interface Podcast {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  collectionName?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  trackCount?: number;
}

export interface PodcastDetails extends Podcast {
  description?: string;
  feedUrl?: string;
}

export interface Episode {
  trackId: number;
  trackName: string;
  collectionName: string;
  artistName: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  trackTimeMillis?: number;
  releaseDate?: string;
  description?: string;
  shortDescription?: string;
  previewUrl?: string;
  episodeUrl?: string;
  episodeContentType?: string;
} 