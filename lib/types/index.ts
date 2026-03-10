import { createApiHooks } from '../hooks/createApiHooks'

// Hooks pour les tables avec une clé primaire 'id' standard
export const useEventTypes = createApiHooks('event_types')
export const useEvents = createApiHooks('events')
export const useGameTypes = createApiHooks('game_types')
export const useGames = createApiHooks('games')
export const useMatches = createApiHooks('matches')
export const useOrganisations = createApiHooks('organisations')
export const useProfiles = createApiHooks('profiles')
export const useTeamRosters = createApiHooks('team_rosters')
export const useTeams = createApiHooks('teams')
export const useTournamentFormats = createApiHooks('tournament_formats')
export const useTournaments = createApiHooks('tournaments')
export const useXpLog = createApiHooks('xp_log')

// Cas spécial pour `organisation_members` qui a une clé primaire composite
export const useOrganisationMembers = createApiHooks('organisation_members', [
  'organisation_id',
  'profile_id',
])