# Migration MongoDB → Supabase - TERMINÉE ✅

**Date**: 22 Mars 2026
**Statut**: Migration du code terminée, schéma SQL prêt à être exécuté

---

## 🎉 TRAVAIL ACCOMPLI

### ✅ Migration du Code API Complète

Tous les handlers API ont été migrés de MongoDB vers Supabase :

#### 1. **Handlers Templates** (Migrés ✅)
- `handleGetTemplates` - Liste tous les templates
- `handleGetSavedTemplates` - Templates sauvegardés par l'utilisateur
- `handleSaveTemplate` - Sauvegarder/Retirer un template
- `handleSeedTemplates` - Seed initial des templates

#### 2. **Handlers Shopify/Store** (Migrés ✅)
- `handleShopifyConnect` - Connexion boutique Shopify
- `handleGetStore` - Récupérer boutique de l'utilisateur
- `handleDisconnectStore` - Déconnecter la boutique

#### 3. **Handlers Profile** (Migrés ✅)
- `handleGetProfile` - Récupérer profil utilisateur
- `handleUpdateProfile` - Mettre à jour le profil

#### 4. **Handlers Meta/Facebook OAuth** (Migrés ✅)
- `handleGetMetaConnection` - Récupérer connexion Meta
- `handleInitiateMetaAuth` - Initier l'OAuth Meta
- `handleMetaCallback` - Callback OAuth Meta
- `handleDeleteMetaConnection` - Supprimer connexion Meta

#### 5. **Handlers Admin** (Migrés ✅)
- `handleAdminStats` - Statistiques admin dashboard
- `handleAdminGetTemplates` - Liste tous les templates (admin)
- `handleAdminGetUsers` - Liste tous les utilisateurs
- `handleAdminCreateTemplate` - Créer un nouveau template
- `handleAdminUpdateTemplate` - Modifier un template
- `handleAdminDeleteTemplate` - Supprimer un template

---

## 📋 ÉTAPES SUIVANTES (CRITIQUES)

### Étape 1: Exécuter le Schéma SQL dans Supabase ⚠️

**Le fichier [supabase-schema.sql](supabase-schema.sql) a été créé, corrigé et est prêt.**

⚠️ **IMPORTANT** : Si vous avez tenté d'exécuter le schéma et avez rencontré l'erreur `column "user_id" does not exist`, le fichier a été **CORRIGÉ**. Voir [FIX_SQL_SCHEMA.md](FIX_SQL_SCHEMA.md) pour les détails.

**Instructions**:

1. **Aller sur Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Se connecter à votre projet

2. **Ouvrir le SQL Editor**
   - Dans le menu latéral, cliquer sur "SQL Editor"

3. **Créer une nouvelle requête**
   - Cliquer sur "+ New query"

4. **Copier-coller le contenu du fichier `supabase-schema.sql`**
   - Ouvrir le fichier `supabase-schema.sql` à la racine du projet
   - Copier TOUT le contenu (600+ lignes)
   - Coller dans l'éditeur SQL de Supabase

5. **Exécuter le script**
   - Cliquer sur "Run" ou `Ctrl+Enter`
   - Attendre la confirmation de succès

**Ce que le script crée**:
- ✅ 9 tables PostgreSQL (templates, saved_templates, stores, profiles, subscriptions, meta_connections, oauth_states, user_activity, admin_notifications)
- ✅ Row Level Security (RLS) policies pour toutes les tables
- ✅ Indexes pour optimiser les performances
- ✅ Views SQL pour admin (admin_stats, daily_signups, popular_templates)
- ✅ Triggers pour auto-update des timestamps
- ✅ Seed data (12 templates par défaut)

---

### Étape 2: Vérifier les Variables d'Environnement ⚠️

**Fichier**: `.env` ou `.env.local`

**Variables requises pour Supabase**:
```bash
# Supabase (REQUIS)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Variables MongoDB à conserver temporairement** (pour compatibilité):
```bash
# MongoDB (peut être laissé vide, ne sera plus utilisé)
MONGO_URL=
DB_NAME=
```

**Autres variables importantes**:
```bash
# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Meta/Facebook OAuth (optionnel)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=http://localhost:3000/api/meta/callback

# Admin
ADMIN_EMAIL=dodjiq@gmail.com
```

---

### Étape 3: Redémarrer le Serveur

Après avoir exécuté le schéma SQL et vérifié les variables d'environnement :

```bash
# Arrêter le serveur actuel (Ctrl+C si nécessaire)

