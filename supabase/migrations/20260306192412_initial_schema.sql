-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE user_role AS ENUM ('admin', 'lead', 'ambassador', 'member');
CREATE TYPE organisation_role AS ENUM ('owner', 'admin', 'moderator', 'member');
CREATE TYPE match_status AS ENUM ('waiting', 'ready', 'live', 'disputed', 'finished', 'canceled');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');
CREATE TYPE tournament_status AS ENUM ('setup', 'open', 'live', 'finished', 'canceled');

-- Create event_types table
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game_types table
CREATE TABLE game_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

-- Create tournament_formats table
CREATE TABLE tournament_formats (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    min_participants INTEGER NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    default_settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'member',
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    qr_token TEXT UNIQUE,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organisations table
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organisation_members table
CREATE TABLE organisation_members (
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role organisation_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (organisation_id, profile_id)
);

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    logo_url TEXT,
    banner_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type UUID NOT NULL REFERENCES game_types(id),
    logo_url TEXT,
    banner_url TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_rosters table
CREATE TABLE team_rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name TEXT,
    captain_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    players UUID[] NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, game_id)
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    type UUID NOT NULL REFERENCES event_types(id),
    status event_status DEFAULT 'draft',
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
    max_capacity INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    location JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tournaments table
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    game_id UUID NOT NULL REFERENCES games(id),
    organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    format_type TEXT NOT NULL REFERENCES tournament_formats(id),
    status tournament_status DEFAULT 'setup',
    registration_start_at TIMESTAMPTZ,
    registration_end_at TIMESTAMPTZ,
    start_at TIMESTAMPTZ NOT NULL,
    max_participants INTEGER NOT NULL,
    min_participants INTEGER NOT NULL DEFAULT 2,
    format_settings JSONB DEFAULT '{}',
    prize_pool JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    bracket_type TEXT CHECK (bracket_type IN ('winners', 'losers')),
    group_id TEXT,
    next_match_id UUID REFERENCES matches(id),
    loser_next_match_id UUID REFERENCES matches(id),
    roster_a_id UUID REFERENCES team_rosters(id),
    roster_b_id UUID REFERENCES team_rosters(id),
    status match_status DEFAULT 'waiting',
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    winner_id UUID REFERENCES team_rosters(id),
    metadata JSONB DEFAULT '{}',
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create xp_log table
CREATE TABLE xp_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_organisations_slug ON organisations(slug);
CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_events_start_datetime ON events(start_datetime);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_tournaments_game_id ON tournaments(game_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX idx_matches_status ON matches(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;

-- Create policies (basic policies, adjust as needed)
-- Profiles: Users can read all, update own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organisations: Public read, owner/admin can update
CREATE POLICY "Organisations are viewable by everyone" ON organisations FOR SELECT USING (true);
CREATE POLICY "Organisation owners can update" ON organisations FOR UPDATE USING (auth.uid() = owner_id);

-- Similar policies for other tables (simplified for initial schema)
-- Add more specific policies based on your RLS requirements