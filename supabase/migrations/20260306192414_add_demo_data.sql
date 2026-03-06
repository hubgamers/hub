-- Insert demo data for development and testing

-- Create a mock user in auth.users to allow foreign key constraints
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@hubgamers.gg', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create the corresponding profile
INSERT INTO public.profiles (id, username, avatar_url, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'DemoUser', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Game types
INSERT INTO game_types (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'MOBA', 'Multiplayer Online Battle Arena'),
('550e8400-e29b-41d4-a716-446655440002', 'FPS', 'First Person Shooter'),
('550e8400-e29b-41d4-a716-446655440003', 'Battle Royale', 'Battle Royale games'),
('550e8400-e29b-41d4-a716-446655440004', 'Strategy', 'Strategy games');

-- Event types
INSERT INTO event_types (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'esport', 'Compétition esportive'),
('550e8400-e29b-41d4-a716-446655440006', 'festival', 'Festival gaming'),
('550e8400-e29b-41d4-a716-446655440007', 'meetup', 'Rencontre communautaire'),
('550e8400-e29b-41d4-a716-446655440008', 'workshop', 'Atelier de formation');

-- Games
INSERT INTO games (id, name, slug, type, logo_url, config, metadata, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'League of Legends', 'league-of-legends', '550e8400-e29b-41d4-a716-446655440001', 'https://example.com/lol-logo.png', '{
  "min_players_per_team": 5,
  "max_players_per_team": 5,
  "allow_draws": false,
  "has_map_veto": true,
  "available_maps": ["Summoner''s Rift", "Howling Abyss"],
  "scoring_format": "POSITION",
  "default_match_format": "BO3"
}', '{
  "developer": "Riot Games",
  "official_website": "https://www.leagueoflegends.com",
  "api_integration": true
}', true),
('550e8400-e29b-41d4-a716-446655440010', 'Counter-Strike 2', 'counter-strike-2', '550e8400-e29b-41d4-a716-446655440002', 'https://example.com/cs2-logo.png', '{
  "min_players_per_team": 5,
  "max_players_per_team": 5,
  "allow_draws": false,
  "has_map_veto": true,
  "available_maps": ["Mirage", "Inferno", "Dust2"],
  "scoring_format": "ROUNDS",
  "default_match_format": "BO3"
}', '{
  "developer": "Valve",
  "official_website": "https://www.counter-strike.net",
  "api_integration": false
}', true),
('550e8400-e29b-41d4-a716-446655440011', 'Apex Legends', 'apex-legends', '550e8400-e29b-41d4-a716-446655440003', 'https://example.com/apex-logo.png', '{
  "min_players_per_team": 3,
  "max_players_per_team": 3,
  "allow_draws": false,
  "has_map_veto": false,
  "scoring_format": "POSITION",
  "default_match_format": "BO1"
}', '{
  "developer": "Respawn Entertainment",
  "official_website": "https://www.ea.com/games/apex-legends",
  "api_integration": false
}', true);

-- Demo organisations (using placeholder owner_id - replace with real user ID)
INSERT INTO organisations (id, name, slug, owner_id, logo_url, description, is_verified, settings, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440015', 'ArenaHub League', 'arenahub-league', '00000000-0000-0000-0000-000000000000', 'https://example.com/org-logo.png', 'Organisation dédiée aux compétitions League of Legends', true, '{
  "contact_email": "contact@arenahub.fr",
  "website_url": "https://arenahub.fr",
  "social_links": {
    "discord": "https://discord.gg/arenahub",
    "twitter": "https://twitter.com/arenahub"
  },
  "preferred_games": ["550e8400-e29b-41d4-a716-446655440009"]
}', '{
  "total_tournaments_hosted": 15,
  "total_teams_managed": 8,
  "founded_at": "2024-01-01T00:00:00Z"
}');

-- Demo teams (using placeholder owner_id - replace with real user ID)
INSERT INTO teams (id, name, slug, organisation_id, owner_id, logo_url, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440016', 'Vitality Gaming', 'vitality-gaming', '550e8400-e29b-41d4-a716-446655440015', '00000000-0000-0000-0000-000000000000', 'https://example.com/team-logo.png', '{
  "description": "Équipe française d''esport",
  "website": "https://vitality.gg",
  "social_links": {
    "twitter": "https://twitter.com/Vitality"
  }
}'),
('550e8400-e29b-41d4-a716-446655440017', 'Team BDS', 'team-bds', null, '00000000-0000-0000-0000-000000000000', 'https://example.com/team2-logo.png', '{
  "description": "Équipe suisse de League of Legends"
}');

-- Demo events (using placeholder organizer_id - replace with real user ID)
INSERT INTO events (id, name, description, start_datetime, end_datetime, type, status, organizer_id, organisation_id, max_capacity, is_public, location, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440019', 'Spring Championship 2026', 'Championnat de printemps League of Legends', '2026-04-01T10:00:00Z', '2026-04-03T18:00:00Z', '550e8400-e29b-41d4-a716-446655440005', 'published', '00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440015', 16, true, '{
  "address": "Paris Expo Porte de Versailles",
  "city": "Paris",
  "postal_code": "75015",
  "coordinates": {
    "lat": 48.8323,
    "lng": 2.2866
  }
}', '{
  "venue_map_url": "https://example.com/map",
  "stream_links": ["https://twitch.tv/arenahub"],
  "banner_url": "https://example.com/event-banner.png",
  "social_links": {
    "discord": "https://discord.gg/event123"
  }
}');

-- Demo tournaments (using placeholder organizer_id - replace with real user ID)
INSERT INTO tournaments (id, name, game_id, organisation_id, organizer_id, format_type, status, start_at, max_participants, min_participants, format_settings, prize_pool, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'ArenaHub Cup', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440015', '00000000-0000-0000-0000-000000000000', 'SINGLE_ELIM', 'open', '2026-04-01T14:00:00Z', 8, 4, '{
  "points_per_win": 1,
  "match_format": "BO3",
  "allow_self_report": false
}', '{
  "total_amount": 5000,
  "currency": "EUR",
  "distribution": {
    "rank_1": "2500€",
    "rank_2": "1500€",
    "rank_3": "1000€"
  }
}', '{
  "rules_url": "https://arenahub.fr/rules",
  "banner_url": "https://example.com/tournament-banner.png",
  "discord_invite": "https://discord.gg/tournament"
}');