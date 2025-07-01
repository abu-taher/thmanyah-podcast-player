'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio, Episode } from '../lib/audio-context';
import { useSidebar } from '../lib/sidebar-context';

// Simple SVG Icon Components
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

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

// Type for iTunes API podcast data
type Podcast = {
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

// Helper function to format duration from milliseconds
const formatDuration = (milliseconds?: number): string => {
  if (!milliseconds) return '0:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('فنجان'); // Track the current search term for display
  
  // Use audio context and sidebar context
  const { handleEpisodeClick } = useAudio();
  const { setHeaderConfig } = useSidebar();
  
  const router = useRouter();
  
  // Ref for the scrollable podcast container
  const podcastScrollRef = useRef<HTMLDivElement>(null);

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(searchTerm);
    }
  };

  // Configure header on mount and when search term changes
  useEffect(() => {
    setHeaderConfig({
      searchPlaceholder: "Search through over 70 million podcasts and episodes...",
      searchValue: searchTerm,
      onSearchChange: setSearchTerm,
      onSearchKeyPress: handleSearchKeyPress,
    });
  }, [searchTerm, setHeaderConfig]);

  // Function to scroll podcasts left
  const scrollPodcastsLeft = () => {
    if (podcastScrollRef.current) {
      const scrollAmount = 200; // Adjust this value to control scroll distance
      podcastScrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Function to scroll podcasts right
  const scrollPodcastsRight = () => {
    if (podcastScrollRef.current) {
      const scrollAmount = 200; // Adjust this value to control scroll distance
      podcastScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Function to perform search using the API
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setEpisodesLoading(true);
      setError(null);
      setCurrentSearchTerm(searchQuery);
      
      // Call our search API
      const response = await fetch(`/api/search?term=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }
      
      if (data.success && data.results) {
        // Filter podcasts and episodes from the results
        const podcastResults = data.results.filter((item: { wrapperType?: string }) => item.wrapperType === 'track' || !item.wrapperType);
        const episodeResults = data.results.filter((item: { wrapperType?: string }) => item.wrapperType === 'podcastEpisode');
        
        setPodcasts(podcastResults);
        setEpisodes(episodeResults);
        
        // If no podcast-specific results, try a broader search for episodes
        if (episodeResults.length === 0) {
          const episodeResponse = await fetch(`https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(searchQuery)}&entity=podcastEpisode`);
          const episodeData = await episodeResponse.json();
          if (episodeData.results) {
            console.log('Episode search results:', episodeData.results.slice(0, 2)); // Log first 2 episodes to see structure
            console.log('First episode previewUrl:', episodeData.results[0]?.previewUrl);
            setEpisodes(episodeData.results);
          }
        } else {
          console.log('Found episodes in main search:', episodeResults.slice(0, 2)); // Log first 2 episodes to see structure
          console.log('First episode previewUrl:', episodeResults[0]?.previewUrl);
        }
      } else {
        setPodcasts([]);
        setEpisodes([]);
      }
      
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to search podcasts and episodes.');
      setPodcasts([]);
      setEpisodes([]);
    } finally {
      setLoading(false);
      setEpisodesLoading(false);
    }
  };

  // Fetch initial data on page load
  useEffect(() => {
    performSearch('فنجان'); // Load initial content
  }, []);

  // Watch for empty search term and refetch main content
  useEffect(() => {
    if (searchTerm === '' && currentSearchTerm !== 'فنجان') {
      performSearch('فنجان');
    }
  }, [searchTerm, currentSearchTerm]);

  // Handle podcast click
  const handlePodcastClick = (podcast: Podcast) => {
    router.push(`/podcast/${podcast.trackId}`);
  };

  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Top Podcasts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top podcasts for {currentSearchTerm}</h2>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                onClick={scrollPodcastsLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                onClick={scrollPodcastsRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-xl text-slate-400">Loading podcasts...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-xl text-red-400">{error}</div>
            </div>
          ) : (
            <div className="relative">
              <div ref={podcastScrollRef} className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                  {podcasts.map((podcast: Podcast) => (
                    <div 
                      key={podcast.trackId} 
                      className="group cursor-pointer flex-shrink-0"
                      onClick={() => handlePodcastClick(podcast)}
                      style={{ width: '180px' }}
                    >
                      <div className="relative mb-3">
                        <img
                          src={podcast.artworkUrl600 || podcast.artworkUrl100 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop&crop=center'}
                          alt={podcast.trackName}
                          className="w-full aspect-square rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white truncate text-sm">{podcast.trackName}</h3>
                        <p className="text-xs text-slate-400 truncate">{podcast.artistName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Episodes Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top episodes for {currentSearchTerm}</h2>
          </div>

          {episodesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-xl text-slate-400">Loading episodes...</div>
            </div>
          ) : episodes.length > 0 ? (
            <div className="flex gap-6 flex-1">
              {/* Left Column */}
              <div className="flex-1 space-y-3">
                {episodes.slice(0, 4).map((episode) => (
                  <div key={episode.trackId} className="group flex items-center space-x-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => handleEpisodeClick(episode)}>
                    <div className="relative">
                      <img
                        src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
                        alt={episode.trackName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        {episode.previewUrl ? (
                          <PlayIcon className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 text-slate-400 text-xs">🚫</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm">{episode.trackName}</h3>
                      <p className="text-xs text-slate-400 truncate">{episode.collectionName}</p>
                      <p className="text-xs text-slate-500 truncate">{episode.artistName}</p>
                      {!episode.previewUrl && (
                        <p className="text-xs text-red-400">No audio available</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-xs text-slate-400">{formatDuration(episode.trackTimeMillis)}</span>
                      <button className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle Column */}
              <div className="flex-1 space-y-3">
                {episodes.slice(4, 8).map((episode) => (
                  <div key={episode.trackId} className="group flex items-center space-x-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => handleEpisodeClick(episode)}>
                    <div className="relative">
                      <img
                        src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center'}
                        alt={episode.trackName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        {episode.previewUrl ? (
                          <PlayIcon className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 text-slate-400 text-xs">🚫</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm">{episode.trackName}</h3>
                      <p className="text-xs text-slate-400 truncate">{episode.collectionName}</p>
                      <p className="text-xs text-slate-500 truncate">{episode.artistName}</p>
                      {!episode.previewUrl && (
                        <p className="text-xs text-red-400">No audio available</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-xs text-slate-400">{formatDuration(episode.trackTimeMillis)}</span>
                      <button className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-3">
                {episodes.slice(8, 12).map((episode) => (
                  <div key={episode.trackId} className="group flex items-center space-x-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => handleEpisodeClick(episode)}>
                    <div className="relative">
                      <img
                        src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center'}
                        alt={episode.trackName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        {episode.previewUrl ? (
                          <PlayIcon className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 text-slate-400 text-xs">🚫</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm">{episode.trackName}</h3>
                      <p className="text-xs text-slate-400 truncate">{episode.collectionName}</p>
                      <p className="text-xs text-slate-500 truncate">{episode.artistName}</p>
                      {!episode.previewUrl && (
                        <p className="text-xs text-red-400">No audio available</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-xs text-slate-400">{formatDuration(episode.trackTimeMillis)}</span>
                      <button className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-xl text-slate-400">No episodes found</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
