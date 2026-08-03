import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = import.meta.env.SUPABASE_URL
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  supabaseClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })

  return supabaseClient
}

export function getSupabaseAvatarBucket() {
  const bucket = import.meta.env.SUPABASE_BUCKET

  if (!bucket) {
    throw new Error(
      'Supabase bucket configuration is missing. Please set SUPABASE_BUCKET.'
    )
  }

  return bucket
}