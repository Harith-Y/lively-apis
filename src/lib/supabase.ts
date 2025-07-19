import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          api_endpoint: string
          configuration: any
          status: 'active' | 'inactive' | 'testing'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          api_endpoint: string
          configuration?: any
          status?: 'active' | 'inactive' | 'testing'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          api_endpoint?: string
          configuration?: any
          status?: 'active' | 'inactive' | 'testing'
          created_at?: string
          updated_at?: string
        }
      }
      agent_analytics: {
        Row: {
          id: string
          agent_id: string
          user_id: string
          interactions: number
          success_rate: number
          avg_response_time: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          user_id: string
          interactions?: number
          success_rate?: number
          avg_response_time?: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          user_id?: string
          interactions?: number
          success_rate?: number
          avg_response_time?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}