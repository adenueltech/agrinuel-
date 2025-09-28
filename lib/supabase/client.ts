import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error("Supabase environment variables are not configured properly. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
    }

    if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
      throw new Error("Invalid Supabase URL. Please check NEXT_PUBLIC_SUPABASE_URL.")
    }

    supabaseClient = createBrowserClient(url, key)
  }
  return supabaseClient
}