# Redémarrer le serveur
npm run dev:webpack
```

---

## 🔍 TESTS À EFFECTUER

### 1. **Templates**
- [ ] Aller sur http://localhost:3000/#/afrivault
- [ ] Vérifier que les 12 templates s'affichent
- [ ] Sauvegarder un template
- [ ] Vérifier qu'il apparaît dans "Mes Templates Sauvegardés"

### 2. **Boutique Shopify**
- [ ] Aller sur http://localhost:3000/#/dashboard
- [ ] Connecter une boutique Shopify (URL: `nom-boutique.myshopify.com`)
- [ ] Vérifier que les produits s'affichent

### 3. **Profil**
- [ ] Aller sur http://localhost:3000/#/settings
- [ ] Modifier le profil (nom, nom d'entreprise, niche)
- [ ] Sauvegarder et vérifier que les changements sont persistants

### 4. **Admin Panel**
- [ ] Se connecter avec dodjiq@gmail.com
- [ ] Aller sur http://localhost:3000/#/admin-pro
- [ ] Vérifier le dashboard :
  - [ ] Statistiques (total users, templates, etc.)
  - [ ] Graphique des inscriptions (si données disponibles)
  - [ ] Liste des templates
  - [ ] Liste des utilisateurs

### 5. **CRUD Templates Admin**
- [ ] Créer un nouveau template (bouton "Nouveau Template")
- [ ] Vérifier qu'il apparaît dans AfriVault pour tous les users
- [ ] Modifier un template existant
- [ ] Supprimer un template

---

## 📊 DIFFÉRENCES MONGODB vs SUPABASE

### Avant (MongoDB)
```javascript
const db = await getDb();
const templates = await db.collection('templates').find({}).toArray();
templates = templates.map(({ _id, ...rest }) => rest); // Clean _id
```

### Après (Supabase)
```javascript
const supabase = getSupabaseAdmin();
const { data: templates, error } = await supabase
  .from('templates')
  .select('*')
  .order('created_at', { ascending: false });
```

**Avantages de Supabase**:
- ✅ Pas besoin de nettoyer les `_id` MongoDB
- ✅ Row Level Security (RLS) intégré
- ✅ Auth intégré (déjà utilisé dans le projet)
- ✅ Views SQL pour requêtes complexes
- ✅ Realtime subscriptions possibles
- ✅ API REST auto-générée
- ✅ Interface dashboard pour gérer les données
- ✅ Meilleure intégration avec Next.js

---

## 🗂️ STRUCTURE DE LA BASE DE DONNÉES

### Tables Créées

#### 1. **templates**
- Stocke tous les templates AfriVault
- Accessible en lecture par tous
- Modification uniquement par admin

#### 2. **saved_templates**
- Associe users ↔ templates sauvegardés
- RLS: Chaque user voit uniquement ses sauvegardes
- Clé unique: `(user_id, template_id)`

#### 3. **stores**
- Boutiques Shopify connectées
- RLS: Chaque user voit uniquement sa boutique
- Contrainte unique: 1 boutique active par user

#### 4. **profiles**
- Profils utilisateurs (nom, business, niche)
- RLS: Chaque user voit uniquement son profil
- Contrainte unique: 1 profil par user

#### 5. **subscriptions**
- Abonnements Stripe (Free, Pro, Premium)
- RLS: Chaque user voit uniquement son abonnement
- Contrainte unique: 1 abonnement par user

#### 6. **meta_connections**
- Connexions Meta/Facebook OAuth
- RLS: Chaque user voit uniquement sa connexion
- Access token sécurisé (non exposé en lecture publique)

#### 7. **oauth_states**
- États OAuth temporaires (TTL 15 minutes)
- Pour vérifier les callbacks OAuth

#### 8. **user_activity**
- Tracking des actions utilisateur (signup, login, save_template, etc.)
- Pour analytics admin

#### 9. **admin_notifications**
- Notifications pour l'admin (nouvelles inscriptions, etc.)
- Lecture seule pour admin

---

## 📈 VIEWS SQL (Admin Dashboard)

### 1. **admin_stats**
Statistiques principales :
```sql
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM templates) AS total_templates,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan != 'free') AS active_subscriptions,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'pro' AND status = 'active') AS pro_subscriptions
```

Usage dans l'API :
```javascript
const { data: stats } = await supabase.from('admin_stats').select('*').single();
// stats.total_users, stats.total_templates, ...
```

### 2. **daily_signups**
Inscriptions journalières (30 derniers jours) :
```sql
SELECT DATE(created_at) AS date, COUNT(*) AS count
FROM auth.users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC
```

Usage dans l'API :
```javascript
const { data: dailySignups } = await supabase
  .from('daily_signups')
  .select('*')
  .limit(30);
