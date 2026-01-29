
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    // In development, we might not have these set if env loading fails, but actions usually load .env.local
    // We'll throw to be safe, but we can also fallback or warn.
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing Supabase Service Key')
    } else {
        console.warn("Missing Supabase Service Key in Dev")
    }
}

// Note: This client has admin privileges. Use with caution.
export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey || "")
