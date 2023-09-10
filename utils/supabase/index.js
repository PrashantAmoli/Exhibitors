import { SupabaseClient } from '@supabase/supabase-js';

export const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		persistSession: false,
	},
});
