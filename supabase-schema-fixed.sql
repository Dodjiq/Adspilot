-- ============================================
-- MIGRATION MONGODB → SUPABASE
-- Easy-Ecom Database Schema - VERSION CORRIGÉE
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: templates
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

CREATE INDEX IF NOT EXISTS idx_templates_niche ON templates(niche);
CREATE INDEX IF NOT EXISTS idx_templates_format ON templates(format);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON templates(is_premium);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- ============================================
-- TABLE: saved_templates
-- ============================================
CREATE TABLE IF NOT EXISTS saved_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON saved_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_templates_template_id ON saved_templates(template_id);

-- ============================================
-- TABLE: stores
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON stores(is_active);

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  business_niche TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- TABLE: meta_connections
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_meta_connections_user_id ON meta_connections(user_id);

-- ============================================
-- TABLE: oauth_states
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_id ON oauth_states(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- ============================================
-- TABLE: subscriptions
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- TABLE: user_activity
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);

-- ============================================
-- TABLE: admin_notifications
-- ============================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: templates (public read, admin write)
-- ============================================
DROP POLICY IF EXISTS "templates_select_public" ON templates;
CREATE POLICY "templates_select_public"
  ON templates FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "templates_insert_admin" ON templates;
CREATE POLICY "templates_insert_admin"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

DROP POLICY IF EXISTS "templates_update_admin" ON templates;
CREATE POLICY "templates_update_admin"
  ON templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

DROP POLICY IF EXISTS "templates_delete_admin" ON templates;
CREATE POLICY "templates_delete_admin"
  ON templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

-- ============================================
-- POLICIES: saved_templates (user owns data)
-- ============================================
DROP POLICY IF EXISTS "saved_templates_select" ON saved_templates;
CREATE POLICY "saved_templates_select"
  ON saved_templates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_templates_insert" ON saved_templates;
CREATE POLICY "saved_templates_insert"
  ON saved_templates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_templates_delete" ON saved_templates;
CREATE POLICY "saved_templates_delete"
  ON saved_templates FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: stores (user owns data)
-- ============================================
DROP POLICY IF EXISTS "stores_select" ON stores;
CREATE POLICY "stores_select"
  ON stores FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "stores_insert" ON stores;
CREATE POLICY "stores_insert"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "stores_update" ON stores;
CREATE POLICY "stores_update"
  ON stores FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "stores_delete" ON stores;
CREATE POLICY "stores_delete"
  ON stores FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: profiles (user owns data)
-- ============================================
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: meta_connections (user owns data)
-- ============================================
DROP POLICY IF EXISTS "meta_connections_select" ON meta_connections;
CREATE POLICY "meta_connections_select"
  ON meta_connections FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "meta_connections_insert" ON meta_connections;
CREATE POLICY "meta_connections_insert"
  ON meta_connections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "meta_connections_update" ON meta_connections;
CREATE POLICY "meta_connections_update"
  ON meta_connections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "meta_connections_delete" ON meta_connections;
CREATE POLICY "meta_connections_delete"
  ON meta_connections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: oauth_states (user owns data)
-- ============================================
DROP POLICY IF EXISTS "oauth_states_select" ON oauth_states;
CREATE POLICY "oauth_states_select"
  ON oauth_states FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "oauth_states_insert" ON oauth_states;
CREATE POLICY "oauth_states_insert"
  ON oauth_states FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "oauth_states_delete" ON oauth_states;
CREATE POLICY "oauth_states_delete"
  ON oauth_states FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: subscriptions (user owns data)
-- ============================================
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "subscriptions_insert" ON subscriptions;
CREATE POLICY "subscriptions_insert"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "subscriptions_update" ON subscriptions;
CREATE POLICY "subscriptions_update"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- POLICIES: user_activity (user can view own + admin)
-- ============================================
DROP POLICY IF EXISTS "user_activity_select" ON user_activity;
CREATE POLICY "user_activity_select"
  ON user_activity FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

DROP POLICY IF EXISTS "user_activity_insert" ON user_activity;
CREATE POLICY "user_activity_insert"
  ON user_activity FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- ============================================
-- POLICIES: admin_notifications (admin only)
-- ============================================
DROP POLICY IF EXISTS "admin_notifications_select" ON admin_notifications;
CREATE POLICY "admin_notifications_select"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

DROP POLICY IF EXISTS "admin_notifications_insert" ON admin_notifications;
CREATE POLICY "admin_notifications_insert"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

DROP POLICY IF EXISTS "admin_notifications_update" ON admin_notifications;
CREATE POLICY "admin_notifications_update"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'dodjiq@gmail.com'
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meta_connections_updated_at ON meta_connections;
CREATE TRIGGER update_meta_connections_updated_at
  BEFORE UPDATE ON meta_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
-- VIEWS FOR ADMIN
-- ============================================
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM templates) AS total_templates,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan != 'free') AS active_subscriptions,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'pro' AND status = 'active') AS pro_subscriptions,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'premium' AND status = 'active') AS premium_subscriptions,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE) AS new_users_today,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') AS new_users_week,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS new_users_month;

CREATE OR REPLACE VIEW daily_signups AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS count
FROM auth.users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW popular_templates AS
SELECT
  t.id,
  t.title,
  t.niche,
  t.format,
  COUNT(st.id) AS saves_count
FROM templates t
LEFT JOIN saved_templates st ON t.id = st.template_id
GROUP BY t.id, t.title, t.niche, t.format
ORDER BY saves_count DESC
LIMIT 10;

-- Grant permissions
GRANT SELECT ON admin_stats TO service_role;
GRANT SELECT ON daily_signups TO service_role;
GRANT SELECT ON popular_templates TO service_role;
