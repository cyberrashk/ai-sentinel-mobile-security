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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string
          metadata: Json | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message: string
          metadata?: Json | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      antivirus_scans: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          items_scanned: number | null
          scan_type: Database["public"]["Enums"]["scan_type"]
          started_at: string
          status: Database["public"]["Enums"]["scan_status"]
          threats_found: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          items_scanned?: number | null
          scan_type: Database["public"]["Enums"]["scan_type"]
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"]
          threats_found?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          items_scanned?: number | null
          scan_type?: Database["public"]["Enums"]["scan_type"]
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"]
          threats_found?: number | null
          user_id?: string
        }
        Relationships: []
      }
      dark_web_scans: {
        Row: {
          breaches_found: number | null
          completed_at: string | null
          created_at: string
          email: string
          id: string
          started_at: string
          status: Database["public"]["Enums"]["scan_status"]
          user_id: string
        }
        Insert: {
          breaches_found?: number | null
          completed_at?: string | null
          created_at?: string
          email: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"]
          user_id: string
        }
        Update: {
          breaches_found?: number | null
          completed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"]
          user_id?: string
        }
        Relationships: []
      }
      leaked_credentials: {
        Row: {
          breach_date: string | null
          breach_name: string
          created_at: string
          discovered_at: string
          email: string
          id: string
          leaked_data: string[] | null
          scan_id: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          user_id: string
        }
        Insert: {
          breach_date?: string | null
          breach_name: string
          created_at?: string
          discovered_at?: string
          email: string
          id?: string
          leaked_data?: string[] | null
          scan_id?: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          user_id: string
        }
        Update: {
          breach_date?: string | null
          breach_name?: string
          created_at?: string
          discovered_at?: string
          email?: string
          id?: string
          leaked_data?: string[] | null
          scan_id?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaked_credentials_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "dark_web_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string | null
          id: string
          plan_type: Database["public"]["Enums"]["subscription_tier"]
          session_id: string
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          plan_type: Database["public"]["Enums"]["subscription_tier"]
          session_id: string
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_tier"]
          session_id?: string
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          subscription_expires_at: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          subscription_expires_at?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          subscription_expires_at?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      threats: {
        Row: {
          created_at: string
          detected_at: string
          file_path: string | null
          id: string
          name: string
          resolved_at: string | null
          scan_id: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          status: Database["public"]["Enums"]["threat_status"]
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detected_at?: string
          file_path?: string | null
          id?: string
          name: string
          resolved_at?: string | null
          scan_id?: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          status?: Database["public"]["Enums"]["threat_status"]
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          detected_at?: string
          file_path?: string | null
          id?: string
          name?: string
          resolved_at?: string | null
          scan_id?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          status?: Database["public"]["Enums"]["threat_status"]
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threats_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "antivirus_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vpn_sessions: {
        Row: {
          connected_at: string
          data_received: number | null
          data_sent: number | null
          disconnected_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          server_country: string
          server_id: string
          server_name: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          data_received?: number | null
          data_sent?: number | null
          disconnected_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          server_country: string
          server_id: string
          server_name: string
          user_id: string
        }
        Update: {
          connected_at?: string
          data_received?: number | null
          data_sent?: number | null
          disconnected_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          server_country?: string
          server_id?: string
          server_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      alert_type: "security" | "vpn" | "antivirus" | "dark_web" | "system"
      app_role: "admin" | "user"
      scan_status: "pending" | "running" | "completed" | "cancelled" | "failed"
      scan_type: "quick" | "full" | "custom"
      subscription_tier: "free" | "premium" | "pro"
      threat_severity: "low" | "medium" | "high" | "critical"
      threat_status: "detected" | "quarantined" | "removed" | "allowed"
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
      alert_severity: ["info", "warning", "critical"],
      alert_type: ["security", "vpn", "antivirus", "dark_web", "system"],
      app_role: ["admin", "user"],
      scan_status: ["pending", "running", "completed", "cancelled", "failed"],
      scan_type: ["quick", "full", "custom"],
      subscription_tier: ["free", "premium", "pro"],
      threat_severity: ["low", "medium", "high", "critical"],
      threat_status: ["detected", "quarantined", "removed", "allowed"],
    },
  },
} as const
