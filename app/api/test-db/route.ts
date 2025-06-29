import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');

    // Test 1: Check if we can connect to Supabase
    const { error: connectionError } = await supabase
      .from('searches')
      .select('count')
      .limit(1);

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 });
    }

    // Test 2: Get recent searches to show what's been saved
    const { data: recentSearches, error: searchError } = await supabase
      .from('searches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (searchError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch recent searches',
        details: searchError.message
      }, { status: 500 });
    }

    // Test 3: Get total counts
    const { count: totalSearches } = await supabase
      .from('searches')
      .select('*', { count: 'exact', head: true });

    const { count: totalPodcasts } = await supabase
      .from('podcasts')
      .select('*', { count: 'exact', head: true });

    console.log('✅ Database tests completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Database is working correctly!',
      stats: {
        totalSearches: totalSearches || 0,
        totalPodcasts: totalPodcasts || 0,
        connection: 'Connected'
      },
      recentSearches: recentSearches || [],
      instructions: {
        next: 'Try searching for podcasts at /api/search?term=فنجان',
        verify: 'Check your Supabase dashboard → Table Editor to see saved data'
      }
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: {
        envVars: 'Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set',
        tables: 'Ensure tables are created using database/schema.sql',
        supabase: 'Verify your Supabase project is active'
      }
    }, { status: 500 });
  }
} 