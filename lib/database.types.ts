export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      commission_requests: {
        Row: {
          created_at: string
          current_commission: number
          id: number
          note: string | null
          product_id: number
          requested_commission: number
          reviewed_at: string | null
          reviewed_by: string | null
          seller_id: string
          status: Database["public"]["Enums"]["commission_status"]
        }
        Insert: {
          created_at?: string
          current_commission: number
          id?: never
          note?: string | null
          product_id: number
          requested_commission: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["commission_status"]
        }
        Update: {
          created_at?: string
          current_commission?: number
          id?: never
          note?: string | null
          product_id?: number
          requested_commission?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["commission_status"]
        }
        Relationships: [
          {
            foreignKeyName: "commission_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          commission: number
          created_at: string
          created_by: string | null
          id: number
          image_public_id: string | null
          image_url: string | null
          language_id: number | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          commission: number
          created_at?: string
          created_by?: string | null
          id?: never
          image_public_id?: string | null
          image_url?: string | null
          language_id?: number | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          commission?: number
          created_at?: string
          created_by?: string | null
          id?: never
          image_public_id?: string | null
          image_url?: string | null
          language_id?: number | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          id: number
          product_id: number
          quantity: number
          seller_id: string | null
          sold_at: string
          unit_commission: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: never
          product_id: number
          quantity: number
          seller_id?: string | null
          sold_at?: string
          unit_commission: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: never
          product_id?: number
          quantity?: number
          seller_id?: string | null
          sold_at?: string
          unit_commission?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sales_summary: {
        Row: {
          commission: number | null
          commission_paid: number | null
          image_public_id: string | null
          image_url: string | null
          price: number | null
          product_id: number | null
          product_name: string | null
          revenue: number | null
          units_sold: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_account: {
        Args: {
          target_id: string
        }
        Returns: undefined
      }
      promote_to_super_admin: {
        Args: {
          target_id: string
        }
        Returns: undefined
      }
      review_commission_request: {
        Args: {
          next_status: Database["public"]["Enums"]["commission_status"]
          request_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "super_admin" | "seller"
      commission_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type AppRole = Database["public"]["Enums"]["app_role"]
export type CommissionStatus = Database["public"]["Enums"]["commission_status"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Language = Database["public"]["Tables"]["languages"]["Row"]
export type ProductWithLanguage = Product & {
  languages: Pick<Language, "id" | "name"> | null
}
export type Sale = Database["public"]["Tables"]["sales"]["Row"]
export type CommissionRequest =
  Database["public"]["Tables"]["commission_requests"]["Row"]
export type SalesSummary = Database["public"]["Views"]["sales_summary"]["Row"]