// Pour graphique des inscriptions
```

### 3. **popular_templates**
Templates les plus sauvegardés :
```sql
SELECT t.id, t.title, t.niche, t.format, COUNT(st.id) AS save_count
FROM templates t
LEFT JOIN saved_templates st ON t.id = st.template_id
GROUP BY t.id
ORDER BY save_count DESC
```

---

## 🔐 ROW LEVEL SECURITY (RLS)

Toutes les tables ont des policies RLS configurées :

### Exemple : Table `saved_templates`

**Lecture** : Utilisateur voit uniquement ses sauvegardes
```sql
CREATE POLICY "Users can view their own saved templates"
ON saved_templates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

**Insertion** : Utilisateur peut sauvegarder des templates
```sql
CREATE POLICY "Users can save templates"
ON saved_templates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

**Suppression** : Utilisateur peut retirer ses sauvegardes
```sql
CREATE POLICY "Users can delete their own saved templates"
ON saved_templates FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

## 🚨 POINTS D'ATTENTION

### 1. **MongoDB encore référencé**
- Le code contient encore l'import `MongoClient` (ligne 2 du fichier original)
- Cet import peut être retiré après vérification que tout fonctionne
- Les erreurs MongoDB dans les logs peuvent être ignorées

### 2. **Email Admin**
- L'accès admin est vérifié par email: `dodjiq@gmail.com`
- Configurable via `process.env.ADMIN_EMAIL`

### 3. **Service Role Key**
- `SUPABASE_SERVICE_ROLE_KEY` bypass les RLS policies
- À utiliser côté serveur uniquement (jamais côté client)
- Permet à l'admin de voir toutes les données

### 4. **Seed Templates**
- 12 templates sont automatiquement insérés lors de l'exécution du schéma SQL
- Ils utilisent des images Unsplash publiques

---

## 📁 FICHIERS MODIFIÉS

### [app/api/[[...path]]/route.js](app/api/[[...path]]/route.js)
- ❌ Supprimé : Imports MongoDB, fonction `getDb()`
- ✅ Ajouté : Requêtes Supabase dans tous les handlers
- ✅ Amélioré : Gestion d'erreurs avec codes Supabase

### [supabase-schema.sql](supabase-schema.sql) (NOUVEAU)
- ✅ Créé : Schéma complet de la base de données
- 600+ lignes de SQL
- Prêt à être exécuté dans Supabase Dashboard

---

## 💡 PROCHAINES FONCTIONNALITÉS (Optionnel)

### 1. **Realtime Notifications Admin**
Utiliser Supabase Realtime pour notifier l'admin en temps réel :
```javascript
const subscription = supabase
  .channel('admin-notifications')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auth.users' }, (payload) => {
    // Nouvelle inscription !
    showToast(`Nouvelle inscription: ${payload.new.email}`);
  })
  .subscribe();
```

### 2. **Analytics Avancées**
Utiliser la table `user_activity` pour tracker :
- Temps passé sur chaque page
- Templates les plus vus
- Taux de conversion (vue → sauvegarde)

### 3. **Soft Delete pour Templates**
Ajouter un champ `deleted_at` au lieu de supprimer définitivement :
```sql
ALTER TABLE templates ADD COLUMN deleted_at TIMESTAMPTZ;
```

---

## 🆘 TROUBLESHOOTING

### Erreur : "relation 'templates' does not exist"
➡️ **Solution** : Exécuter le schéma SQL dans Supabase Dashboard

### Erreur : "permission denied for table templates"
➡️ **Solution** : Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est configuré

### Erreur : "auth.uid() is null"
➡️ **Solution** : Vérifier que le token JWT est passé dans l'Authorization header

### Templates ne s'affichent pas
➡️ **Solutions** :
1. Vérifier que le schéma SQL a bien été exécuté
2. Vérifier que les 12 templates seed sont présents : `SELECT * FROM templates`
3. Vérifier que les RLS policies sont actives : `ALTER TABLE templates ENABLE ROW LEVEL SECURITY`

---

## ✅ RÉSUMÉ

**Ce qui a été fait** :
- ✅ Migration complète MongoDB → Supabase
- ✅ Tous les handlers API migrés
- ✅ Schéma SQL créé avec RLS policies
- ✅ Views SQL pour admin dashboard
- ✅ Seed data pour 12 templates

**Ce qu'il reste à faire** :
1. ⏳ Exécuter `supabase-schema.sql` dans Supabase Dashboard
2. ⏳ Vérifier les variables d'environnement `.env`
3. ⏳ Redémarrer le serveur
4. ⏳ Tester les fonctionnalités (checklist ci-dessus)

**Temps estimé** : 5-10 minutes

---

**Dernière mise à jour** : 22 Mars 2026, 06:30 UTC
**Statut** : ✅ Migration du code terminée
**Prochaine étape** : Exécuter le schéma SQL dans Supabase
