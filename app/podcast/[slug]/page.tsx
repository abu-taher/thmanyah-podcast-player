'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAudio } from '../../../lib/audio-context';
import { useSidebar } from '../../../lib/sidebar-context';
import Logo from '../../../lib/logo';

// Simple SVG Icon Components
const EllipsisHorizontalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

type PodcastDetails = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  collectionName: string;
  description?: string;
  feedUrl?: string;
  releaseDate?: string;
  primaryGenreName?: string;
  trackCount?: number;
}

type Episode = {
  trackId: number;
  trackName: string;
  description?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
  episodeContentType?: string;
  collectionName?: string;
  artistName?: string;
}

export default function PodcastPage() {
  const params = useParams();
  const { handleEpisodeClick } = useAudio();
  const { setHeaderConfig } = useSidebar();
  
  const [podcast, setPodcast] = useState<PodcastDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure header for this page
  useEffect(() => {
    setHeaderConfig({
      searchPlaceholder: `Search through ${episodes.length} episodes...`,
      searchValue: searchTerm,
      onSearchChange: setSearchTerm,
      episodeCount: episodes.length,
      hideSearchBar: true,
    });
  }, [searchTerm, episodes.length, setHeaderConfig]);

  // Filter episodes based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEpisodes(episodes);
    } else {
      const filtered = episodes.filter(episode =>
        episode.trackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (episode.description && episode.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEpisodes(filtered);
    }
  }, [searchTerm, episodes]);

  const fetchPodcastDetails = useCallback(async () => {
    if (!params.slug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching podcast details for ID:', params.slug);
      
      // Call our episodes API
      const response = await fetch(`/api/episodes?podcastId=${params.slug}`);
      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch podcast details');
      }
      
      if (data.success && data.podcast && data.episodes) {
        console.log('Successfully fetched podcast:', data.podcast.trackName);
        console.log('Episodes count:', data.episodes.length);
        setPodcast(data.podcast);
        setEpisodes(data.episodes.slice(0, 20)); // Show first 20 episodes
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Error fetching podcast details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch podcast details');
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return '0:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    fetchPodcastDetails();
  }, [fetchPodcastDetails]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <Logo width={64} height={70} animated={true} />
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Podcast not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Podcast Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Podcast Cover */}
            <div className="flex-shrink-0">
              <Image
                src={podcast.artworkUrl600 || podcast.artworkUrl100 || ''}
                alt={podcast.trackName}
                width={320}
                height={320}
                className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* Podcast Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{podcast.trackName}</h1>
                <p className="text-slate-400 text-lg">{podcast.artistName}</p>
              </div>

              {/* Description */}
              {podcast.description && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">About</h2>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {podcast.description.length > 300 
                      ? `${podcast.description.slice(0, 300)}...` 
                      : podcast.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Episodes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Episodes</h2>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {filteredEpisodes.map((episode, index) => (
                <div 
                  key={`${episode.trackId}-${index}`} 
                  className="flex items-start space-x-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => handleEpisodeClick({
                    ...episode,
                    collectionName: episode.collectionName || podcast.trackName,
                    artistName: episode.artistName || podcast.artistName
                  })}
                >
                  {/* Episode Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={episode.artworkUrl100 || episode.artworkUrl60 || podcast.artworkUrl100 || ''}
                      alt={episode.trackName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                      {episode.trackName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                      <span>{formatDate(episode.releaseDate)}</span>
                      <span>{formatDuration(episode.trackTimeMillis)}</span>
                    </div>
                    {episode.description && (
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {episode.description}
                      </p>
                    )}
                  </div>

                  {/* More Options */}
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-700 rounded-lg transition-all">
                    <EllipsisHorizontalIcon className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>



          </div>
        </div>
      </div>
    </div>
  );
} 