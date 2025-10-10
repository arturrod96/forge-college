export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          order: number
          path_id: string | null
          published_at: string | null
          slug: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          order: number
          path_id?: string | null
          published_at?: string | null
          slug?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          order?: number
          path_id?: string | null
          published_at?: string | null
          slug?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_paths: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          module_id: string | null
          order: number
          published_at: string | null
          slug: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          updated_by: string | null
          xp_value: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          module_id?: string | null
          order: number
          published_at?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          xp_value?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id?: string | null
          order?: number
          published_at?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          xp_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean
          order: number
          published_at: string | null
          slug: string | null
          summary: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean
          order: number
          published_at?: string | null
          slug?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean
          order?: number
          published_at?: string | null
          slug?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          module_id: string
          project_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          module_id: string
          project_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string
          project_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          }
        ]
      }
      project_submissions: {
        Row: {
          id: string
          project_id: string
          repository_url: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          project_id: string
          repository_url: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          project_id?: string
          repository_url?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      user_enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_active: boolean
          learning_path_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          learning_path_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          learning_path_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          }
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          status: Database["public"]["Enums"]["progress_status"] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      get_enrolled_path_progress: {
        Args: { path_id: string; user_id: string }
        Returns: number
      }
      get_path_progress: {
        Args: { path_id: string; user_id: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      lesson_type: "text" | "video" | "quiz"
      progress_status: "not_started" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [key: string]: never
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
      lesson_type: ["text", "video", "quiz"],
      progress_status: ["not_started", "in_progress", "completed"],
    },
  },
} as const
