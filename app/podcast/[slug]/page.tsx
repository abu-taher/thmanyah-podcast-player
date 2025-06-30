'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Simple SVG Icon Components
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface PodcastDetails {
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

export default function PodcastPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [podcast, setPodcast] = useState<PodcastDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        // The slug should be the trackId from the main page
        const response = await fetch(`https://itunes.apple.com/lookup?id=${slug}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setPodcast(data.results[0]);
        }
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPodcastDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Podcast not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 px-8 py-4">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Podcast Image */}
            <div className="flex-shrink-0">
              <img
                src={podcast.artworkUrl600 || podcast.artworkUrl100 || ''}
                alt={podcast.trackName}
                className="w-80 h-80 rounded-lg object-cover shadow-2xl"
              />
            </div>

            {/* Podcast Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{podcast.trackName}</h1>
              <p className="text-xl text-slate-300 mb-6">by {podcast.artistName}</p>
              
              {podcast.primaryGenreName && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {podcast.primaryGenreName}
                  </span>
                </div>
              )}

              {podcast.trackCount && (
                <p className="text-slate-400 mb-4">{podcast.trackCount} episodes</p>
              )}

              {podcast.releaseDate && (
                <p className="text-slate-400 mb-6">
                  Released: {new Date(podcast.releaseDate).toLocaleDateString()}
                </p>
              )}

              <div className="flex space-x-4 mb-8">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
                  <PlayIcon className="w-5 h-5" />
                  <span>Play Latest Episode</span>
                </button>
                <button className="px-6 py-3 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>

              {podcast.description && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-slate-300 leading-relaxed">{podcast.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 