import { createClient } from "@supabase/supabase-js";

// Admin client with service role — bypasses RLS
// ONLY use server-side (webhook handlers, server actions)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
