# Panneau d'Administration Easy-Ecom

Ce document explique comment fonctionne le panneau d'administration de la plateforme Easy-Ecom, accessible uniquement aux administrateurs.

## Accès au panneau admin

### URL d'accès
`http://localhost:3000/#/admin-pro`

### Contrôle d'accès
L'accès est restreint aux utilisateurs suivants :
- Email : `dodjiq@gmail.com`
- OU utilisateurs avec `role: 'admin'` dans leurs métadonnées Supabase

### Vérification côté client
```javascript
const isAdmin = user?.email === 'dodjiq@gmail.com' || user?.user_metadata?.role === 'admin';

if (!isAdmin) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-gray-400">Vous n'avez pas les permissions nécessaires.</p>
      </div>
    </div>
  );
}
```

### Vérification côté serveur
Tous les endpoints admin vérifient l'authentification :
```javascript
const user = await getAuthUser(request);
if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
}
```

## Structure du panneau admin

### 1. Dashboard (Vue d'ensemble)
**Route** : `#/admin-pro`

Affiche 4 statistiques principales :
- **Total Users** : Nombre total d'utilisateurs Supabase
- **Templates** : Nombre de templates dans la base MongoDB
- **Active Subscriptions** : Nombre de boutiques + connexions Meta actives
- **Monthly Revenue** : Revenus mensuels (placeholder pour Stripe)

**API Endpoint** : `GET /api/admin/stats`

**Réponse** :
```json
{
  "totalUsers": 42,
  "totalTemplates": 12,
  "activeSubscriptions": 15,
  "monthlyRevenue": 0
}
```

### 2. Templates (Gestion des templates)
**Route** : `#/admin-pro` (onglet Templates)

Fonctionnalités :
- Affichage en grille de tous les templates
- Bouton "Nouveau Template" pour créer un template
- Boutons "Modifier" et "Supprimer" sur chaque template
- Badges pour les niches et formats
- Badge "Premium" pour les templates premium

**API Endpoints** :

#### Lister tous les templates
```
GET /api/admin/templates
```

**Réponse** :
```json
{
  "templates": [
    {
      "id": "t1",
      "title": "Glow naturel",
      "description": "Template testimonial pour produits éclaircissants",
      "niche": "beaute",
      "format": "carre",
      "preview_url": "https://...",
      "tags": ["testimonial", "skincare"],
      "is_premium": false
    }
  ]
}
```

#### Créer un template
```
POST /api/admin/templates
```

**Body** :
```json
{
  "title": "Mon Template",
  "description": "Description du template",
  "niche": "beaute",
  "format": "carre",
  "tags": ["promo", "flash"],
  "is_premium": false,
  "preview_url": "https://..."
}
```

**Réponse** :
```json
{
  "success": true,
  "template": { ... }
}
```

#### Modifier un template
```
PUT /api/admin/templates/:id
```

**Body** (tous les champs sont optionnels) :
```json
{
  "title": "Nouveau titre",
  "is_premium": true
}
```

#### Supprimer un template
```
DELETE /api/admin/templates/:id
```

**Réponse** :
```json
{
  "success": true
}
```

**Note** : La suppression d'un template supprime aussi toutes les entrées `saved_templates` liées.

### 3. Utilisateurs (Gestion des utilisateurs)
**Route** : `#/admin-pro` (onglet Utilisateurs)

Affiche un tableau avec :
- Photo de profil + nom complet
- Email
- Statut (Actif / Email non vérifié)
- Date d'inscription
- Actions (Voir détails, Suspendre, Supprimer)

**API Endpoint** : `GET /api/admin/users`

**Réponse** :
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z",
      "last_sign_in_at": "2024-03-20T14:22:00Z",
      "email_confirmed": true,
      "role": "user"
    }
  ]
}
```

### 4. Abonnements (Gestion des abonnements)
**Route** : `#/admin-pro` (onglet Abonnements)

**Statut** : Placeholder - en attente de l'intégration Stripe

Fonctionnalités prévues :
- Liste des abonnements actifs
- Détails des paiements
- Gestion des plans (Free, Pro, Premium)
- Annulation / Remboursement

### 5. Paramètres (Configuration plateforme)
**Route** : `#/admin-pro` (onglet Paramètres)

Options de configuration :
- Nom de la plateforme
- Email administrateur
- Configuration SMTP (à venir)
- Webhooks (à venir)

## Collections MongoDB utilisées

### `templates`
```javascript
{
  id: string,              // Identifiant unique (t1, t2, etc.)
  title: string,           // Titre du template
  description: string,     // Description
  niche: string,           // beaute, mode, food, electronique, maison
  format: string,          // carre, story, landscape
  canva_template_id: string, // ID du template Canva
  preview_url: string,     // URL de l'image de prévisualisation
  tags: string[],          // Tags pour filtrage
  is_premium: boolean,     // Template premium ou gratuit
  created_at: string,      // Date de création (ISO)
  updated_at: string       // Date de mise à jour (ISO) - optionnel
}
```

