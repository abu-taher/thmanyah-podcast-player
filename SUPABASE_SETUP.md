# Supabase Setup Guide

This guide will help you set up Supabase to store search results from the iTunes Podcast Search API.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js and npm installed
- This Next.js project already set up

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `itunes-podcast-search` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (1-2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials from Step 2.

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database/schema.sql` into the editor
3. Click "Run" to execute the SQL
4. Verify that the tables were created by checking **Table Editor**

You should see two new tables:
- `searches` - stores search queries and metadata
- `podcasts` - stores individual podcast results

## Step 5: Configure Row Level Security (Optional)

The schema includes basic RLS policies that allow all operations. For production, you may want to:

1. Restrict access based on user authentication
2. Add rate limiting
3. Implement more granular permissions

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Perform a search (e.g., "فنجان" or "tech")

4. Check your Supabase dashboard:
   - Go to **Table Editor** → **searches** to see search records
   - Go to **Table Editor** → **podcasts** to see podcast results

## API Endpoints

### Search Podcasts (with database saving)
```
GET /api/search?term=your-keyword
```

**Response:**
```json
{
  "success": true,
  "searchTerm": "فنجان",
  "resultCount": 17,
  "searchId": "uuid-of-saved-search",
  "results": [...]
}
```

### Get Search History
```
GET /api/history?limit=10
```

**Response:**
```json
{
  "success": true,
  "searches": [
    {
      "id": "uuid",
      "search_term": "فنجان",
      "result_count": 17,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Specific Search with Results
```
GET /api/history?searchId=uuid
```

**Response:**
```json
{
  "success": true,
  "search": {
    "id": "uuid",
    "search_term": "فنجان",
    "result_count": 17,
    "created_at": "2024-01-15T10:30:00Z",
    "podcasts": [...]
  }
}
```

## Database Schema

### searches table
- `id` (UUID, Primary Key)
- `search_term` (Text) - The search keyword
- `result_count` (Integer) - Number of results found
- `created_at` (Timestamp) - When the search was performed

### podcasts table
- `id` (UUID, Primary Key)
- `search_id` (UUID, Foreign Key) - Links to searches table
- `track_id` (BigInt) - iTunes track ID
- `track_name` (Text) - Podcast name
- `artist_name` (Text) - Podcast creator/network
- `collection_name` (Text) - Collection name
- `artwork_url_100` (Text) - Podcast artwork URL
- `track_view_url` (Text) - iTunes link
- `primary_genre_name` (Text) - Podcast category
- `track_count` (Integer) - Number of episodes
- `feed_url` (Text) - RSS feed URL
- `created_at` (Timestamp) - When the record was saved

## Troubleshooting

### Environment Variables Not Working
- Ensure `.env.local` is in the project root
- Restart your development server after adding variables
- Check that variable names match exactly (including `NEXT_PUBLIC_` prefix)

### Database Connection Errors
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active (not paused)
- Ensure RLS policies allow the operations you're trying to perform

### Table Creation Errors
- Make sure you're running the SQL in the correct database
- Check for syntax errors in the schema file
- Verify you have proper permissions in your Supabase project

## Security Considerations

- **Environment Variables**: Never commit `.env.local` to version control
- **API Keys**: The anon key is safe to use in frontend code, but consider implementing user authentication for production
- **Rate Limiting**: Consider implementing rate limiting to prevent abuse
- **Data Validation**: Always validate and sanitize user inputs

## Next Steps

- Implement user authentication with Supabase Auth
- Add search analytics and trending searches
- Create a favorites system for podcasts
- Add full-text search capabilities across saved podcasts
- Implement caching strategies for frequently searched terms 