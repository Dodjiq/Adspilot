# 👑 GUIDE ADMINISTRATION - ADSPILOT

## 🎯 Promouvoir un utilisateur en Admin

### Méthode 1 : Via Supabase Dashboard (Recommandé)

1. **Connexion à Supabase**
   - Va sur https://supabase.com/dashboard
   - Sélectionne ton projet AdsPilot

2. **Accéder aux utilisateurs**
   - Menu latéral → **Authentication**
   - Onglet **Users**

3. **Trouver l'utilisateur**
   - Cherche l'email de l'utilisateur
   - Clique sur l'utilisateur

4. **Modifier le rôle**
   - Scroll jusqu'à **User Metadata**
   - Clique sur **Edit**
   - Ajoute ou modifie :
   ```json
   {
     "role": "admin"
   }
   ```
   - Clique **Save**

5. **Vérification**
   - L'utilisateur peut maintenant accéder à :
   - `https://ads-pilot.app/#/admin-pro/dashboard`

---

### Méthode 2 : Via Script (Automatisé)

#### Lister tous les utilisateurs
```bash
node scripts/list-users.js
```

Affiche :
- Liste complète des utilisateurs
- Rôles actuels
- Dates de création et dernière connexion
- Statistiques

#### Promouvoir un utilisateur
```bash
node scripts/promote-admin.js EMAIL
```

Exemple :
```bash
node scripts/promote-admin.js dodjiq@gmail.com
```

---

## 🔐 Rôles disponibles

### 1. **user** (Standard)
- Accès au dashboard utilisateur
- Templates limités (plan gratuit)
- Pas d'accès admin

### 2. **pro** (Plan Pro)
- Accès complet aux templates
- Analytics avancés
- Support prioritaire
- Pas d'accès admin

### 3. **admin** (Administrateur)
- Accès au panel admin (`/#/admin-pro/dashboard`)
- Gestion des utilisateurs
- Gestion des templates
- Gestion des tickets
- Gestion des annonces
- Statistiques complètes

---

## 🛠️ SCRIPTS DISPONIBLES

### 1. `list-users.js` - Lister les utilisateurs

**Usage** :
```bash
node scripts/list-users.js
```

**Affiche** :
- Email de chaque utilisateur
- ID unique
- Rôle actuel
- Date de création
- Dernière connexion
- Statut de confirmation email

**Exemple de sortie** :
```
👥 Liste des utilisateurs AdsPilot

📊 Total: 3 utilisateur(s)

────────────────────────────────────────────────────────────────────────────────

1. 👑 admin@adspilot.com
   ID: abc123...
   Rôle: admin
   Créé le: 01/04/2026
   Dernière connexion: 10/04/2026
   Confirmé: ✅

2. ⭐ user@example.com
   ID: def456...
   Rôle: pro
   Créé le: 05/04/2026
   Dernière connexion: 09/04/2026
   Confirmé: ✅

3. 👤 newuser@example.com
   ID: ghi789...
   Rôle: user
   Créé le: 10/04/2026
   Dernière connexion: Jamais
   Confirmé: ❌

────────────────────────────────────────────────────────────────────────────────

📈 Statistiques:
   👑 Admins: 1
   ⭐ Pro: 1
   👤 Standard: 1
```

---

### 2. `promote-admin.js` - Promouvoir en admin

**Usage** :
```bash
node scripts/promote-admin.js EMAIL
```

**Exemple** :
```bash
node scripts/promote-admin.js user@example.com
```

**Processus** :
1. Recherche l'utilisateur par email
2. Affiche les infos actuelles
3. Met à jour le rôle vers "admin"
4. Confirme la promotion

**Exemple de sortie** :
```
🔍 Recherche de l'utilisateur: user@example.com

✅ Utilisateur trouvé: user@example.com
   ID: abc123...
   Rôle actuel: user

🔄 Promotion en admin...

✅ Utilisateur promu en admin avec succès!

📊 Détails:
   Email: user@example.com
   ID: abc123...
   Rôle: admin

🎉 L'utilisateur peut maintenant accéder au panel admin!
   URL: https://ads-pilot.app/#/admin-pro/dashboard
```

