# Sécurité Multi-Utilisateurs - Easy-Ecom SaaS

Ce document explique comment l'application Easy-Ecom garantit l'isolation des données entre utilisateurs et la sécurité multi-tenant.

## Architecture d'authentification

### Supabase Auth
L'application utilise Supabase pour l'authentification des utilisateurs :
- Authentification par email/mot de passe
- Tokens JWT pour les sessions
- Gestion automatique des refresh tokens
- Métadonnées utilisateur (nom, email, etc.)

### Vérification côté serveur
Chaque requête API est sécurisée via la fonction `getAuthUser()` :

```javascript
async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];

  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return user;
}
```

## Isolation des données

### Principe de base
Toutes les données sont filtrées par `user_id` qui correspond à l'ID unique Supabase de l'utilisateur.

### Collections MongoDB et isolation

#### 1. **Templates sauvegardés** (`saved_templates`)
```javascript
// Lecture - seulement les templates de l'utilisateur connecté
const saved = await db.collection('saved_templates')
  .find({ user_id: user.id })
  .toArray();

// Écriture - associe automatiquement à l'utilisateur
await db.collection('saved_templates').insertOne({
  user_id: user.id,
  template_id,
  saved_at: new Date().toISOString()
});
```

#### 2. **Boutiques connectées** (`stores`)
```javascript
// Lecture - seulement la boutique de l'utilisateur
const store = await db.collection('stores')
  .findOne({ user_id: user.id, is_active: true });

// Mise à jour - filtre par user_id
await db.collection('stores').updateOne(
  { user_id: user.id },
  { $set: { ... } }
);
```

#### 3. **Profils utilisateurs** (`profiles`)
```javascript
// Lecture du profil
const profile = await db.collection('profiles')
  .findOne({ user_id: user.id });

// Mise à jour du profil
await db.collection('profiles').updateOne(
  { user_id: user.id },
  { $set: { ...profileData }, $setOnInsert: { user_id: user.id } },
  { upsert: true }
);
```

#### 4. **Connexions Meta** (`meta_connections`)
```javascript
// Lecture de la connexion Meta
const connection = await db.collection('meta_connections')
  .findOne({ user_id: user.id });

// Suppression de la connexion
await db.collection('meta_connections')
  .deleteOne({ user_id: user.id });
```

## Routes API sécurisées

### Vérification systématique
Toutes les routes protégées vérifient l'authentification :

```javascript
const user = await getAuthUser(request);
if (!user) {
  return NextResponse.json(
    { error: 'Non autorisé' },
    { status: 401, headers: corsHeaders() }
  );
}
```

### Routes protégées actuelles
- `GET /api/templates/saved` - Templates sauvegardés de l'utilisateur
- `POST /api/templates/save` - Sauvegarder un template
- `GET /api/store` - Boutique connectée de l'utilisateur
- `POST /api/shopify/connect` - Connecter une boutique Shopify
- `POST /api/store/disconnect` - Déconnecter la boutique
- `GET /api/profile` - Profil utilisateur
- `POST /api/profile` - Mettre à jour le profil
- `GET /api/meta/connection` - Connexion Meta de l'utilisateur
- `POST /api/meta/auth` - Initier la connexion Meta
- `DELETE /api/meta/connection` - Déconnecter Meta

### Routes publiques
- `GET /api/templates` - Liste des templates (publique, pas de données utilisateur)
- `GET /api/health` - Health check

## Flux d'authentification

### 1. Connexion utilisateur
```
Client → Supabase Auth → Obtient JWT token
Client → Stocke token localement
Client → Envoie token dans Authorization header pour chaque requête API
```

### 2. Requête API authentifiée
```
Client → Envoie: Authorization: Bearer <token>
API → Vérifie token via getAuthUser()
API → Extrait user.id
API → Filtre données par user_id
API → Retourne seulement les données de l'utilisateur
```

### 3. OAuth (Meta/Facebook)
```
Client → POST /api/meta/auth
API → Crée state unique lié à user.id
API → Redirige vers Facebook
Facebook → Callback avec code
API → Vérifie state → Récupère user_id
API → Stocke connection avec user_id
```

## Bonnes pratiques implémentées

