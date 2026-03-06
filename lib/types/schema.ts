export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      event_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string
          end_datetime: string
          id: string
          is_public: boolean | null
          location: Json | null
          max_capacity: number | null
          metadata: Json | null
          name: string
          organisation_id: string | null
          organizer_id: string
          start_datetime: string
          status: Database["public"]["Enums"]["event_status"] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_datetime: string
          id?: string
          is_public?: boolean | null
          location?: Json | null
          max_capacity?: number | null
          metadata?: Json | null
          name: string
          organisation_id?: string | null
          organizer_id: string
          start_datetime: string
          status?: Database["public"]["Enums"]["event_status"] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_datetime?: string
          id?: string
          is_public?: boolean | null
          location?: Json | null
          max_capacity?: number | null
          metadata?: Json | null
          name?: string
          organisation_id?: string | null
          organizer_id?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      game_types: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          banner_url: string | null
          config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          metadata: Json | null
          name: string
          slug: string
          type: string
        }
        Insert: {
          banner_url?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          slug: string
          type: string
        }
        Update: {
          banner_url?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          slug?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "game_types"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          bracket_type: string | null
          created_at: string | null
          group_id: string | null
          id: string
          identifier: string
          loser_next_match_id: string | null
          metadata: Json | null
          next_match_id: string | null
          roster_a_id: string | null
          roster_b_id: string | null
          round_number: number
          score_a: number | null
          score_b: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string
          updated_at: string | null
          verified_by: string | null
          winner_id: string | null
        }
        Insert: {
          bracket_type?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          identifier: string
          loser_next_match_id?: string | null
          metadata?: Json | null
          next_match_id?: string | null
          roster_a_id?: string | null
          roster_b_id?: string | null
          round_number: number
          score_a?: number | null
          score_b?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string
          updated_at?: string | null
          verified_by?: string | null
          winner_id?: string | null
        }
        Update: {
          bracket_type?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          identifier?: string
          loser_next_match_id?: string | null
          metadata?: Json | null
          next_match_id?: string | null
          roster_a_id?: string | null
          roster_b_id?: string | null
          round_number?: number
          score_a?: number | null
          score_b?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string
          updated_at?: string | null
          verified_by?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_loser_next_match_id_fkey"
            columns: ["loser_next_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_next_match_id_fkey"
            columns: ["next_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_roster_a_id_fkey"
            columns: ["roster_a_id"]
            isOneToOne: false
            referencedRelation: "team_rosters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_roster_b_id_fkey"
            columns: ["roster_b_id"]
            isOneToOne: false
            referencedRelation: "team_rosters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "team_rosters"
            referencedColumns: ["id"]
          },
        ]
      }
      organisation_members: {
        Row: {
          joined_at: string | null
          organisation_id: string
          profile_id: string
          role: Database["public"]["Enums"]["organisation_role"] | null
        }
        Insert: {
          joined_at?: string | null
          organisation_id: string
          profile_id: string
          role?: Database["public"]["Enums"]["organisation_role"] | null
        }
        Update: {
          joined_at?: string | null
          organisation_id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["organisation_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          metadata: Json | null
          name: string
          owner_id: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          owner_id: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          level: number | null
          metadata: Json | null
          qr_token: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          social_links: Json | null
          total_xp: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          level?: number | null
          metadata?: Json | null
          qr_token?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          total_xp?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          metadata?: Json | null
          qr_token?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          total_xp?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      team_rosters: {
        Row: {
          captain_id: string
          created_at: string | null
          game_id: string
          id: string
          name: string | null
          players: string[]
          settings: Json | null
          stats: Json | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          captain_id: string
          created_at?: string | null
          game_id: string
          id?: string
          name?: string | null
          players?: string[]
          settings?: Json | null
          stats?: Json | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          captain_id?: string
          created_at?: string | null
          game_id?: string
          id?: string
          name?: string | null
          players?: string[]
          settings?: Json | null
          stats?: Json | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_rosters_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          banner_url: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
          organisation_id: string | null
          owner_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          organisation_id?: string | null
          owner_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          organisation_id?: string | null
          owner_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_formats: {
        Row: {
          created_at: string | null
          default_settings: Json | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          min_participants: number
          name: string
        }
        Insert: {
          created_at?: string | null
          default_settings?: Json | null
          description: string
          icon: string
          id: string
          is_active?: boolean | null
          min_participants: number
          name: string
        }
        Update: {
          created_at?: string | null
          default_settings?: Json | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          min_participants?: number
          name?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          created_at: string | null
          format_settings: Json | null
          format_type: string
          game_id: string
          id: string
          max_participants: number
          metadata: Json | null
          min_participants: number
          name: string
          organisation_id: string | null
          organizer_id: string
          prize_pool: Json | null
          registration_end_at: string | null
          registration_start_at: string | null
          start_at: string
          status: Database["public"]["Enums"]["tournament_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          format_settings?: Json | null
          format_type: string
          game_id: string
          id?: string
          max_participants: number
          metadata?: Json | null
          min_participants?: number
          name: string
          organisation_id?: string | null
          organizer_id: string
          prize_pool?: Json | null
          registration_end_at?: string | null
          registration_start_at?: string | null
          start_at: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          format_settings?: Json | null
          format_type?: string
          game_id?: string
          id?: string
          max_participants?: number
          metadata?: Json | null
          min_participants?: number
          name?: string
          organisation_id?: string | null
          organizer_id?: string
          prize_pool?: Json | null
          registration_end_at?: string | null
          registration_start_at?: string | null
          start_at?: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_format_type_fkey"
            columns: ["format_type"]
            isOneToOne: false
            referencedRelation: "tournament_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_log: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          profile_id: string
          reason: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          profile_id: string
          reason?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          profile_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_log_profile_id_fkey"
            columns: ["profile_id"]
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
      [_ in never]: never
    }
    Enums: {
      event_status:
        | "draft"
        | "published"
        | "ongoing"
        | "completed"
        | "cancelled"
      match_status:
        | "waiting"
        | "ready"
        | "live"
        | "disputed"
        | "finished"
        | "canceled"
      organisation_role: "owner" | "admin" | "moderator" | "member"
      tournament_status: "setup" | "open" | "live" | "finished" | "canceled"
      user_role: "admin" | "lead" | "ambassador" | "member"
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
      event_status: ["draft", "published", "ongoing", "completed", "cancelled"],
      match_status: [
        "waiting",
        "ready",
        "live",
        "disputed",
        "finished",
        "canceled",
      ],
      organisation_role: ["owner", "admin", "moderator", "member"],
      tournament_status: ["setup", "open", "live", "finished", "canceled"],
      user_role: ["admin", "lead", "ambassador", "member"],
    },
  },
} as const

