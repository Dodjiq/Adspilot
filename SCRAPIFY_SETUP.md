# 🛠️ SCRAPIFY - GUIDE D'INSTALLATION ET CONFIGURATION

## 📋 Vue d'ensemble

**Scrapify** est un module permettant de scraper des produits Shopify concurrents et de les importer automatiquement dans vos boutiques Shopify connectées.

---

## 🗄️ ÉTAPE 1 : Configuration de la base de données

### 1.1 Exécuter le schéma SQL

Connectez-vous à votre dashboard Supabase et exécutez le fichier :
```bash
supabase-scrapify-schema.sql
```

Ce script créera :
- ✅ Table `shopify_stores` (boutiques connectées)
- ✅ Table `scraped_products` (historique des produits scrapés)
- ✅ Table `scrapify_settings` (paramètres utilisateur)
- ✅ Policies RLS (sécurité)
- ✅ Fonction `get_scrapify_stats()` (statistiques)

### 1.2 Vérification

Exécutez cette requête pour vérifier :
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('shopify_stores', 'scraped_products', 'scrapify_settings');
```

Vous devriez voir 3 lignes.

---

## 🔐 ÉTAPE 2 : Configuration Shopify App

### 2.1 Créer une Shopify App

1. Allez sur : https://partners.shopify.com/
2. Créez un compte Partner si nécessaire
3. Cliquez sur **Apps** → **Create app**
4. Choisissez **Custom app**
5. Nommez votre app : `AdsPilot Scrapify`

### 2.2 Configurer les scopes OAuth

Dans **Configuration** → **App setup** :

**Scopes requis :**
- `write_products` (créer/modifier des produits)
- `read_products` (lire les produits)
- `write_inventory` (gérer l'inventaire)
- `read_inventory` (lire l'inventaire)

### 2.3 Configurer les URLs de redirection

**Allowed redirection URL(s) :**
```
https://votre-domaine.com/api/shopify/callback
http://localhost:3000/api/shopify/callback (pour dev)
```

### 2.4 Récupérer les credentials

Notez ces valeurs :
- **Client ID** (API key)
- **Client Secret** (API secret key)

---

## 🔧 ÉTAPE 3 : Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```bash
# Shopify OAuth
NEXT_PUBLIC_SHOPIFY_CLIENT_ID=votre_client_id_ici
SHOPIFY_CLIENT_SECRET=votre_client_secret_ici

# Supabase (déjà configuré normalement)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

⚠️ **Important** : Ne commitez JAMAIS le `SHOPIFY_CLIENT_SECRET` dans Git !

---

## 🚀 ÉTAPE 4 : Déployer l'Edge Function

### 4.1 Installer Supabase CLI

```bash
npm install -g supabase
```

### 4.2 Se connecter à Supabase

```bash
supabase login
```

### 4.3 Lier votre projet

```bash
supabase link --project-ref VOTRE_PROJECT_REF
```

Trouvez votre `PROJECT_REF` dans l'URL de votre dashboard Supabase :
`https://app.supabase.com/project/[PROJECT_REF]`

### 4.4 Déployer la fonction

```bash
supabase functions deploy scrape-shopify-product
```

### 4.5 Vérifier le déploiement

```bash
supabase functions list
```

Vous devriez voir `scrape-shopify-product` dans la liste.

---

## 🎨 ÉTAPE 5 : Intégration dans le dashboard

### 5.1 Scrapify est déjà intégré ! ✅

Scrapify a été automatiquement ajouté à la section **Outils** de votre dashboard AdsPilot.

**Modifications déjà effectuées dans `app/page.js` :**

1. **Import du composant** :
```javascript
import ScrapifyView from '@/components/ScrapifyView';
import { Package } from 'lucide-react';
```

2. **Ajout dans TOOLS_ITEMS** :
```javascript
const TOOLS_ITEMS = [
  { icon: FolderOpen, label: 'AfriVault', path: '#/afrivault', badge: 'PRO', count: 523 },
  { icon: Search, label: 'AdScout', path: '#/adscout' },
  { icon: Package, label: 'Scrapify', path: '#/scrapify' }, // ✅ Nouveau
  { icon: Play, label: 'Guides', path: '#/guides' },
];
```

3. **Route ajoutée** :
```javascript
case '#/scrapify': return <ScrapifyView supabase={supabase} user={user} />;
```