### ✅ Authentification obligatoire
- Chaque route protégée vérifie le token
- Retour 401 si non authentifié
- Pas de données exposées sans auth

### ✅ Filtrage strict par user_id
- Toutes les requêtes DB filtrent par user_id
- Impossible d'accéder aux données d'un autre utilisateur
- Les requêtes update/delete incluent user_id dans le filtre

### ✅ Validation côté serveur
- L'user_id provient du token JWT vérifié côté serveur
- Pas de confiance aux données envoyées par le client
- Validation Supabase du token à chaque requête

### ✅ Upsert sécurisé
```javascript
await db.collection('profiles').updateOne(
  { user_id: user.id }, // Filtre par user_id
  {
    $set: { ...data },
    $setOnInsert: { user_id: user.id } // Force user_id à la création
  },
  { upsert: true }
);
```

### ✅ Suppression de données sensibles
```javascript
// Ne jamais exposer les tokens
const { access_token, ...safeConnection } = connection;
return NextResponse.json({ connection: safeConnection });
```

## Tests de sécurité recommandés

### 1. Test d'isolation utilisateur
```bash
# Créer 2 comptes différents
# Utilisateur A sauvegarde un template
# Utilisateur B ne doit PAS voir ce template dans /api/templates/saved
```

### 2. Test de manipulation de token
```bash
# Essayer d'envoyer un token invalide
# Essayer d'envoyer un token d'un autre utilisateur
# Vérifier que l'API retourne 401
```

### 3. Test de requête directe DB
```bash
# Vérifier que toutes les requêtes incluent user_id
# Vérifier qu'aucune requête n'utilise un ID passé par le client
```

## Points de vigilance

### ⚠️ Ne jamais faire confiance au client
```javascript
// ❌ MAUVAIS - user_id vient du client
const { user_id, template_id } = await request.json();
await db.collection('saved_templates').find({ user_id });

// ✅ BON - user_id vient du token vérifié
const user = await getAuthUser(request);
await db.collection('saved_templates').find({ user_id: user.id });
```

### ⚠️ Toujours filtrer par user_id
```javascript
// ❌ MAUVAIS - peut modifier n'importe quelle boutique
await db.collection('stores').updateOne(
  { store_id: storeId },
  { $set: { ... } }
);

// ✅ BON - peut seulement modifier SA boutique
await db.collection('stores').updateOne(
  { store_id: storeId, user_id: user.id },
  { $set: { ... } }
);
```

### ⚠️ Sécuriser les callbacks OAuth
```javascript
// Vérifier le state pour éviter CSRF
const oauthState = await db.collection('oauth_states')
  .findOne({ state, provider: 'meta' });

if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
  return redirect('?error=invalid_state');
}

// Utiliser le user_id du state, pas du callback
const userId = oauthState.user_id;
```

## Conformité RGPD

### Données stockées par utilisateur
- Profil : nom, email, nom de l'entreprise, niche
- Templates sauvegardés : liste des template_id
- Boutique : URL Shopify, access token (chiffré recommandé)
- Connexion Meta : access token, meta_user_id, nom, email

### Suppression de compte
Pour implémenter la suppression de compte RGPD :

```javascript
async function deleteUserData(userId) {
  const db = await getDb();

  // Supprimer toutes les données utilisateur
  await db.collection('profiles').deleteMany({ user_id: userId });
  await db.collection('saved_templates').deleteMany({ user_id: userId });
  await db.collection('stores').deleteMany({ user_id: userId });
  await db.collection('meta_connections').deleteMany({ user_id: userId });
  await db.collection('oauth_states').deleteMany({ user_id: userId });

  // Supprimer le compte Supabase
  const supabase = getSupabaseAdmin();
  await supabase.auth.admin.deleteUser(userId);
}
```

## Conclusion

L'application Easy-Ecom est conçue pour être un SaaS multi-utilisateurs sécurisé :

✅ **Authentification robuste** via Supabase
✅ **Isolation stricte** des données par user_id
✅ **Validation côté serveur** de tous les tokens
✅ **Pas de confiance client** - user_id toujours depuis le token
✅ **OAuth sécurisé** avec vérification de state

Toutes les routes API sont protégées et ne retournent que les données appartenant à l'utilisateur authentifié.
