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
      addresses: {
        Row: {
          id: string
          user_id: string | null
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          latitude: number | null
          longitude: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          icon: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          created_at?: string | null
        }
      }
      donations: {
        Row: {
          id: string
          donor_id: string | null
          institution_id: string | null
          title: string
          description: string
          category_id: string | null
          subcategory_id: string | null
          condition: Database['public']['Enums']['item_condition']
          status: Database['public']['Enums']['donation_status'] | null
          images: string[] | null
          scheduled_date: string | null
          delivered_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          institution_id?: string | null
          title: string
          description: string
          category_id?: string | null
          subcategory_id?: string | null
          condition: Database['public']['Enums']['item_condition']
          status?: Database['public']['Enums']['donation_status'] | null
          images?: string[] | null
          scheduled_date?: string | null
          delivered_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          institution_id?: string | null
          title?: string
          description?: string
          category_id?: string | null
          subcategory_id?: string | null
          condition?: Database['public']['Enums']['item_condition']
          status?: Database['public']['Enums']['donation_status'] | null
          images?: string[] | null
          scheduled_date?: string | null
          delivered_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      institution_categories: {
        Row: {
          id: string
          institution_id: string | null
          category_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          institution_id?: string | null
          category_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          institution_id?: string | null
          category_id?: string | null
          created_at?: string | null
        }
      }
      institutions: {
        Row: {
          id: string
          user_id: string | null
          description: string
          institution_type: Database['public']['Enums']['institution_type']
          rating: number | null
          total_ratings: number | null
          verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          description: string
          institution_type: Database['public']['Enums']['institution_type']
          rating?: number | null
          total_ratings?: number | null
          verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          description?: string
          institution_type?: Database['public']['Enums']['institution_type']
          rating?: number | null
          total_ratings?: number | null
          verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ratings: {
        Row: {
          id: string
          donor_id: string | null
          institution_id: string | null
          donation_id: string | null
          rating: number
          comment: string | null
          response: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          institution_id?: string | null
          donation_id?: string | null
          rating: number
          comment?: string | null
          response?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          institution_id?: string | null
          donation_id?: string | null
          rating?: number
          comment?: string | null
          response?: string | null
          created_at?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          donation_id: string | null
          donor_id: string | null
          institution_id: string | null
          scheduled_date: string
          notes: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          donation_id?: string | null
          donor_id?: string | null
          institution_id?: string | null
          scheduled_date: string
          notes?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          donation_id?: string | null
          donor_id?: string | null
          institution_id?: string | null
          scheduled_date?: string
          notes?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string | null
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          created_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          cpf: string | null
          cnpj: string | null
          user_type: Database['public']['Enums']['user_type'] | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          cpf?: string | null
          cnpj?: string | null
          user_type?: Database['public']['Enums']['user_type'] | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          cpf?: string | null
          cnpj?: string | null
          user_type?: Database['public']['Enums']['user_type'] | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      working_hours: {
        Row: {
          id: string
          institution_id: string | null
          day_of_week: number
          open_time: string | null
          close_time: string | null
          is_closed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          institution_id?: string | null
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          institution_id?: string | null
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      donation_status: 'pending' | 'scheduled' | 'delivered' | 'cancelled'
      institution_type: 'ong' | 'church' | 'social_project' | 'hospital' | 'school'
      item_condition: 'new' | 'semi_new' | 'used'
      user_type: 'donor' | 'institution'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}