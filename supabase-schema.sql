-- BeHere — Supabase Schema
-- Coller ce contenu dans l'éditeur SQL de votre projet Supabase

-- Table principale des artistes
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  origin TEXT,
  city TEXT,
  country TEXT,
  genre TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'music',
  bio TEXT,
  spotify_id TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube_channel TEXT,
  booking_email TEXT,
  label TEXT,
  custom_photo_url TEXT,         -- Pour artistes sans Spotify (ex: Madness)
  timeline JSONB DEFAULT '[]',
  releases JSONB DEFAULT '[]',
  stats JSONB DEFAULT '{}',
  youtube_ids TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  plan TEXT DEFAULT 'free',       -- free | pro | label
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_genre ON artists USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_artists_city ON artists(city);
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON artists(is_featured) WHERE is_featured = TRUE;

-- RLS (Row Level Security)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire
CREATE POLICY "artists_public_read" ON artists
  FOR SELECT USING (TRUE);

-- Seul le service role peut écrire
CREATE POLICY "artists_service_write" ON artists
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Table des inscriptions (liste d'attente)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  artist_name TEXT,
  genre TEXT,
  spotify_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_insert" ON waitlist
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "waitlist_service_read" ON waitlist
  FOR SELECT USING (auth.role() = 'service_role');

-- ─── Table enrichissements IA ──────────────────────────────────────────────────
-- Stocke les résultats de l'agent d'enrichissement multi-sources
-- (Wikipedia, Deezer, MusicBrainz, iTunes + synthèse Claude)

CREATE TABLE IF NOT EXISTS artist_enrichments (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_slug    TEXT        NOT NULL UNIQUE,
  photo_url      TEXT,
  bio_enriched   TEXT,
  sources        TEXT[]      DEFAULT '{}',
  confidence     FLOAT       DEFAULT 0,
  raw_data       JSONB       DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enrichments_slug ON artist_enrichments(artist_slug);
CREATE INDEX IF NOT EXISTS idx_enrichments_updated ON artist_enrichments(updated_at DESC);

ALTER TABLE artist_enrichments ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "enrichments_public_read" ON artist_enrichments
  FOR SELECT USING (TRUE);

-- Écriture réservée au service role (API backend)
CREATE POLICY "enrichments_service_write" ON artist_enrichments
  FOR ALL USING (auth.role() = 'service_role');

CREATE TRIGGER enrichments_updated_at
  BEFORE UPDATE ON artist_enrichments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
