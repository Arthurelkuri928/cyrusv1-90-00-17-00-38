export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string | null
          target_type: Database["public"]["Enums"]["notification_target_type"]
          target_values: string[]
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message?: string | null
          target_type: Database["public"]["Enums"]["notification_target_type"]
          target_values?: string[]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string | null
          target_type?: Database["public"]["Enums"]["notification_target_type"]
          target_values?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          admin_id: string
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
        }
        Insert: {
          admin_id: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
        }
        Update: {
          admin_id?: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          created_at: string
          cta_button_1_text_en: string | null
          cta_button_1_text_es: string | null
          cta_button_1_text_pt: string | null
          cta_button_1_url: string | null
          cta_button_2_text_en: string | null
          cta_button_2_text_es: string | null
          cta_button_2_text_pt: string | null
          cta_button_2_url: string | null
          description_en: string
          description_es: string
          description_pt: string
          display_order: number
          end_date: string | null
          id: string
          is_active: boolean
          start_date: string | null
          thumbnail_url: string | null
          title_en: string
          title_es: string
          title_pt: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          cta_button_1_text_en?: string | null
          cta_button_1_text_es?: string | null
          cta_button_1_text_pt?: string | null
          cta_button_1_url?: string | null
          cta_button_2_text_en?: string | null
          cta_button_2_text_es?: string | null
          cta_button_2_text_pt?: string | null
          cta_button_2_url?: string | null
          description_en: string
          description_es: string
          description_pt: string
          display_order?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string | null
          thumbnail_url?: string | null
          title_en: string
          title_es: string
          title_pt: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          cta_button_1_text_en?: string | null
          cta_button_1_text_es?: string | null
          cta_button_1_text_pt?: string | null
          cta_button_1_url?: string | null
          cta_button_2_text_en?: string | null
          cta_button_2_text_es?: string | null
          cta_button_2_text_pt?: string | null
          cta_button_2_url?: string | null
          description_en?: string
          description_es?: string
          description_pt?: string
          display_order?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string | null
          thumbnail_url?: string | null
          title_en?: string
          title_es?: string
          title_pt?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      affiliate_links: {
        Row: {
          clicks: number
          conversions: number
          created_at: string
          id: string
          is_active: boolean
          link_code: string
          link_type: string
          link_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clicks?: number
          conversions?: number
          created_at?: string
          id?: string
          is_active?: boolean
          link_code: string
          link_type?: string
          link_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clicks?: number
          conversions?: number
          created_at?: string
          id?: string
          is_active?: boolean
          link_code?: string
          link_type?: string
          link_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_sales: {
        Row: {
          amount: number
          commission_amount: number
          created_at: string
          id: string
          order_id: string
          product_name: string
          sale_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          commission_amount?: number
          created_at?: string
          id?: string
          order_id: string
          product_name: string
          sale_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          commission_amount?: number
          created_at?: string
          id?: string
          order_id?: string
          product_name?: string
          sale_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          resource_id: string
          session_duration_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          resource_id: string
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          resource_id?: string
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas_pagamentos: {
        Row: {
          created_at: string
          data_pagamento: string
          id_transacao: string
          id_usuario: string
          moeda: string
          status_pagamento: string
          updated_at: string
          valor_pago: number
        }
        Insert: {
          created_at?: string
          data_pagamento?: string
          id_transacao?: string
          id_usuario: string
          moeda?: string
          status_pagamento?: string
          updated_at?: string
          valor_pago: number
        }
        Update: {
          created_at?: string
          data_pagamento?: string
          id_transacao?: string
          id_usuario?: string
          moeda?: string
          status_pagamento?: string
          updated_at?: string
          valor_pago?: number
        }
        Relationships: []
      }
      cookie_buttons: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          type: string
          updated_at: string
          url: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          type?: string
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          type?: string
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Relationships: []
      }
      cookie_injection_audit: {
        Row: {
          cookie_count: number | null
          cookie_names: string[] | null
          created_at: string
          domain: string | null
          error_code: string | null
          error_message: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          parsed_format: string | null
          session_hash: string | null
          success: boolean
          tool_id: string | null
          updated_at: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          cookie_count?: number | null
          cookie_names?: string[] | null
          created_at?: string
          domain?: string | null
          error_code?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          parsed_format?: string | null
          session_hash?: string | null
          success?: boolean
          tool_id?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          cookie_count?: number | null
          cookie_names?: string[] | null
          created_at?: string
          domain?: string | null
          error_code?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          parsed_format?: string | null
          session_hash?: string | null
          success?: boolean
          tool_id?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      formulario_afiliados: {
        Row: {
          created_at: string
          dados_audiencia: string
          data_candidatura: string
          email: string
          id: string
          nome_completo: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          dados_audiencia: string
          data_candidatura?: string
          email: string
          id?: string
          nome_completo: string
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          dados_audiencia?: string
          data_candidatura?: string
          email?: string
          id?: string
          nome_completo?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      header_action_buttons: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          style: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label: string
          position?: number
          style: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label?: string
          position?: number
          style?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      header_nav_items: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          page_slug: string | null
          parent_id: string | null
          position: number
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label: string
          page_slug?: string | null
          parent_id?: string | null
          position?: number
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label?: string
          page_slug?: string | null
          parent_id?: string | null
          position?: number
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "header_nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "header_nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      header_settings: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_read_status: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_read_status_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "admin_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_read_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          is_visible: boolean
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_visible?: boolean
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partnership_applications: {
        Row: {
          area_atuacao_principal: string
          created_at: string
          data_candidatura: string
          email_profissional: string
          experiencia_afiliacao: string
          id: string
          link_perfil_principal: string
          motivo_parceria: string
          nome_completo: string
          numero_seguidores: string
          plataforma: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          area_atuacao_principal: string
          created_at?: string
          data_candidatura?: string
          email_profissional: string
          experiencia_afiliacao: string
          id?: string
          link_perfil_principal: string
          motivo_parceria: string
          nome_completo: string
          numero_seguidores: string
          plataforma: string
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          area_atuacao_principal?: string
          created_at?: string
          data_candidatura?: string
          email_profissional?: string
          experiencia_afiliacao?: string
          id?: string
          link_perfil_principal?: string
          motivo_parceria?: string
          nome_completo?: string
          numero_seguidores?: string
          plataforma?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          duration_days: number
          id: string
          name: string
          price_in_cents: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_days: number
          id?: string
          name: string
          price_in_cents: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_days?: number
          id?: string
          name?: string
          price_in_cents?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          subscription_end_at: string | null
          subscription_status: string
          subscription_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          subscription_end_at?: string | null
          subscription_status?: string
          subscription_type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          subscription_end_at?: string | null
          subscription_status?: string
          subscription_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sidebar_links: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string
          id: string
          is_external: boolean
          is_visible: boolean
          multilang_support: Json | null
          position: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          multilang_support?: Json | null
          position?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_external?: boolean
          is_visible?: boolean
          multilang_support?: Json | null
          position?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_invoices: {
        Row: {
          amount_paid: number
          created_at: string
          currency: string
          id: string
          invoice_pdf: string | null
          paid_at: string | null
          status: string
          stripe_invoice_id: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          currency?: string
          id?: string
          invoice_pdf?: string | null
          paid_at?: string | null
          status: string
          stripe_invoice_id: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_pdf?: string | null
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "stripe_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_credentials: {
        Row: {
          created_at: string | null
          credentials: Json | null
          id: number
          tool_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          id?: number
          tool_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          id?: number
          tool_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          access_url: string | null
          action_buttons: Json | null
          card_color: string | null
          category: string | null
          cookies: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          email: string | null
          id: number
          is_active: boolean | null
          is_maintenance: boolean | null
          logo_url: string | null
          name: string
          password: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          access_url?: string | null
          action_buttons?: Json | null
          card_color?: string | null
          category?: string | null
          cookies?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          is_active?: boolean | null
          is_maintenance?: boolean | null
          logo_url?: string | null
          name: string
          password?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          access_url?: string | null
          action_buttons?: Json | null
          card_color?: string | null
          category?: string | null
          cookies?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          id?: number
          is_active?: boolean | null
          is_maintenance?: boolean | null
          logo_url?: string | null
          name?: string
          password?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trial_ip_tracking: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          trial_used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: unknown
          trial_used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          trial_used_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      analytics_daily_summary: {
        Row: {
          avg_duration: number | null
          event_count: number | null
          event_type: string | null
          resource_id: string | null
          summary_date: string | null
          unique_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_user_subscription: {
        Args: {
          extend_days?: number
          new_expiration?: string
          new_status?: string
          target_user_id: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      check_subscription_status: {
        Args: { user_id: string }
        Returns: {
          expires_at: string
          is_valid: boolean
          status: string
        }[]
      }
      cleanup_old_analytics_events: {
        Args: { p_retention_days?: number }
        Returns: number
      }
      count_users_with_subscriptions: {
        Args: { search_term?: string }
        Returns: number
      }
      create_admin_notification: {
        Args: {
          p_message: string
          p_target_type: Database["public"]["Enums"]["notification_target_type"]
          p_target_values: string[]
          p_title: string
        }
        Returns: {
          created_at: string
          created_by: string
          id: string
          message: string | null
          target_type: Database["public"]["Enums"]["notification_target_type"]
          target_values: string[]
          title: string
        }
      }
      create_cookie_button: {
        Args: {
          icon_param?: string
          is_visible_param?: boolean
          label_param: string
          position_param?: number
          type_param?: string
          url_param?: string
          value_param?: string
        }
        Returns: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          type: string
          updated_at: string
          url: string | null
          value: string | null
        }[]
      }
      create_default_header_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
        }[]
      }
      create_header_action_button: {
        Args: {
          is_visible_param?: boolean
          label_param: string
          position_param?: number
          style_param: string
          url_param: string
        }
        Returns: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          style: string
          updated_at: string
          url: string
        }[]
      }
      create_header_nav_item: {
        Args: {
          is_visible_param?: boolean
          label_param: string
          page_slug_param?: string
          parent_id_param?: string
          position_param?: number
          type_param: string
          url_param?: string
        }
        Returns: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          page_slug: string | null
          parent_id: string | null
          position: number
          type: string
          updated_at: string
          url: string | null
        }[]
      }
      current_user_can: {
        Args: { p_action: string }
        Returns: boolean
      }
      current_user_has_permission: {
        Args: { p_permission_code: string }
        Returns: boolean
      }
      deactivate_expired_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: {
          deactivated_count: number
        }[]
      }
      debug_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_user_id: string
          is_admin_result: boolean
          user_exists: boolean
          user_role: string
        }[]
      }
      debug_permissions_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          can_manage_tools: boolean
          can_manage_users: boolean
          can_view_admin_panel: boolean
          current_user_id: string
          is_admin_result: boolean
          user_exists: boolean
          user_role: string
        }[]
      }
      delete_cookie_button: {
        Args: { button_id: string }
        Returns: undefined
      }
      delete_header_action_button: {
        Args: { button_id: string }
        Returns: undefined
      }
      delete_header_nav_item: {
        Args: { item_id: string }
        Returns: undefined
      }
      generate_affiliate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          id: string
          role: string
        }[]
      }
      get_admin_users_with_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          id: string
          permissions_codes: string[]
          role: string
          source: string
        }[]
      }
      get_all_cookie_buttons: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          type: string
          updated_at: string
          url: string | null
          value: string | null
        }[]
      }
      get_cookie_buttons: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          type: string
          updated_at: string
          url: string | null
          value: string | null
        }[]
      }
      get_deleted_tools: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_url: string
          action_buttons: Json
          card_color: string
          category: string
          cookies: string
          created_at: string
          deleted_at: string
          description: string
          email: string
          id: number
          is_active: boolean
          is_maintenance: boolean
          logo_url: string
          name: string
          password: string
          slug: string
          updated_at: string
        }[]
      }
      get_header_action_buttons: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          style: string
          updated_at: string
          url: string
        }[]
      }
      get_header_nav_items: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_header_nav_items_admin: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_header_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
        }[]
      }
      get_member_tools: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_url: string
          action_buttons: Json
          card_color: string
          category: string
          cookies: string
          created_at: string
          deleted_at: string
          description: string
          email: string
          id: number
          is_active: boolean
          is_maintenance: boolean
          logo_url: string
          name: string
          password: string
          slug: string
          updated_at: string
        }[]
      }
      get_my_admin_notifications: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          created_by: string
          id: string
          is_read: boolean
          message: string
          title: string
        }[]
      }
      get_my_unread_notifications_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_page_average_session_time: {
        Args: { p_days_back?: number }
        Returns: {
          avg_session_seconds: number
          page_name: string
          page_path: string
          total_sessions: number
          unique_users: number
        }[]
      }
      get_real_time_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_session_duration_today: number
          most_clicked_tool: string
          most_visited_page: string
          page_sessions_today: number
          tool_clicks_today: number
          total_events_today: number
          unique_users_today: number
        }[]
      }
      get_role_permissions: {
        Args: { p_role: string }
        Returns: string[]
      }
      get_tool_click_counts: {
        Args: { p_days_back?: number }
        Returns: {
          click_count: number
          tool_id: string
          tool_name: string
          unique_users: number
        }[]
      }
      get_user_activity_summary: {
        Args: { p_days_back?: number; p_limit?: number }
        Returns: {
          avg_session_duration: number
          last_activity: string
          page_sessions: number
          tool_clicks: number
          total_events: number
          user_id: string
        }[]
      }
      get_user_dynamic_permissions: {
        Args: { p_user_id: string }
        Returns: {
          code: string
        }[]
      }
      get_user_hybrid_permissions: {
        Args: { p_user_id: string }
        Returns: {
          code: string
          source: string
        }[]
      }
      has_admin_permission: {
        Args: { p_permission_code: string; p_user_id: string }
        Returns: boolean
      }
      has_permission: {
        Args: { p_action: string; p_role: string }
        Returns: boolean
      }
      has_permission_for_user: {
        Args: { p_action: string; p_user_id: string }
        Returns: boolean
      }
      has_specific_permission: {
        Args: { p_action: string; p_role: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_affiliate: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_member: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      list_users_with_subscriptions: {
        Args: {
          page_limit?: number
          page_offset?: number
          search_term?: string
        }
        Returns: {
          created_at: string
          email: string
          id: string
          role: string
          subscription_end_at: string
          subscription_status: string
          subscription_type: string
          updated_at: string
        }[]
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      log_analytics_event: {
        Args: {
          p_event_type: string
          p_metadata?: Json
          p_resource_id: string
          p_session_duration_seconds?: number
        }
        Returns: string
      }
      mark_notifications_as_read: {
        Args: { p_notification_ids: string[] }
        Returns: number
      }
      update_cookie_button: {
        Args: {
          button_id: string
          icon_param?: string
          is_visible_param?: boolean
          label_param?: string
          position_param?: number
          type_param?: string
          url_param?: string
          value_param?: string
        }
        Returns: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          position: number
          type: string
          updated_at: string
          url: string | null
          value: string | null
        }[]
      }
      update_header_action_button: {
        Args: {
          button_id: string
          is_visible_param?: boolean
          label_param?: string
          position_param?: number
          style_param?: string
          url_param?: string
        }
        Returns: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          position: number
          style: string
          updated_at: string
          url: string
        }[]
      }
      update_header_nav_item: {
        Args: {
          is_visible_param?: boolean
          item_id: string
          label_param?: string
          page_slug_param?: string
          parent_id_param?: string
          position_param?: number
          type_param?: string
          url_param?: string
        }
        Returns: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          page_slug: string | null
          parent_id: string | null
          position: number
          type: string
          updated_at: string
          url: string | null
        }[]
      }
      update_header_settings: {
        Args: { logo_url_param: string }
        Returns: {
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
        }[]
      }
      user_has_permission: {
        Args: { p_action: string; p_user_id: string }
        Returns: boolean
      }
      validate_user_login: {
        Args: { user_email: string }
        Returns: {
          can_login: boolean
          message: string
        }[]
      }
    }
    Enums: {
      notification_target_type: "ROLE" | "USER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_target_type: ["ROLE", "USER"],
    },
  },
} as const
