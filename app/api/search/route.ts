import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type iTunesPodcast = {
  trackId: number;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  trackCount?: number;
  feedUrl?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get the search term from query parameters
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get('term');
    const entity = searchParams.get('entity'); // Allow specifying entity type

    // Validate that term is provided
    if (!term) {
      return NextResponse.json(
        { error: 'Search term is required. Please provide a "term" query parameter.' },
        { status: 400 }
      );
    }

    // Encode the search term for URL
    const encodedTerm = encodeURIComponent(term);
    
    // Construct iTunes Search API URL with optional entity parameter
    let itunesUrl = `https://itunes.apple.com/search?media=podcast&term=${encodedTerm}`;
    if (entity) {
      itunesUrl += `&entity=${entity}`;
    }

    // Make request to iTunes API
    const response = await fetch(itunesUrl);
    
    if (!response.ok) {
      throw new Error(`iTunes API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Save search to database
    let searchId: string | null = null;
    try {
      // Insert search record
      const { data: searchData, error: searchError } = await supabase
        .from('searches')
        .insert({
          search_term: term,
          result_count: data.resultCount
        })
        .select('id')
        .single();

      if (searchError) {
        console.error('Error saving search:', searchError);
      } else {
        searchId = searchData.id;
        console.log(`✅ Search saved to database with ID: ${searchId}`);

        // Save podcast results
        if (data.results && data.results.length > 0) {
          const podcastRecords = data.results.map((podcast: iTunesPodcast) => ({
            search_id: searchId,
            track_id: podcast.trackId,
            track_name: podcast.trackName || podcast.collectionName,
            artist_name: podcast.artistName,
            collection_name: podcast.collectionName,
            artwork_url_100: podcast.artworkUrl100,
            track_view_url: podcast.trackViewUrl,
            primary_genre_name: podcast.primaryGenreName,
            track_count: podcast.trackCount || 0,
            feed_url: podcast.feedUrl
          }));

          const { error: podcastError } = await supabase
            .from('podcasts')
            .insert(podcastRecords);

          if (podcastError) {
            console.error('Error saving podcasts:', podcastError);
          } else {
            console.log(`✅ Saved ${podcastRecords.length} podcast results to database`);
          }
        }
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      // Continue execution even if database save fails
    }

    // Return the results
    return NextResponse.json({
      success: true,
      searchTerm: term,
      resultCount: data.resultCount,
      results: data.results,
      searchId: searchId // Include the database ID for reference
    });

  } catch (error) {
    console.error('Error searching iTunes API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to search iTunes API',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 