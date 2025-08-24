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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      conversation_config: {
        Row: {
          created_at: string
          id: number
          timeout_minutes: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          timeout_minutes?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          timeout_minutes?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_insights: {
        Row: {
          content: Json | null
          conversation_id: number
          created_at: string
          id: number
          insight_type_id: number
          status: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          conversation_id: number
          created_at?: string
          id?: number
          insight_type_id: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          conversation_id?: number
          created_at?: string
          id?: number
          insight_type_id?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_insights_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_insights_insight_type_id_fkey"
            columns: ["insight_type_id"]
            isOneToOne: false
            referencedRelation: "insight_types"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: number
          last_message_at: string | null
          patient_id: string
          started_at: string
          status: string
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          patient_id: string
          started_at?: string
          status?: string
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          patient_id?: string
          started_at?: string
          status?: string
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_types: {
        Row: {
          config: Json | null
          created_at: string
          display_name: string
          id: number
          is_active: boolean
          type_key: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          display_name: string
          id?: number
          is_active?: boolean
          type_key: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          display_name?: string
          id?: number
          is_active?: boolean
          type_key?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: number | null
          created_at: string
          id: number
          patient_id: string
          sender: Database["public"]["Enums"]["message_sender"]
        }
        Insert: {
          content: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          patient_id: string
          sender: Database["public"]["Enums"]["message_sender"]
        }
        Update: {
          content?: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          patient_id?: string
          sender?: Database["public"]["Enums"]["message_sender"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_context: {
        Row: {
          active_tasks: Json | null
          id: number
          last_updated_at: string
          patient_id: string
          therapist_notes_summary: string | null
          triage_info: Json | null
        }
        Insert: {
          active_tasks?: Json | null
          id?: number
          last_updated_at?: string
          patient_id: string
          therapist_notes_summary?: string | null
          triage_info?: Json | null
        }
        Update: {
          active_tasks?: Json | null
          id?: number
          last_updated_at?: string
          patient_id?: string
          therapist_notes_summary?: string | null
          triage_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_context_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      therapist_patient_assignments: {
        Row: {
          assigned_at: string
          id: number
          patient_id: string
          status: string
          therapist_id: string
        }
        Insert: {
          assigned_at?: string
          id?: number
          patient_id: string
          status?: string
          therapist_id: string
        }
        Update: {
          assigned_at?: string
          id?: number
          patient_id?: string
          status?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_patient_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_patient_assignments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_insight: {
        Args: { insight_id: number; result_content: Json }
        Returns: boolean
      }
      create_active_insights: {
        Args: { conv_id: number }
        Returns: number
      }
      get_conversation_insights: {
        Args: { conv_id: number }
        Returns: {
          content: Json
          created_at: string
          display_name: string
          status: string
          type_key: string
        }[]
      }
      get_conversation_timeout_minutes: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_pending_insights: {
        Args: Record<PropertyKey, never>
        Returns: {
          config: Json
          conversation_id: number
          display_name: string
          insight_id: number
          type_key: string
        }[]
      }
      set_conversation_timeout_minutes: {
        Args: { minutes_param: number }
        Returns: boolean
      }
      toggle_insight_type: {
        Args: { is_active_param: boolean; type_key_param: string }
        Returns: boolean
      }
    }
    Enums: {
      message_sender: "agent" | "patient"
      user_role: "patient" | "therapist"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      message_sender: ["agent", "patient"],
      user_role: ["patient", "therapist"],
    },
  },
} as const
