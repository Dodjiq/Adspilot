-- ============================================
-- SCRAPIFY MODULE - SUPABASE SCHEMA
-- ============================================
-- Module de scraping et importation de produits Shopify
-- Auteur: AdsPilot SaaS
-- Date: 2026-04-08

-- ============================================
-- TABLE: shopify_stores
-- Stocke les boutiques Shopify connectées par OAuth
-- ============================================
CREATE TABLE IF NOT EXISTS shopify_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations boutique
  shop_domain TEXT NOT NULL, -- ex: ma-boutique.myshopify.com
  shop_name TEXT, -- Nom commercial de la boutique
  shop_email TEXT,
  shop_owner TEXT,
  
  -- Credentials OAuth (à chiffrer)
  access_token TEXT NOT NULL, -- Token d'accès Shopify Admin API
  scope TEXT, -- Scopes accordés (ex: write_products,read_orders)
  
  -- Métadonnées
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(user_id, shop_domain)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_shopify_stores_user_id ON shopify_stores(user_id);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_active ON shopify_stores(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_domain ON shopify_stores(shop_domain);

-- ============================================
-- TABLE: scraped_products
-- Historique des produits scrapés
-- ============================================
CREATE TABLE IF NOT EXISTS scraped_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Données du produit (format JSON)
  product_data JSONB NOT NULL, -- Structure complète du produit scrapé
  
  -- Statut du produit
  status TEXT NOT NULL CHECK (status IN ('scraped', 'edited', 'published', 'failed')),
  
  -- Référence publication
  published_to_shop_id UUID REFERENCES shopify_stores(id) ON DELETE SET NULL,
  published_product_id TEXT, -- ID du produit créé sur Shopify
  published_at TIMESTAMPTZ,
  
  -- Gestion erreurs
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Métadonnées
  source_url TEXT, -- URL d'origine du produit scrapé
  source_shop_domain TEXT, -- Domaine de la boutique source
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_scraped_products_user_id ON scraped_products(user_id);
CREATE INDEX IF NOT EXISTS idx_scraped_products_status ON scraped_products(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scraped_products_created_at ON scraped_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_products_shop_id ON scraped_products(published_to_shop_id);

-- Index GIN pour recherche dans JSONB
CREATE INDEX IF NOT EXISTS idx_scraped_products_data ON scraped_products USING GIN (product_data);

-- ============================================
-- TABLE: scrapify_settings
-- Paramètres utilisateur pour Scrapify
-- ============================================
CREATE TABLE IF NOT EXISTS scrapify_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Préférences de scraping
  auto_select_all_images BOOLEAN DEFAULT true,
  default_product_status TEXT DEFAULT 'draft' CHECK (default_product_status IN ('active', 'draft', 'archived')),
  preserve_vendor BOOLEAN DEFAULT false,
  preserve_tags BOOLEAN DEFAULT true,
  
  -- Préférences de prix
  price_adjustment_type TEXT CHECK (price_adjustment_type IN ('none', 'percentage', 'fixed')),
  price_adjustment_value DECIMAL(10, 2),
  
  -- Boutique par défaut
  default_shop_id UUID REFERENCES shopify_stores(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrapify_settings_user_id ON scrapify_settings(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE shopify_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrapify_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: shopify_stores
-- ============================================

DROP POLICY IF EXISTS "Users can view their own stores" ON shopify_stores;
CREATE POLICY "Users can view their own stores"
  ON shopify_stores FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stores" ON shopify_stores;
CREATE POLICY "Users can insert their own stores"
  ON shopify_stores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stores" ON shopify_stores;
CREATE POLICY "Users can update their own stores"
  ON shopify_stores FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own stores" ON shopify_stores;
CREATE POLICY "Users can delete their own stores"
  ON shopify_stores FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: scraped_products
-- ============================================

DROP POLICY IF EXISTS "Users can view their own scraped products" ON scraped_products;
CREATE POLICY "Users can view their own scraped products"
  ON scraped_products FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own scraped products" ON scraped_products;
CREATE POLICY "Users can insert their own scraped products"
  ON scraped_products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own scraped products" ON scraped_products;
CREATE POLICY "Users can update their own scraped products"
  ON scraped_products FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own scraped products" ON scraped_products;
CREATE POLICY "Users can delete their own scraped products"
  ON scraped_products FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: scrapify_settings
-- ============================================

DROP POLICY IF EXISTS "Users can view their own settings" ON scrapify_settings;
CREATE POLICY "Users can view their own settings"
  ON scrapify_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own settings" ON scrapify_settings;
CREATE POLICY "Users can insert their own settings"
  ON scrapify_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own settings" ON scrapify_settings;
CREATE POLICY "Users can update their own settings"
  ON scrapify_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour shopify_stores
DROP TRIGGER IF EXISTS update_shopify_stores_updated_at ON shopify_stores;
CREATE TRIGGER update_shopify_stores_updated_at
  BEFORE UPDATE ON shopify_stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour scraped_products
DROP TRIGGER IF EXISTS update_scraped_products_updated_at ON scraped_products;
CREATE TRIGGER update_scraped_products_updated_at
  BEFORE UPDATE ON scraped_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour scrapify_settings
DROP TRIGGER IF EXISTS update_scrapify_settings_updated_at ON scrapify_settings;
CREATE TRIGGER update_scrapify_settings_updated_at
  BEFORE UPDATE ON scrapify_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour obtenir les statistiques de scraping d'un utilisateur
CREATE OR REPLACE FUNCTION get_scrapify_stats(p_user_id UUID)
RETURNS TABLE (
  total_scraped BIGINT,
  total_published BIGINT,
  total_failed BIGINT,
  total_edited BIGINT,
  connected_stores BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'scraped') AS total_scraped,
    COUNT(*) FILTER (WHERE status = 'published') AS total_published,
    COUNT(*) FILTER (WHERE status = 'failed') AS total_failed,
    COUNT(*) FILTER (WHERE status = 'edited') AS total_edited,
    (SELECT COUNT(*) FROM shopify_stores WHERE user_id = p_user_id AND is_active = true) AS connected_stores
  FROM scraped_products
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL - À RETIRER EN PROD)
-- ============================================

-- Exemple de settings par défaut pour un nouvel utilisateur
-- CREATE OR REPLACE FUNCTION create_default_scrapify_settings()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO scrapify_settings (user_id)
--   VALUES (NEW.id)
--   ON CONFLICT (user_id) DO NOTHING;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- DROP TRIGGER IF EXISTS create_scrapify_settings_on_signup ON auth.users;
-- CREATE TRIGGER create_scrapify_settings_on_signup
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_default_scrapify_settings();

-- ============================================
-- NOTES D'IMPLÉMENTATION
-- ============================================

-- SÉCURITÉ DES TOKENS:
-- Les access_token Shopify doivent être chiffrés au repos.
-- Utiliser pgcrypto pour le chiffrement:
-- 
-- Exemple d'insertion avec chiffrement:
-- INSERT INTO shopify_stores (user_id, shop_domain, access_token)
-- VALUES (
--   'user-uuid',
--   'boutique.myshopify.com',
--   pgp_sym_encrypt('shpat_xxxxx', current_setting('app.encryption_key'))
-- );
--
-- Exemple de lecture avec déchiffrement:
-- SELECT 
--   id,
--   shop_domain,
--   pgp_sym_decrypt(access_token::bytea, current_setting('app.encryption_key')) as decrypted_token
-- FROM shopify_stores
-- WHERE user_id = 'user-uuid';

-- STRUCTURE JSONB product_data:
-- {
--   "scraped_at": "2026-04-08T19:52:00Z",
--   "source_url": "https://competitor.com/products/example",
--   "source_shop_domain": "competitor.myshopify.com",
--   "title": "Produit Example",
--   "body_html": "<p>Description HTML</p>",
--   "vendor": "Marque",
--   "product_type": "Vêtements",
--   "tags": ["nouveau", "promo"],
--   "variants": [...],
--   "images": [...],
--   "options": [...]
-- }

-- ============================================
-- FIN DU SCHÉMA
-- ============================================
