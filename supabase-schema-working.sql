-- ============================================
-- MIGRATION MONGODB → SUPABASE
-- VERSION QUI FONCTIONNE VRAIMENT
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  niche TEXT NOT NULL,
  format TEXT NOT NULL,
  canva_template_id TEXT,
  preview_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shopify_domain TEXT NOT NULL,
  shop_name TEXT,
  currency TEXT DEFAULT 'EUR',
  product_count INTEGER DEFAULT 0,
  products JSONB DEFAULT '[]',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  business_niche TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meta_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  meta_user_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_in INTEGER,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_templates_niche ON templates(niche);
CREATE INDEX IF NOT EXISTS idx_templates_format ON templates(format);
CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON saved_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_meta_connections_user_id ON meta_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_id ON oauth_states(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

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

DROP TRIGGER IF EXISTS t1 ON templates;
CREATE TRIGGER t1 BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS t2 ON stores;
CREATE TRIGGER t2 BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS t3 ON profiles;
CREATE TRIGGER t3 BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS t4 ON meta_connections;
CREATE TRIGGER t4 BEFORE UPDATE ON meta_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS t5 ON subscriptions;
CREATE TRIGGER t5 BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO templates (id, title, description, niche, format, canva_template_id, preview_url, tags, is_premium) VALUES
('t1', 'Glow naturel', 'Template testimonial pour produits éclaircissants', 'beaute', 'carre', 'mock_canva_001', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', ARRAY['testimonial', 'skincare', 'glow'], FALSE),
('t2', 'Avant / Après', 'Comparaison résultats avant-après produit beauté', 'beaute', 'carre', 'mock_canva_002', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop', ARRAY['avant-apres', 'transformation'], FALSE),
('t3', 'Flash Sale Mode', 'Promotion urgence pour boutique mode africaine', 'mode', 'story', 'mock_canva_003', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', ARRAY['promo', 'urgence', 'flash'], FALSE),
('t4', 'Nouvelle collection', 'Lancement collection avec ambiance premium', 'mode', 'landscape', 'mock_canva_004', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', ARRAY['lancement', 'premium', 'collection'], TRUE),
('t5', 'Plat du jour', 'Template restaurant / livraison food africain', 'food', 'carre', 'mock_canva_005', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', ARRAY['restaurant', 'livraison'], FALSE),
('t6', 'Promotion repas', 'Offre spéciale food avec CTA fort', 'food', 'story', 'mock_canva_006', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', ARRAY['promo', 'food', 'offre'], FALSE),
('t7', 'Tech Review', 'Style unboxing/review pour produits électroniques', 'electronique', 'carre', 'mock_canva_007', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', ARRAY['review', 'tech', 'unboxing'], FALSE),
('t8', 'Meilleur prix', 'Comparaison prix / badge meilleure offre', 'electronique', 'landscape', 'mock_canva_008', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', ARRAY['prix', 'promo'], TRUE),
('t9', 'Déco maison', 'Ambiance lifestyle pour produits maison', 'maison', 'carre', 'mock_canva_009', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop', ARRAY['lifestyle', 'deco'], FALSE),
('t10', '5 étoiles', 'Template avis clients / social proof', 'beaute', 'story', 'mock_canva_010', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop', ARRAY['reviews', 'social-proof'], FALSE),
('t11', 'Offre limitée', 'Urgence FOMO avec compte à rebours visuel', 'mode', 'carre', 'mock_canva_011', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', ARRAY['fomo', 'urgence'], FALSE),
('t12', 'Duo produit', 'Mise en avant d''un bundle / pack de produits', 'beaute', 'landscape', 'mock_canva_012', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', ARRAY['bundle', 'pack'], FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VIEWS
-- ============================================
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM templates) AS total_templates,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan != 'free') AS active_subscriptions,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'pro' AND status = 'active') AS pro_subscriptions,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'premium' AND status = 'active') AS premium_subscriptions;

CREATE OR REPLACE VIEW daily_signups AS
SELECT DATE(created_at) AS date, COUNT(*) AS count
FROM auth.users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW popular_templates AS
SELECT t.id, t.title, t.niche, t.format, COUNT(st.id) AS saves_count
FROM templates t
LEFT JOIN saved_templates st ON t.id = st.template_id
GROUP BY t.id, t.title, t.niche, t.format
ORDER BY saves_count DESC
LIMIT 10;

GRANT SELECT ON admin_stats TO service_role;
GRANT SELECT ON daily_signups TO service_role;
GRANT SELECT ON popular_templates TO service_role;