4. **Configuration du header** :
```javascript
'#/scrapify': { title: 'Scrapify', subtitle: 'Importe des produits Shopify concurrents', showDatePicker: false },
```

### 5.2 Accès à Scrapify

Une fois connecté à votre dashboard :
1. Regardez la sidebar gauche
2. Section **"Outils"**
3. Cliquez sur **📦 Scrapify**

Vous y trouverez directement l'interface complète de scraping !

---

## 🧪 ÉTAPE 6 : Tester le module

### 6.1 Test de scraping

1. Démarrez votre application : `npm run dev`
2. Connectez-vous à votre compte
3. Dans la sidebar, section **Outils**, cliquez sur **📦 Scrapify** (ou allez sur `#/scrapify`)
4. Testez avec cette URL exemple :
   ```
   https://demo.myshopify.com/products/example-product
   ```

### 6.2 Test de connexion OAuth

1. Cliquez sur **"Connecter une boutique"**
2. Entrez votre domaine Shopify : `ma-boutique.myshopify.com`
3. Cliquez sur **"Connecter via OAuth"**
4. Autorisez l'application sur Shopify
5. Vous devriez être redirigé vers `/scrapify?success=store_connected`

### 6.3 Test de publication

1. Scrapez un produit
2. Cliquez sur **"Modifier"**
3. Modifiez les champs si nécessaire
4. Sélectionnez une boutique connectée
5. Cliquez sur **"Publier sur Shopify"**
6. Vérifiez dans votre admin Shopify que le produit a été créé

---

## 🔒 ÉTAPE 7 : Sécurité (IMPORTANT)

### 7.1 Chiffrement des tokens (Recommandé)

Les `access_token` Shopify sont actuellement stockés en clair. Pour les chiffrer :

1. Activez `pgcrypto` dans Supabase :
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

2. Définissez une clé de chiffrement :
```sql
ALTER DATABASE postgres SET app.encryption_key = 'votre-clé-secrète-très-longue';
```

3. Modifiez l'insertion dans `app/api/shopify/callback/route.js` :
```javascript
access_token: `pgp_sym_encrypt('${access_token}', current_setting('app.encryption_key'))`
```

### 7.2 Vérification HMAC

Dans `app/api/shopify/callback/route.js`, décommentez :
```javascript
const isValid = verifyShopifyHmac(searchParams, process.env.SHOPIFY_CLIENT_SECRET);
if (!isValid) {
  return NextResponse.redirect(new URL('/scrapify?error=invalid_hmac', request.url));
}
```

---

## 📊 ÉTAPE 8 : Monitoring et logs

### 8.1 Logs Edge Function

```bash
supabase functions logs scrape-shopify-product
```

### 8.2 Vérifier les erreurs

```sql
SELECT * FROM scraped_products WHERE status = 'failed' ORDER BY created_at DESC LIMIT 10;
```

### 8.3 Statistiques

```sql
SELECT * FROM get_scrapify_stats('user-uuid-ici');
```

---

## 🐛 Dépannage

### Problème : "Missing authorization header"
**Solution** : Vérifiez que l'utilisateur est bien connecté et que le token Supabase est valide.

### Problème : "Failed to fetch product"
**Solution** : 
- Vérifiez que l'URL est bien un produit Shopify public
- Certaines boutiques bloquent le scraping (utilisez un User-Agent)

### Problème : "Session expired" lors de l'OAuth
**Solution** : 
- Passez le `user_id` via le paramètre `state` dans l'URL OAuth
- Ou utilisez un système de tokens temporaires

### Problème : Edge Function timeout
**Solution** : 
- Augmentez le timeout dans les settings Supabase
- Optimisez les requêtes (évitez les images trop lourdes)

---

## 🎯 Prochaines améliorations

- [ ] Scraping de collections entières
- [ ] Import de reviews/avis clients
- [ ] Ajustement automatique des prix (+X%)
- [ ] Traduction automatique des descriptions
- [ ] Watermark sur les images
- [ ] Planification d'imports récurrents
- [ ] Export CSV des produits scrapés

---

## 📚 Ressources

- [Shopify Admin API](https://shopify.dev/docs/api/admin-rest)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Shopify OAuth](https://shopify.dev/docs/apps/auth/oauth)

---

**✅ Installation terminée !** Votre module Scrapify est prêt à l'emploi.
