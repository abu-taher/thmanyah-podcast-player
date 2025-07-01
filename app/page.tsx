'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAudio } from '../contexts/audio-context';
import { useSidebar } from '../contexts/sidebar-context';
import { Episode, Podcast } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon, PlayIcon } from '../components/ui/icons';
import { formatDuration } from '../lib/utils/format';
import Logo from '../lib/logo';





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
  
  // Refs for the scrollable containers
  const podcastScrollRef = useRef<HTMLDivElement>(null);
  const episodeScrollRef = useRef<HTMLDivElement>(null);

  // Function to perform search using the API
  const performSearch = useCallback(async (searchQuery: string) => {
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
  }, []);

  // Handle Enter key press in search input
  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(searchTerm);
    }
  }, [searchTerm, performSearch]);

  // Configure header on mount and when search term changes
  useEffect(() => {
    const handleBackClick = () => {
      // Clear search and return to default content
      setSearchTerm('');
      performSearch('فنجان'); // Reset to default content
    };

    setHeaderConfig({
      searchPlaceholder: "Search through over 70 million podcasts and episodes...",
      searchValue: searchTerm,
      onSearchChange: setSearchTerm,
      onSearchKeyPress: handleSearchKeyPress,
      onBackClick: searchTerm ? handleBackClick : undefined, // Only provide custom handler when there's a search
    });
  }, [searchTerm, setHeaderConfig, handleSearchKeyPress, performSearch]);

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

  // Function to scroll episodes left
  const scrollEpisodesLeft = () => {
    if (episodeScrollRef.current) {
      const scrollAmount = window.innerWidth; // Scroll by full viewport width
      episodeScrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Function to scroll episodes right
  const scrollEpisodesRight = () => {
    if (episodeScrollRef.current) {
      const scrollAmount = window.innerWidth; // Scroll by full viewport width
      episodeScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fetch initial data on page load
  useEffect(() => {
    performSearch('فنجان'); // Load initial content
  }, [performSearch]);

  // Watch for empty search term and refetch main content
  useEffect(() => {
    if (searchTerm === '' && currentSearchTerm !== 'فنجان') {
      performSearch('فنجان');
    }
  }, [searchTerm, currentSearchTerm, performSearch]);

  // Handle podcast click
  const handlePodcastClick = (podcast: Podcast) => {
    router.push(`/podcast/${podcast.trackId}`);
  };

  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 custom-scrollbar mobile-scroll">
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
              <Logo width={64} height={70} animated={true} />
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
                        <Image
                          src={podcast.artworkUrl600 || podcast.artworkUrl100 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop&crop=center'}
                          alt={podcast.trackName}
                          width={180}
                          height={180}
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
            <div className="flex items-center space-x-2 lg:hidden">
              <button 
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                onClick={scrollEpisodesLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                onClick={scrollEpisodesRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {episodesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Logo width={64} height={70} animated={true} />
            </div>
          ) : episodes.length > 0 ? (
            <>
              {/* Mobile horizontal scroll layout */}
              <div className="lg:hidden">
                <div className="relative">
                  <div ref={episodeScrollRef} className="overflow-x-auto scrollbar-hide">
                    <div className="flex pb-4" style={{ width: 'max-content' }}>
                      {Array.from({ length: Math.ceil(episodes.length / 4) }, (_, columnIndex) => (
                        <div key={columnIndex} className="flex-shrink-0 w-full space-y-3 pr-6" style={{ width: '100vw', paddingRight: '24px' }}>
                          {episodes.slice(columnIndex * 4, (columnIndex + 1) * 4).map((episode) => (
                            <div 
                              key={episode.trackId} 
                              className="group cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-4 transition-colors"
                              onClick={() => handleEpisodeClick(episode)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Image
                                    src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
                                    alt={episode.trackName}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    {episode.previewUrl ? (
                                      <PlayIcon className="w-4 h-4 text-white" />
                                    ) : (
                                      <div className="w-4 h-4 text-slate-400 text-xs flex items-center justify-center">🚫</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-white text-sm mb-1 leading-tight line-clamp-2">{episode.trackName}</h3>
                                  <p className="text-xs text-slate-400 truncate">{episode.collectionName}</p>
                                  <p className="text-xs text-slate-500 truncate">{episode.artistName}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400">{formatDuration(episode.trackTimeMillis)}</span>
                                    {!episode.previewUrl && (
                                      <span className="text-xs text-red-400">No audio</span>
                                    )}
                                  </div>
                                </div>
                                <button className="p-1 rounded-full hover:bg-slate-700 transition-colors flex-shrink-0">
                                  <EllipsisHorizontalIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop responsive grid layout */}
              <div className="hidden lg:grid gap-4 xl:gap-6 flex-1 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {episodes.slice(0, 12).map((episode) => (
                  <div key={episode.trackId} className="group flex items-center space-x-3 lg:space-x-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => handleEpisodeClick(episode)}>
                    <div className="relative flex-shrink-0">
                      <Image
                        src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
                        alt={episode.trackName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        {episode.previewUrl ? (
                          <PlayIcon className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 text-slate-400 text-xs flex items-center justify-center">🚫</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-white truncate text-sm leading-tight">{episode.trackName}</h3>
                      <p className="text-xs text-slate-400 truncate">{episode.collectionName}</p>
                      <p className="text-xs text-slate-500 truncate">{episode.artistName}</p>
                      {!episode.previewUrl && (
                        <p className="text-xs text-red-400">No audio available</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                      <span className="text-xs text-slate-400">{formatDuration(episode.trackTimeMillis)}</span>
                      <button className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
