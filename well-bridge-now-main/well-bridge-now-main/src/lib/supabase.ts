import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kcgmgabptogfhntjzavf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZ21nYWJwdG9nZmhudGp6YXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTk4NzIsImV4cCI6MjA3MjczNTg3Mn0.hvPvTUMG56I54hXSpMpmSxRM3DDQpWHpix0sC-8iNP4'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { User } from '@supabase/supabase-js'
