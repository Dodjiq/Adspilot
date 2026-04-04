-- ============================================
-- MIGRATION MONGODB → SUPABASE
-- Easy-Ecom Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: templates
-- Remplace la collection MongoDB 'templates'
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

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_templates_niche ON templates(niche);
CREATE INDEX IF NOT EXISTS idx_templates_format ON templates(format);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON templates(is_premium);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- ============================================
-- TABLE: saved_templates
-- Remplace la collection MongoDB 'saved_templates'
-- ============================================
CREATE TABLE IF NOT EXISTS saved_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON saved_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_templates_template_id ON saved_templates(template_id);

-- ============================================
-- TABLE: stores
-- Remplace la collection MongoDB 'stores'
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

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON stores(is_active);

-- ============================================
-- TABLE: profiles
-- Remplace la collection MongoDB 'profiles'
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

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- TABLE: meta_connections
-- Remplace la collection MongoDB 'meta_connections'
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

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_meta_connections_user_id ON meta_connections(user_id);

-- ============================================
-- TABLE: oauth_states
-- Remplace la collection MongoDB 'oauth_states'
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_id ON oauth_states(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- Cleanup automatique des états expirés (cron job)
-- Les états OAuth sont temporaires (15 minutes)

-- ============================================
-- TABLE: subscriptions
-- Nouvelle table pour gérer les abonnements Stripe
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'premium'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- ============================================
-- TABLE: user_activity
-- Pour tracking des actions utilisateur (analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'signup', 'login', 'view_template', 'save_template', 'connect_store', etc.
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche et analytics
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);

-- ============================================
-- TABLE: admin_notifications
-- Pour notifier l'admin d'événements importants
-- ============================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'new_user', 'new_subscription', 'subscription_cancelled', 'error'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
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
-- POLICIES: templates
-- Tout le monde peut lire, seul admin peut écrire
-- ============================================
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON templates;
CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert templates" ON templates;
CREATE POLICY "Only admins can insert templates"
  ON templates FOR INSERT
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

DROP POLICY IF EXISTS "Only admins can update templates" ON templates;
CREATE POLICY "Only admins can update templates"
  ON templates FOR UPDATE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

DROP POLICY IF EXISTS "Only admins can delete templates" ON templates;
CREATE POLICY "Only admins can delete templates"
  ON templates FOR DELETE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

-- ============================================
-- POLICIES: saved_templates
-- Users peuvent seulement voir/modifier leurs propres sauvegardes
-- ============================================
DROP POLICY IF EXISTS "Users can view their own saved templates" ON saved_templates;
CREATE POLICY "Users can view their own saved templates"
  ON saved_templates FOR SELECT
  USING (saved_templates.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own saved templates" ON saved_templates;
CREATE POLICY "Users can insert their own saved templates"
  ON saved_templates FOR INSERT
  WITH CHECK (saved_templates.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own saved templates" ON saved_templates;
CREATE POLICY "Users can delete their own saved templates"
  ON saved_templates FOR DELETE
  USING (saved_templates.user_id = auth.uid());

-- ============================================
-- POLICIES: stores
-- Users peuvent seulement voir/modifier leurs propres stores
-- ============================================
DROP POLICY IF EXISTS "Users can view their own stores" ON stores;
CREATE POLICY "Users can view their own stores"
  ON stores FOR SELECT
  USING (stores.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own stores" ON stores;
CREATE POLICY "Users can insert their own stores"
  ON stores FOR INSERT
  WITH CHECK (stores.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Users can update their own stores"
  ON stores FOR UPDATE
  USING (stores.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own stores" ON stores;
CREATE POLICY "Users can delete their own stores"
  ON stores FOR DELETE
  USING (stores.user_id = auth.uid());

-- ============================================
-- POLICIES: profiles
-- Users peuvent seulement voir/modifier leur propre profil
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (profiles.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (profiles.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (profiles.user_id = auth.uid());

-- ============================================
-- POLICIES: meta_connections
-- Users peuvent seulement voir/modifier leurs propres connexions
-- ============================================
DROP POLICY IF EXISTS "Users can view their own meta connections" ON meta_connections;
CREATE POLICY "Users can view their own meta connections"
  ON meta_connections FOR SELECT
  USING (meta_connections.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own meta connections" ON meta_connections;
CREATE POLICY "Users can insert their own meta connections"
  ON meta_connections FOR INSERT
  WITH CHECK (meta_connections.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own meta connections" ON meta_connections;
CREATE POLICY "Users can update their own meta connections"
  ON meta_connections FOR UPDATE
  USING (meta_connections.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own meta connections" ON meta_connections;
CREATE POLICY "Users can delete their own meta connections"
  ON meta_connections FOR DELETE
  USING (meta_connections.user_id = auth.uid());

-- ============================================
-- POLICIES: oauth_states
-- Users peuvent seulement voir/modifier leurs propres états OAuth
-- ============================================
DROP POLICY IF EXISTS "Users can view their own oauth states" ON oauth_states;
CREATE POLICY "Users can view their own oauth states"
  ON oauth_states FOR SELECT
  USING (oauth_states.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own oauth states" ON oauth_states;
CREATE POLICY "Users can insert their own oauth states"
  ON oauth_states FOR INSERT
  WITH CHECK (oauth_states.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own oauth states" ON oauth_states;
CREATE POLICY "Users can delete their own oauth states"
  ON oauth_states FOR DELETE
  USING (oauth_states.user_id = auth.uid());

-- ============================================
-- POLICIES: subscriptions
-- Users peuvent seulement voir leur propre abonnement
-- ============================================
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (subscriptions.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own subscription" ON subscriptions;
CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (subscriptions.user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;
CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (subscriptions.user_id = auth.uid());

-- ============================================
-- POLICIES: user_activity
-- Users peuvent seulement voir leur propre activité
-- Admins peuvent tout voir
-- ============================================
DROP POLICY IF EXISTS "Users can view their own activity" ON user_activity;
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (
    user_activity.user_id = auth.uid()
    OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

DROP POLICY IF EXISTS "Anyone can insert activity" ON user_activity;
CREATE POLICY "Anyone can insert activity"
  ON user_activity FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLICIES: admin_notifications
-- Seul l'admin peut voir/modifier les notifications admin
-- ============================================
DROP POLICY IF EXISTS "Only admins can view admin notifications" ON admin_notifications;
CREATE POLICY "Only admins can view admin notifications"
  ON admin_notifications FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

DROP POLICY IF EXISTS "Only admins can insert admin notifications" ON admin_notifications;
CREATE POLICY "Only admins can insert admin notifications"
  ON admin_notifications FOR INSERT
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

DROP POLICY IF EXISTS "Only admins can update admin notifications" ON admin_notifications;
CREATE POLICY "Only admins can update admin notifications"
  ON admin_notifications FOR UPDATE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'dodjiq@gmail.com'
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_connections_updated_at BEFORE UPDATE ON meta_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: templates
-- Insérer les 12 templates de base
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
-- VIEWS UTILES
-- ============================================

-- Vue pour statistiques admin
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

-- Vue pour inscriptions par jour (30 derniers jours)
CREATE OR REPLACE VIEW daily_signups AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS count
FROM auth.users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Vue pour templates les plus sauvegardés
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

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Allow service role to access views
GRANT SELECT ON admin_stats TO service_role;
GRANT SELECT ON daily_signups TO service_role;
GRANT SELECT ON popular_templates TO service_role;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
POUR EXÉCUTER CE SCRIPT :
1. Aller dans Supabase Dashboard
2. Aller dans SQL Editor
3. Copier-coller tout ce script
4. Cliquer sur "Run"

APRÈS L'EXÉCUTION :
1. Vérifier que toutes les tables sont créées
2. Vérifier que les 12 templates sont insérés
3. Tester les policies RLS
4. Modifier le code API pour utiliser Supabase au lieu de MongoDB

MIGRATION DES DONNÉES EXISTANTES :
Si vous avez déjà des données dans MongoDB :
1. Exporter les données de MongoDB
2. Les importer dans Supabase via l'API ou SQL
3. Vérifier l'intégrité des données
*/
