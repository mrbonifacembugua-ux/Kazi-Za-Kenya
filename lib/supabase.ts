import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnqmqxeuzcodnxdixnvc.supabase.co";
const supabasePublishableKey = "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
