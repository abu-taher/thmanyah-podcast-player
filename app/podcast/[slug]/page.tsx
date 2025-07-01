'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAudio } from '../../../lib/audio-context';
import { useSidebar } from '../../../lib/sidebar-context';

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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const RssIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
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
  const [episodesLoading, setEpisodesLoading] = useState(true);
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

  const fetchPodcastDetails = async () => {
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
      setEpisodesLoading(false);
    }
  };

  const refreshEpisodes = () => {
    fetchPodcastDetails();
  };

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
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading podcast details...</div>
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
              <img
                src={podcast.artworkUrl600 || podcast.artworkUrl100 || ''}
                alt={podcast.trackName}
                className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* Podcast Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{podcast.trackName}</h1>
                <p className="text-slate-400 text-lg">{podcast.artistName}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg transition-colors font-medium">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add to My Podcasts</span>
                </button>
                <button 
                  onClick={refreshEpisodes}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors font-medium"
                  disabled={episodesLoading}
                >
                  <RefreshIcon className={`w-5 h-5 ${episodesLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh episodes</span>
                </button>
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

              {/* Social Share */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Share</h3>
                <div className="flex space-x-3">
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <TwitterIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <FacebookIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <LinkedInIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="flex space-x-6 text-sm">
                <a href="#" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                  <LinkIcon className="w-4 h-4" />
                  <span>Website</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                  <RssIcon className="w-4 h-4" />
                  <span>RSS</span>
                </a>
              </div>
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
                    <img
                      src={episode.artworkUrl100 || episode.artworkUrl60 || podcast.artworkUrl100 || ''}
                      alt={episode.trackName}
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