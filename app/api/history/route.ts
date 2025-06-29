import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchId = searchParams.get('searchId');

    if (searchId) {
      // Get specific search with its podcast results
      const { data: searchData, error: searchError } = await supabase
        .from('searches')
        .select(`
          *,
          podcasts (*)
        `)
        .eq('id', searchId)
        .single();

      if (searchError) {
        return NextResponse.json(
          { error: 'Search not found', message: searchError.message },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        search: searchData
      });
    } else {
      // Get recent searches (without full podcast details)
      const { data: searches, error } = await supabase
        .from('searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch search history', message: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        searches: searches
      });
    }
  } catch (error) {
    console.error('Error fetching search history:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch search history',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 