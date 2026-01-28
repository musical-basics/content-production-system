
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            const value = match[2].trim()
            process.env[key] = value
        }
    })
}

// Import supabase after setting env
import { supabase } from '@/lib/supabase'

async function checkConnection() {
    console.log('Testing Supabase connection...')
    try {
        const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true })

        if (error) {
            console.error('Connection failed:', error.message)
        } else {
            console.log('Connection successful! Project count check executed.')
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

checkConnection()
