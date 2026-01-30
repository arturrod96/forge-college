# Supabase Setup Guide

## Security-First Configuration

This application uses environment variables for all Supabase configuration to ensure no sensitive information is committed to the public repository.

## Required Environment Variables

You **must** set these environment variables for the application to work:

```bash
VITE_SUPABASE_URL=https://fdeblavnrrnoyqivydsg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI
```

## How to Set Up

### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual credentials:
   ```bash
   VITE_SUPABASE_URL=https://fdeblavnrrnoyqivydsg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI
   ```

### For Staging/Production Deployment

Set these environment variables in your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=https://fdeblavnrrnoyqivydsg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI
```

## Security Considerations

### ✅ What's Safe to Share
- **Anon Key**: This is designed to be public and safe for client-side use
- **Project URL**: This is also public information

### ⚠️ What Should Never Be Shared
- **Service Role Key**: This has admin privileges and should only be used server-side
- **Any other sensitive keys**: Keep these in environment variables

## Testing the Connection

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Try to sign up or log in
4. Check the browser console for any connection errors

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is added to the CORS origins in Supabase
2. **Authentication Errors**: Check that the anon key is correct
3. **Database Permission Errors**: Verify RLS policies are configured correctly

### Service Role Key (Server-Side Only)

If you need to perform admin operations server-side, use the service role key:

```bash
# Only use this in server-side code, never in client-side code
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ5ODEzOCwiZXhwIjoyMDcwMDc0MTM4fQ.mjKmBSSXebmVpv_R1dswP-WuamkrOZvFxnbgmzXqaos
```

## Applying migrations

You can apply migrations in two ways.

### Option A: Supabase Dashboard (SQL Editor)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. In the left sidebar, go to **SQL Editor**.
3. Click **New query**.
4. Paste the contents of the migration file (e.g. from `supabase/migrations/20251130120000_add_course_title_i18n.sql`).
5. Click **Run** (or press Ctrl+Enter).
6. Confirm that the query ran successfully (no errors in the result panel).

### Option B: Supabase CLI

If you use the [Supabase CLI](https://supabase.com/docs/guides/cli) and have linked the project:

```bash
# From the project root
npx supabase db push
```

This applies all pending migrations in `supabase/migrations/` to the linked remote database.

To link a project first: `npx supabase link --project-ref <your-project-ref>` (the ref is in the project URL, e.g. `fdeblavnrrnoyqivydsg`).

---

## Database Schema

The application expects the following tables:
- `profiles` - User profile information
- `auth.users` - Authentication users (auto-created by Supabase)

Make sure these tables exist and have the correct RLS policies configured. 