---

## 📋 CHECKLIST - Premier Admin

### Configuration initiale
- [ ] Créer un compte sur AdsPilot
- [ ] Vérifier l'email de confirmation
- [ ] Se connecter au moins une fois
- [ ] Promouvoir le compte en admin (via Supabase ou script)
- [ ] Se déconnecter et reconnecter
- [ ] Accéder au panel admin

### Vérification
- [ ] Panel admin accessible (`/#/admin-pro/dashboard`)
- [ ] Onglet "Dashboard" visible
- [ ] Onglet "Tickets Support" visible
- [ ] Onglet "Templates" visible
- [ ] Onglet "Annonces" visible
- [ ] Onglet "Utilisateurs" visible
- [ ] Onglet "Abonnements" visible
- [ ] Onglet "Paramètres" visible

---

## 🔒 SÉCURITÉ

### Bonnes pratiques

1. **Limiter les admins**
   - Maximum 2-3 admins
   - Uniquement des personnes de confiance
   - Utiliser des emails professionnels

2. **Vérifier régulièrement**
   ```bash
   node scripts/list-users.js
   ```
   - Vérifier la liste des admins
   - Révoquer les accès inutiles

3. **Logs d'audit**
   - Toutes les actions admin sont loggées
   - Vérifier régulièrement les logs

4. **Mots de passe forts**
   - Minimum 12 caractères
   - Lettres, chiffres, symboles
   - Unique pour AdsPilot

5. **2FA (Recommandé)**
   - Activer l'authentification à deux facteurs
   - Via Supabase Dashboard

---

## 🚨 RÉVOQUER UN ADMIN

### Via Supabase Dashboard
1. Authentication → Users
2. Trouver l'utilisateur
3. User Metadata → Edit
4. Changer `"role": "admin"` en `"role": "user"`
5. Save

### Via Script (à créer si besoin)
```bash
node scripts/demote-admin.js EMAIL
```

---

## 📊 PANEL ADMIN - FONCTIONNALITÉS

### 1. Dashboard
- Statistiques globales
- Graphiques de croissance
- Activité récente

### 2. Tickets Support
- Liste de tous les tickets
- Répondre aux tickets
- Marquer comme résolu
- Badge de notifications

### 3. Templates
- Gérer tous les templates
- Ajouter de nouveaux templates
- Modifier/Supprimer
- Catégoriser par niche

### 4. Annonces
- Créer des annonces système
- Afficher à tous les utilisateurs
- Gérer les annonces actives

### 5. Utilisateurs
- Liste complète
- Modifier les rôles
- Voir les abonnements
- Bloquer/Débloquer (à venir)

### 6. Abonnements
- Gérer les plans
- Voir les paiements
- Statistiques revenus

### 7. Paramètres
- Configuration générale
- Intégrations
- Sécurité

---

## 🔧 DÉPANNAGE

### L'utilisateur ne voit pas le panel admin

**Vérifications** :
1. Le rôle est bien "admin" dans Supabase
2. L'utilisateur s'est déconnecté/reconnecté
3. Le cache du navigateur est vidé
4. Essayer en navigation privée

**Solution** :
```bash
# Vérifier le rôle
node scripts/list-users.js

# Re-promouvoir si nécessaire
node scripts/promote-admin.js EMAIL
```

### Erreur "Accès refusé"

**Causes possibles** :
- Le rôle n'est pas "admin"
- Le token de session est expiré
- Problème de synchronisation

**Solution** :
1. Se déconnecter complètement
2. Vider le cache du navigateur
3. Se reconnecter
4. Vérifier le rôle dans Supabase

---

## 📞 SUPPORT

### Ressources
- Documentation Supabase Auth : https://supabase.com/docs/guides/auth
- Panel Admin : https://ads-pilot.app/#/admin-pro/dashboard
- Scripts : `/scripts/`

### Contact
- Email : support@adspilot.com
- Documentation : Voir `AUDIT_SECURITE.md`

---

**Guide créé le** : 10 Avril 2026  
**Dernière mise à jour** : 10 Avril 2026