### Supabase Auth
Les utilisateurs sont gérés via Supabase Auth Admin API :
```javascript
const supabase = getSupabaseAdmin();
const { data: usersData } = await supabase.auth.admin.listUsers();
```

## Sécurité

### Isolation des données
- Les endpoints admin ne sont PAS filtrés par `user_id`
- Ils retournent TOUTES les données (templates de tous les utilisateurs, tous les profils, etc.)
- C'est pourquoi la vérification admin est **critique**

### Double vérification
1. **Frontend** : Masque l'interface pour les non-admins
2. **Backend** : Refuse les requêtes API pour les non-admins (403 Forbidden)

### Token JWT
Toutes les requêtes admin doivent inclure le token Supabase dans les headers :
```javascript
headers: {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json'
}
```

## UI/UX

### Design System
- **Sidebar admin** : Fond noir avec logo doré
- **Header** : Titre de la section + avatar admin
- **Cards** : Fond `#0F0F14` avec bordures `#1F1F28`
- **Couleurs** :
  - Texte principal : `#F9FAFB`
  - Texte secondaire : `#9CA3AF`
  - Accent : `#D4AF37` (doré)
  - Danger : `#EF4444` (rouge)

### Menu items
```javascript
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'templates', label: 'Templates', icon: Palette },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];
```

### Navigation
- Click sur un item du menu → Change l'onglet actif
- Highlight doré pour l'item actif
- Bouton "Déconnexion" en bas de la sidebar

## Prochaines fonctionnalités

### Templates
- [ ] Modal de création/édition de template avec formulaire complet
- [ ] Upload d'images pour preview_url
- [ ] Duplication de templates
- [ ] Import/Export de templates en masse
- [ ] Statistiques par template (nombre de sauvegardes, utilisation)

### Utilisateurs
- [ ] Modal de détails utilisateur avec stats
- [ ] Suspension de compte
- [ ] Suppression de compte (RGPD)
- [ ] Modification du rôle (user → admin)
- [ ] Envoi d'email manuel
- [ ] Filtres et recherche

### Abonnements
- [ ] Intégration Stripe Webhooks
- [ ] Dashboard des revenus avec graphiques
- [ ] Gestion des plans tarifaires
- [ ] Remboursements
- [ ] Codes promo / Coupons

### Analytics
- [ ] Graphiques d'évolution (utilisateurs, revenus)
- [ ] Templates les plus populaires
- [ ] Taux de conversion
- [ ] Retention utilisateurs

### Paramètres
- [ ] Configuration SMTP pour emails
- [ ] Webhooks personnalisés
- [ ] Variables d'environnement via UI
- [ ] Logs système
- [ ] Backups MongoDB automatiques

## Tests recommandés

### Test 1 : Accès refusé pour utilisateur standard
```bash
# Se connecter avec un compte non-admin
# Aller sur #/admin-pro
# Vérifier l'affichage du message "Accès refusé"
```

### Test 2 : Accès admin autorisé
```bash
# Se connecter avec dodjiq@gmail.com
# Aller sur #/admin-pro
# Vérifier l'affichage du panneau admin
```

### Test 3 : API protégée
```bash
# Essayer d'appeler GET /api/admin/stats avec un token non-admin
# Vérifier la réponse 403 Forbidden
```

### Test 4 : CRUD Templates
```bash
# Créer un nouveau template
# Modifier un template existant
# Supprimer un template
# Vérifier que les changements sont reflétés dans l'app user
```

## Commandes utiles

### Lancer le serveur
```bash
npm run dev:webpack
```

### Accéder au panneau admin
```
http://localhost:3000/#/admin-pro
```

### Se connecter en tant qu'admin
Email : `dodjiq@gmail.com`
Mot de passe : (celui configuré dans Supabase)

### Vérifier les logs API
Les logs admin incluent des préfixes pour faciliter le debug :
```
Admin stats error: ...
Admin get templates error: ...
Admin delete template error: ...
```

## Conclusion

Le panneau d'administration est maintenant **fonctionnel** avec :
- ✅ Contrôle d'accès strict (frontend + backend)
- ✅ Dashboard avec statistiques
- ✅ Gestion CRUD complète des templates
- ✅ Liste des utilisateurs Supabase
- ✅ Structure pour abonnements et paramètres
- ✅ API sécurisées avec vérification admin
- ✅ UI cohérente avec le design de l'app

Toutes les bases sont en place pour étendre les fonctionnalités admin selon les besoins !
