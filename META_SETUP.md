# Configuration de la connexion Meta/Facebook

Ce guide explique comment configurer l'authentification OAuth avec Meta/Facebook pour permettre aux utilisateurs de connecter leur compte Business Manager.

## Étape 1 : Créer une application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur **"Mes applications"** puis **"Créer une application"**
3. Sélectionnez le type **"Consommateur"** ou **"Entreprise"** selon votre cas
4. Remplissez les informations de base :
   - Nom de l'application : Easy-Ecom (ou votre nom)
   - Email de contact : votre email
   - Business Portfolio : sélectionnez ou créez-en un

## Étape 2 : Configurer les paramètres de l'application

1. Dans le tableau de bord de votre application, allez dans **Paramètres > Général**
2. Notez votre **"Identifiant de l'application"** (APP ID)
3. Notez votre **"Clé secrète"** (APP SECRET)
4. Ajoutez un domaine d'application :
   - En développement : `localhost`
   - En production : votre domaine réel

## Étape 3 : Ajouter le produit "Connexion Facebook"

1. Dans le menu de gauche, cliquez sur **"Ajouter un produit"**
2. Trouvez **"Connexion Facebook"** et cliquez sur **"Configurer"**
3. Allez dans **Connexion Facebook > Paramètres**
4. Ajoutez les **URI de redirection OAuth valides** :
   - **Développement** : `http://localhost:3000/api/meta/callback`
   - **Production** : `https://votre-domaine.com/api/meta/callback`

## Étape 4 : Activer les permissions nécessaires

1. Allez dans **App Review > Permissions and Features**
2. Demandez les permissions suivantes (ou utilisez-les en mode développement) :
   - `ads_management` - Gérer les publicités
   - `ads_read` - Lire les données publicitaires
   - `business_management` - Gérer le Business Manager
   - `pages_show_list` - Afficher la liste des pages
   - `pages_read_engagement` - Lire l'engagement des pages

**Note** : En mode développement, ces permissions sont automatiquement disponibles pour les administrateurs, développeurs et testeurs de l'application.

## Étape 5 : Configurer le fichier .env

Copiez vos identifiants dans le fichier `.env` :

```bash
# Meta/Facebook OAuth
META_APP_ID=votre_app_id_ici
META_APP_SECRET=votre_app_secret_ici
META_REDIRECT_URI=http://localhost:3000/api/meta/callback
```

**Important** :
- Ne partagez JAMAIS votre `META_APP_SECRET`
- Ajoutez `.env` à votre `.gitignore`
- En production, utilisez des variables d'environnement sécurisées

## Étape 6 : Ajouter des testeurs (Mode développement)

Pour tester en mode développement :

1. Allez dans **Rôles > Testeurs**
2. Ajoutez les comptes Facebook qui pourront tester la connexion
3. Les testeurs recevront une invitation qu'ils devront accepter

## Étape 7 : Passer en production

Quand vous êtes prêt à lancer en production :

1. Remplissez toutes les informations requises dans **Paramètres > Général** :
   - URL de politique de confidentialité
   - URL des conditions d'utilisation
   - Icône de l'application
   - Catégorie de l'application

2. Allez dans **App Review** et soumettez votre application pour examen

3. Une fois approuvée, basculez le mode de l'application sur **"En ligne"** dans **Paramètres > Général**

## Test de la connexion

1. Démarrez votre serveur de développement : `npm run dev:webpack`
2. Allez sur `http://localhost:3000`
3. Connectez-vous à votre compte
4. Naviguez vers **Paramètres** (icône Globe dans la sidebar)
5. Cliquez sur **"Connecter mon compte Meta"**
6. Vous serez redirigé vers Facebook pour autoriser l'application
7. Après autorisation, vous reviendrez automatiquement sur la page Paramètres

## Structure de la base de données

L'intégration utilise deux collections MongoDB :

### `meta_connections`
```javascript
{
  user_id: string,          // ID Supabase de l'utilisateur
  meta_user_id: string,     // ID Facebook de l'utilisateur
  name: string,             // Nom du compte Meta
  email: string,            // Email du compte Meta
  access_token: string,     // Token d'accès (chiffré recommandé)
  token_type: string,       // Type de token (Bearer)
  expires_in: number,       // Durée de validité en secondes
  connected_at: string,     // Date de connexion (ISO)
  updated_at: string        // Dernière mise à jour (ISO)
}
```

### `oauth_states`
```javascript
{
  state: string,            // UUID unique pour la sécurité OAuth
  user_id: string,          // ID de l'utilisateur
  provider: string,         // "meta"
  created_at: string,       // Date de création (ISO)
  expires_at: string        // Date d'expiration (15 min)
}
```

## Dépannage

### Erreur "Invalid OAuth redirect URI"
- Vérifiez que l'URI de redirection dans Facebook correspond exactement à `META_REDIRECT_URI` dans `.env`
- Assurez-vous d'avoir sauvegardé les paramètres dans Facebook

### Erreur "App Not Set Up"
- Vérifiez que vous avez bien activé le produit "Connexion Facebook"
- Vérifiez que votre `META_APP_ID` et `META_APP_SECRET` sont corrects

### La connexion échoue silencieusement
- Vérifiez les logs du serveur dans la console
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez que les variables d'environnement sont chargées

### Token expiré
- Les tokens Facebook expirent après un certain temps
- Implémentez un système de rafraîchissement de token (à venir)
- Demandez à l'utilisateur de se reconnecter

## Sécurité

- **Ne jamais** exposer `META_APP_SECRET` côté client
- Stockez les `access_token` de manière sécurisée (chiffrement recommandé)
- Utilisez HTTPS en production
- Validez toujours le paramètre `state` dans le callback OAuth
- Supprimez les états OAuth expirés régulièrement

## Ressources

- [Documentation Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Marketing API](https://developers.facebook.com/docs/marketing-apis/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Permissions de l'API](https://developers.facebook.com/docs/permissions/reference)

## Prochaines étapes

Fonctionnalités à implémenter :
- [ ] Rafraîchissement automatique des tokens
- [ ] Récupération des Ad Accounts
- [ ] Création de campagnes publicitaires
- [ ] Import des audiences personnalisées
- [ ] Gestion des pixels Facebook
- [ ] Synchronisation des catalogues produits
