import { createClient } from '@supabase/supabase-js'

// Read these from environment variables at build/runtime.
// On Vercel, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Project -> Settings -> Environment Variables.
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Defensive: detect if the values were accidentally swapped (common when setting OS env vars)
// e.g. anon key (JWT-like starting with eyJ) stored in VITE_SUPABASE_URL and URL in the anon key var.
const looksLikeJwt = (s) => typeof s === 'string' && /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(s)
const looksLikeUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s)
if (looksLikeJwt(supabaseUrl) && looksLikeUrl(supabaseAnonKey)) {
	console.warn('[supabaseClient] Detected swapped environment variables: VITE_SUPABASE_URL looks like an anon key and VITE_SUPABASE_ANON_KEY looks like a URL. Swapping them automatically for this session.')
	const tmp = supabaseUrl
	supabaseUrl = supabaseAnonKey
	supabaseAnonKey = tmp
}

// Debug: print a masked version of the URL and whether anon key is present.
// This helps confirm what Vite provides at build/dev time without exposing secrets.
const _mask = (s) => {
	if (!s) return '<missing>'
	try {
		const t = String(s).trim()
		if (t.length <= 12) return t
		return `${t.slice(0, 8)}…${t.slice(-4)}`
	} catch {
		return '<invalid>'
	}
}
console.log(`[supabaseClient] VITE_SUPABASE_URL=${_mask(supabaseUrl)}, VITE_SUPABASE_ANON_KEY=${supabaseAnonKey ? '<present>' : '<missing>'}`)
console.log(`[supabaseClient] raw VITE_SUPABASE_URL length=${(supabaseUrl ? String(supabaseUrl).length : 0)}`)

let supabase

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('[supabaseClient] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Supabase features will not work.\n' +
		'Set these in a local `.env` (for dev) or in Vercel Project -> Settings -> Environment Variables (for production).')

	// Minimal stub to avoid runtime crashes and allow chained calls like
	// supabase.from('messages').select('*').order(...).limit(...)
	const makeStubFrom = () => {
		const result = {
			async execute() {
				return { data: null, error: new Error('Supabase not configured') }
			},
			select() { return result },
			order() { return result },
			limit() { return result },
			async insert() { return { data: null, error: new Error('Supabase not configured') } }
		}
		return result
	}

	supabase = {
		from() { return makeStubFrom() }
	}
} else {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
