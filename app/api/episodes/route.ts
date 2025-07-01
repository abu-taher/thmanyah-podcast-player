import { NextRequest, NextResponse } from 'next/server';

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
  feedUrl?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const podcastId = searchParams.get('podcastId');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '25');

    if (!podcastId) {
      return NextResponse.json(
        { error: 'Podcast ID is required' },
        { status: 400 }
      );
    }

    // First, get the podcast details to get the feed URL
    const podcastResponse = await fetch(`https://itunes.apple.com/lookup?id=${podcastId}`);
    const podcastData = await podcastResponse.json();
    
    if (!podcastData.results || podcastData.results.length === 0) {
      return NextResponse.json(
        { error: 'Podcast not found' },
        { status: 404 }
      );
    }

    const podcast = podcastData.results[0];
    
    // Search for episodes using the podcast's collection name or artist name
    const searchTerm = encodeURIComponent(podcast.collectionName || podcast.artistName || '');
    const episodesUrl = `https://itunes.apple.com/search?media=podcast&entity=podcastEpisode&term=${searchTerm}&limit=${limit}&offset=${offset}`;
    
    const episodesResponse = await fetch(episodesUrl);
    const episodesData = await episodesResponse.json();

    // Filter episodes that belong to this specific podcast
    let episodes: Episode[] = [];
    if (episodesData.results) {
      episodes = episodesData.results.filter((episode: Episode & { collectionId?: number }) => 
        episode.collectionId === parseInt(podcastId) || 
        episode.artistName === podcast.artistName
      );
    }

    // If we didn't get enough episodes from the filtered results, try a broader search
    if (episodes.length < 5 && episodesData.results) {
      episodes = episodesData.results.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      podcast: podcast,
      episodes: episodes,
      hasMore: episodes.length === limit,
      offset: offset,
      limit: limit,
      total: episodesData.resultCount || episodes.length
    });

  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch episodes',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 