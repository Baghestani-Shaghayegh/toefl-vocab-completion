# LexiLift - Auth & Database Setup

## Supabase Setup Instructions

### 1. Create a Supabase Project
- Go to https://supabase.com
- Create a new project
- Copy your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Add them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### 2. Create the Users Table
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/create_users_table.sql`
5. Paste and run the query

This will create:
- A `users` table linked to Supabase Auth
- Row Level Security (RLS) policies so users can only read/update their own profile
- Indexes for fast email lookups

### 3. Enable Email Authentication
1. Go to Authentication → Providers
2. Make sure Email is enabled (it should be by default)
3. Under Email Templates, you can customize the confirmation email if desired

## How It Works

### Sign Up Flow
1. User fills in First Name, Last Name, Email, Password on `/auth?view=signup`
2. Supabase creates an auth user (stores email/password securely)
3. User profile is inserted into the `users` table with their info
4. User is redirected to `/practice`

### Login Flow
1. User enters Email & Password on `/auth?view=login`
2. Supabase verifies credentials
3. User is redirected to `/practice`

### Security
- All passwords are hashed by Supabase Auth
- RLS policies ensure users can only see their own data
- Email is unique per user
- All timestamps are in UTC

## Environment Variables
```env
# .env.local (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema

### users table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, linked to auth.users |
| email | text | Unique, required |
| first_name | text | Optional |
| last_name | text | Optional |
| created_at | timestamp | Auto-set on insert |
| updated_at | timestamp | Auto-updated |

## Next Steps
- Connect Google OAuth (optional)
- Add password reset functionality
- Create user profile page
- Add practice history tracking