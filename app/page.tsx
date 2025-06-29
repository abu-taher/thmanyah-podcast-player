'use client';

import { useState } from 'react';

interface PodcastResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  trackViewUrl: string;
  primaryGenreName: string;
  trackCount: number;
}

interface SearchResponse {
  success: boolean;
  searchTerm: string;
  resultCount: number;
  results: PodcastResult[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Failed to perform search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            iTunes Podcast Search
          </h1>
          <p className="text-gray-600">
            Search for podcasts using the iTunes Search API
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter podcast name or keyword (e.g., فنجان)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Search Results
              </h2>
                             <p className="text-gray-600">
                 Found {results.resultCount} podcasts for &quot;{results.searchTerm}&quot;
               </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.results.map((podcast) => (
                <div key={podcast.trackId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <img
                      src={podcast.artworkUrl100}
                      alt={podcast.trackName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {podcast.trackName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        by {podcast.artistName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {podcast.primaryGenreName} • {podcast.trackCount} episodes
                      </p>
                      <a
                        href={podcast.trackViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View on iTunes →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <code className="text-sm">
              GET /api/search?term=your-search-keyword
            </code>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Example: <code>/api/search?term=فنجان</code>
          </p>
        </div>
      </div>
    </div>
  );
}
