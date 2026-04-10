-- ============================================
-- ADSCOUT FEATURE - META & TIKTOK ADS TRACKING
-- Schema pour connexions API multi-utilisateurs et cache ads
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: API Connections (Multi-user)
-- ============================================
CREATE TABLE IF NOT EXISTS api_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('meta', 'tiktok')),
  
  -- Meta credentials
  meta_app_id TEXT,
  meta_app_secret TEXT,
  meta_access_token TEXT,
  meta_token_expires_at TIMESTAMPTZ,
  
  -- TikTok credentials
  tiktok_app_id TEXT,
  tiktok_app_secret TEXT,
  tiktok_access_token TEXT,
  tiktok_token_expires_at TIMESTAMPTZ,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  sync_error TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- ============================================
-- TABLE: Cached Ads (Search Results)
-- ============================================
CREATE TABLE IF NOT EXISTS cached_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source info
  network TEXT NOT NULL CHECK (network IN ('facebook', 'instagram', 'tiktok')),
  ad_id TEXT NOT NULL,
  
  -- Unified ad data
  brand_name TEXT,
  page_name TEXT,
  ad_creative_url TEXT,
  ad_creative_type TEXT CHECK (ad_creative_type IN ('image', 'video', 'carousel')),
  thumbnail_url TEXT,
  copy_text TEXT,
  cta_type TEXT,
  cta_text TEXT,
  
  -- Targeting & Performance (estimates)
  spend_estimate_min INTEGER,
  spend_estimate_max INTEGER,
  impressions_estimate_min INTEGER,
  impressions_estimate_max INTEGER,
  
  -- Dates
  started_running_at TIMESTAMPTZ,
  stopped_running_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Raw data (pour debug)
  raw_data JSONB DEFAULT '{}',
  
  -- Cache metadata
  search_query TEXT,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(network, ad_id)
);

-- ============================================
-- TABLE: Saved Ads (User favorites)
-- ============================================
CREATE TABLE IF NOT EXISTS saved_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cached_ad_id UUID NOT NULL REFERENCES cached_ads(id) ON DELETE CASCADE,
  
  -- User notes
  user_notes TEXT,
  user_tags TEXT[] DEFAULT '{}',
  
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, cached_ad_id)
);

-- ============================================
-- TABLE: Search History
-- ============================================
CREATE TABLE IF NOT EXISTS ad_search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  search_query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_api_connections_user_id ON api_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_api_connections_provider ON api_connections(provider);
CREATE INDEX IF NOT EXISTS idx_cached_ads_network ON cached_ads(network);
CREATE INDEX IF NOT EXISTS idx_cached_ads_ad_id ON cached_ads(ad_id);
CREATE INDEX IF NOT EXISTS idx_cached_ads_brand_name ON cached_ads(brand_name);
CREATE INDEX IF NOT EXISTS idx_cached_ads_is_active ON cached_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_cached_ads_expires_at ON cached_ads(expires_at);
CREATE INDEX IF NOT EXISTS idx_saved_ads_user_id ON saved_ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_search_history_user_id ON ad_search_history(user_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS api_connections_updated_at ON api_connections;
CREATE TRIGGER api_connections_updated_at 
  BEFORE UPDATE ON api_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Clean expired cache
-- ============================================
CREATE OR REPLACE FUNCTION clean_expired_ads_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cached_ads WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES (Row Level Security)
-- ============================================
ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_search_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own API connections
CREATE POLICY "Users can view own API connections"
  ON api_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API connections"
  ON api_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API connections"
  ON api_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API connections"
  ON api_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see their own saved ads
CREATE POLICY "Users can view own saved ads"
  ON saved_ads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved ads"
  ON saved_ads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved ads"
  ON saved_ads FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see their own search history
CREATE POLICY "Users can view own search history"
  ON ad_search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
  ON ad_search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Cached ads are public (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view cached ads"
  ON cached_ads FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update cached ads
GRANT SELECT ON cached_ads TO authenticated;
GRANT ALL ON cached_ads TO service_role;
GRANT ALL ON api_connections TO service_role;
GRANT ALL ON saved_ads TO service_role;
GRANT ALL ON ad_search_history TO service_role;
