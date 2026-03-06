import { Database } from './schema';

/**
 * RACCOURCIS POUR LES TABLES (READ/ROW)
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Game = Database['public']['Tables']['games']['Row'];
export type GameType = Database['public']['Tables']['game_types']['Row'];
export type Organisation = Database['public']['Tables']['organisations']['Row'];
export type OrganisationMember = Database['public']['Tables']['organisation_members']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamRoster = Database['public']['Tables']['team_rosters']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventType = Database['public']['Tables']['event_types']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type TournamentFormat = Database['public']['Tables']['tournament_formats']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type XpLog = Database['public']['Tables']['xp_log']['Row'];

/**
 * RACCOURCIS POUR L'INSERTION (Utile pour les formulaires)
 */
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type GameInsert = Database['public']['Tables']['games']['Insert'];
export type TournamentInsert = Database['public']['Tables']['tournaments']['Insert'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];

/**
 * RACCOURCIS POUR LES ENUMS
 */
export type EventStatus = Database['public']['Enums']['event_status'];
export type MatchStatus = Database['public']['Enums']['match_status'];
export type OrganisationRole = Database['public']['Enums']['organisation_role'];
export type TournamentStatus = Database['public']['Enums']['tournament_status'];
export type UserRole = Database['public']['Enums']['user_role'];