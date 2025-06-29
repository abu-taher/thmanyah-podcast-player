-- Create searches table to store search history
CREATE TABLE IF NOT EXISTS searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create podcasts table to store individual podcast results
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  track_id BIGINT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  collection_name TEXT,
  artwork_url_100 TEXT,
  track_view_url TEXT,
  primary_genre_name TEXT,
  track_count INTEGER DEFAULT 0,
  feed_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure we don't duplicate the same podcast for the same search
  UNIQUE(search_id, track_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_searches_term ON searches(search_term);
CREATE INDEX IF NOT EXISTS idx_podcasts_search_id ON podcasts(search_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_track_id ON podcasts(track_id);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your use case)
CREATE POLICY "Allow all operations on searches" ON searches
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on podcasts" ON podcasts
  FOR ALL USING (true); 