'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio, Episode } from '../lib/audio-context';

// Simple SVG Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const QueueListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
  
  // Use audio context
  const { handleEpisodeClick } = useAudio();
  
  const router = useRouter();
  
  // Ref for the scrollable podcast container
  const podcastScrollRef = useRef<HTMLDivElement>(null);

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

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(searchTerm);
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



  const sidebarItems = [
    { icon: HomeIcon, label: 'Home', active: true },
    { icon: MagnifyingGlassIcon, label: 'Discover', active: false },
  ];

  const bottomSidebarItems = [
    { icon: QueueListIcon, label: 'My Queue', active: false },
    { icon: MicrophoneIcon, label: 'My Podcasts', active: false },
    { icon: ClockIcon, label: 'Recents', active: false }
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                  item.active 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-3">
              Your Stuff
            </div>
            <div className="space-y-1">
              {bottomSidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 text-xs text-slate-500">
          <div>Podbay v2.9.6 by Fancy Soups.</div>
          <div className="mt-1">
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="mx-1">·</span>
            <span className="hover:text-white cursor-pointer">All Podcasts</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Navigation and Search */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search through over 70 million podcasts and episodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
              Log in
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
              Sign up
            </button>
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

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
                <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <EllipsisHorizontalIcon className="w-4 h-4" />
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
              <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                <EllipsisHorizontalIcon className="w-4 h-4" />
              </button>
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
                          src={episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center'}
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
      </div>


    </div>
  );
}
