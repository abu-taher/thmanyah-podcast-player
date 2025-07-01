import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type SearchRecord = {
  id: string
  search_term: string
  result_count: number
  created_at: string
}

export type PodcastRecord = {
  id: string
  search_id: string
  track_id: number
  track_name: string
  artist_name: string
  collection_name: string
  artwork_url_100: string
  track_view_url: string
  primary_genre_name: string
  track_count: number
  feed_url?: string
  created_at: string
} 