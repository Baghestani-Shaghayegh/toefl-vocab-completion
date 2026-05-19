# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=      # used server-side by /api/generate
```

## Architecture Overview

**Lexivo** is a TOEFL vocabulary practice app (lexivo.io). Users read academic passages and type in the missing letters of masked vocabulary words. Built with Next.js 16 App Router, Supabase for auth and data, and the Anthropic API for passage generation.

### Route Map

| Route | Description |
|---|---|
| `/` | Marketing landing page; redirects authenticated users to `/dashboard` |
| `/practice/sample` | Unauthenticated sample exercise (for CTA on landing page) |
| `/practice` | Practice Hub — lists all passages from Supabase; requires auth |
| `/practice/[id]` | Interactive fill-in-the-blank exercise for a specific passage |
| `/dashboard` | User stats, XP/level, streak, missed words; requires auth |
| `/auth` | Login/signup — `?view=login` or `?view=signup` |
| `/auth/callback` | OAuth callback handler |
| `/auth/reset-password` | Password reset flow |
| `POST /api/generate` | Server route: generates TOEFL passages via Anthropic claude-opus-4-6 |

Auth middleware (`middleware.ts`) protects `/dashboard` and `/practice`, redirecting unauthenticated users to `/auth?view=login`. Authenticated users hitting `/` are redirected to `/dashboard`.

### Supabase Client Pattern

Three separate clients — always pick the right one:

- `lib/supabase/client.ts` — browser/client components (`createBrowserClient`)
- `lib/supabase/server.ts` — server components and Route Handlers (`createServerClient` + cookies)
- `lib/supabase/middleware.ts` — middleware only

### Database Schema

Tables managed in Supabase (not via local migrations — apply `supabase/migrations/create_users_table.sql` manually via the Supabase SQL editor):

| Table | Key Columns |
|---|---|
| `users` | `id` (uuid, FK to auth.users), `email`, `first_name`, `last_name` |
| `passages` | `id`, `text`, `topic`, `title` |
| `sessions` | `user_id`, `passage_id`, `score`, `total`, `time_seconds`, `completed_at` |
| `word_attempts` | `user_id`, `word`, `correct` (bool), `attempted_at` |

All tables have RLS enabled. Users can only read/write their own rows.

### Fill-in-the-Blank Mechanics

Implemented in `app/practice/[id]/page.tsx` (and duplicated in `app/practice/sample/page.tsx`):

- Every 3rd word (index `% 3 === 2`) with more than 3 letters is masked
- Hidden letters: always the trailing N letters, where N = 1 (≤4 chars), 2 (≤6), 3 (≤8), 4 (longer)
- First letter is always visible

### XP / Leveling

Calculated client-side in `app/dashboard/page.tsx`:
- 10 XP per unique passage completed + 5 bonus if best accuracy ≥ 80%
- 100 XP per level; streak is consecutive days with at least one session

### Styling Convention

All pages use inline `<style>` tags (not Tailwind utility classes) with Google Fonts — **Special Elite** (body) and **Caveat** (accent/handwritten). The visual theme is a vintage notebook: `#f5f2eb` background, `#d6d0c4` borders, offset box-shadows like `2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de`. Tailwind is available but only used for layout utilities in `app/layout.tsx`. New pages should follow the inline-style pattern to stay consistent.
