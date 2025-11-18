# Virtual Consultation (Vite + React + Supabase)

This is a minimal starter site intended to be deployed to Vercel and use Supabase as a backend.

Quick features:
- Vite + React frontend
- Supabase client in `src/supabaseClient.js`
- Messages UI that reads/inserts into a `messages` table

Getting started locally

1. Install dependencies

```powershell
cd g:\vs\simple-site
npm install
```

2. Add environment variables (local dev)

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run dev server

```powershell
npm run dev
```

Open the address printed by Vite (usually `http://localhost:5173`).

Supabase setup

1. Create a Supabase project at https://supabase.com.
2. In the SQL editor, create a simple `messages` table:

```sql
create table messages (
  id serial primary key,
  text text,
  inserted_at timestamptz default now()
);
```
3. Get `URL` and `anon key` from Project Settings -> API and put them into `.env` (for local) or Vercel env variables (for deployment).

GitHub & Vercel

1. Initialize a local git repo and push to GitHub (replace repo URL):

```powershell
cd g:\vs\simple-site
git init
git add .
git commit -m "chore: initial commit"
# Create a GitHub repo via the UI or `gh` CLI:
# gh repo create your-username/simple-site --public --source=. --remote=origin --push
git remote add origin https://github.com/<YOUR_USER>/simple-site.git
git branch -M main
git push -u origin main
```

2. Connect to Vercel:
- Log in at https://vercel.com and "Import Project" from GitHub -> select the repo.
- In Vercel Project Settings -> Environment Variables, add:
  - `VITE_SUPABASE_URL` = your Supabase URL
  - `VITE_SUPABASE_ANON_KEY` = your anon key

3. Deploy: Vercel will build (`npm run build`) and deploy automatically on push.

Notes

- Env var names start with `VITE_` so Vite exposes them to the browser build.
- Keep anon key public-safe (Supabase RLS and policies should protect private data).
- When you're ready, we can add auth, RLS, or server functions.

Next steps I can do for you

- Add GitHub Actions or auto-PR previews
- Add Supabase Auth sign-in and protected routes
- Convert to Next.js (better for SSR on Vercel)
- Create a GitHub repo for you (requires GH token/gh CLI) and connect Vercel

Tell me which of the above you'd like me to do next.