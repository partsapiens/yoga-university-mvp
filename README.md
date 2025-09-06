# Yoga University Starter (Next.js + Tailwind + Supabase) — Netlify Ready

MVP scaffolding for Pose Library, Flow Builder, and Journal.

## Quickstart
1. **Clone** this repo and install:
   ```bash
   npm i
   cp .env.example .env.local
   ```
2. Create a **Supabase** project → copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into `.env.local`.
3. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Netlify
1. Push to GitHub.
2. In Netlify: **New site from Git**, choose repo.
3. Build command: `npm run build`  
   Publish directory: `.next`
4. Add environment variables in **Site settings → Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Netlify will auto-detect Next.js using `@netlify/plugin-nextjs` (included in `netlify.toml`).

## Notes
- Pages are client-side mocked; wire Supabase queries where needed.
- Tailwind is pre-configured.
- Add auth later (Supabase Auth) and migrate data models as you grow.

## Routes
- `/` — home
- `/poses` — library (tabs for cues/benefits/injuries + anatomy list)
- `/flows` — basic builder (pose palette + timeline, est. duration)
- `/journal` — daily reflection + history
