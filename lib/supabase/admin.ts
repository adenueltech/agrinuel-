import { createClient } from "@supabase/supabase-js"

// Admin client with service role key for elevated operations
export const createAdminClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Helper function to check if service role key is available
export const hasServiceRoleKey = () => {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY
}
