export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          tokens_remaining: number
          subscription_type: 'free' | 'premium'
          subscription_end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          tokens_remaining?: number
          subscription_type?: 'free' | 'premium'
          subscription_end_date?: string | null
          created_at?: string
        }
      }
      problems: {
        Row: {
          id: string
          user_id: string
          problem_text: string
          image_url: string | null
          solution: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_text: string
          image_url?: string | null
          solution?: string | null
          created_at?: string
        }
      }
    }
  }
}