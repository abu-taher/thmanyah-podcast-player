'use client';

import { useRouter } from 'next/navigation';
import { useAudio } from '../../lib/audio-context';

export default function TestPage() {
  const router = useRouter();
  const { currentEpisode, isPlaying } = useAudio();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Page</h1>
        
        <div className="mb-6">
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Audio Player Status</h2>
          
          {currentEpisode ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={currentEpisode.artworkUrl100 || currentEpisode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
                  alt={currentEpisode.trackName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{currentEpisode.trackName}</h3>
                  <p className="text-slate-400">{currentEpisode.collectionName}</p>
                  <p className="text-sm text-slate-500">{currentEpisode.artistName}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  isPlaying ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
                }`}>
                  {isPlaying ? '▶ Playing' : '⏸ Paused'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">No episode currently selected</p>
          )}
        </div>

        <div className="mt-6 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <p className="text-slate-400 mb-4">
            The audio player should persist when navigating between pages. Try:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Go back to the home page</li>
            <li>Play an episode</li>
            <li>Navigate back to this test page</li>
            <li>The audio should continue playing without interruption</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 