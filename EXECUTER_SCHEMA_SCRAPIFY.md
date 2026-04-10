# 🚀 COMMENT EXÉCUTER LE SCHÉMA SCRAPIFY DANS SUPABASE

## ❌ Erreur actuelle
```
Impossible de sauvegarder le produit
```

**Cause** : Les tables `scraped_products`, `shopify_stores` et `scrapify_settings` n'existent pas encore dans ta base de données Supabase.

---

## ✅ SOLUTION : Exécuter le schéma SQL

### ÉTAPE 1 : Ouvrir Supabase Dashboard

1. Va sur : **https://app.supabase.com**
2. Connecte-toi à ton compte
3. Sélectionne ton projet AdsPilot

---

### ÉTAPE 2 : Ouvrir l'éditeur SQL

Dans la sidebar gauche, clique sur :
```
🔧 SQL Editor
```

---

### ÉTAPE 3 : Créer une nouvelle requête

Clique sur le bouton :
```
+ New Query
```

---

### ÉTAPE 4 : Copier-coller le schéma

1. **Ouvre le fichier** : `supabase-scrapify-schema.sql` (déjà ouvert dans ton IDE)
2. **Sélectionne TOUT le contenu** (Ctrl+A)
3. **Copie** (Ctrl+C)
4. **Colle dans l'éditeur SQL Supabase** (Ctrl+V)

---

### ÉTAPE 5 : Exécuter le script

Clique sur le bouton **RUN** en haut à droite (ou appuie sur `Ctrl+Enter`)

---

### ÉTAPE 6 : Vérifier le succès

Tu devrais voir un message comme :
```
✅ Success. No rows returned
```

Ou plusieurs lignes de succès pour chaque commande CREATE.

---

## 🔍 VÉRIFICATION : Les tables sont créées

### Option 1 : Via Table Editor

1. Dans la sidebar, clique sur **📊 Table Editor**
2. Tu devrais voir 3 nouvelles tables :
   - ✅ `scraped_products`
   - ✅ `shopify_stores`
   - ✅ `scrapify_settings`

### Option 2 : Via SQL

Exécute cette requête dans SQL Editor :
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('shopify_stores', 'scraped_products', 'scrapify_settings');
```

Tu devrais voir **3 lignes** retournées.

---

## 🧪 TESTER SCRAPIFY

Une fois le schéma exécuté :

1. **Retourne sur ton dashboard AdsPilot**
2. Va dans **Outils** → **📦 Scrapify**
3. Teste avec cette URL :
   ```
   https://www.allbirds.com/products/mens-wool-runners
   ```
4. Clique sur **Scraper**

**Résultat attendu** :
- ✅ "Produit scrapé avec succès !"
- ✅ Modal d'édition s'ouvre
- ✅ Produit visible dans l'onglet "Historique"

---

## ⚠️ ERREURS POSSIBLES

### Erreur : "permission denied for schema public"
**Solution** : Tu n'as pas les droits. Vérifie que tu es bien sur le bon projet Supabase.

### Erreur : "relation already exists"
**Solution** : Les tables existent déjà. Pas de problème, continue !

### Erreur : "syntax error at or near..."
**Solution** : Tu n'as pas copié tout le fichier. Recommence l'ÉTAPE 4.

---

## 📸 CAPTURE D'ÉCRAN DU PROCESSUS

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
├─────────────────────────────────────────┤
│  Sidebar:                               │
│  ├─ 🏠 Home                             │
│  ├─ 📊 Table Editor                     │
│  ├─ 🔧 SQL Editor  ← CLIQUE ICI         │
│  ├─ 🔐 Authentication                   │
│  └─ ⚙️  Settings                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  SQL Editor                             │
├─────────────────────────────────────────┤
│  [+ New Query]  ← CLIQUE ICI            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ -- Colle le schéma ici           │ │
│  │ CREATE TABLE IF NOT EXISTS...    │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [RUN ▶]  ← CLIQUE ICI                 │
└─────────────────────────────────────────┘
```

---

## 🎯 RÉSUMÉ EN 3 ÉTAPES

1. **Ouvre** Supabase → SQL Editor
2. **Colle** le contenu de `supabase-scrapify-schema.sql`
3. **Clique** sur RUN

C'est tout ! 🚀

---

## 💬 BESOIN D'AIDE ?

Si tu rencontres un problème :
1. Copie le message d'erreur exact
2. Fais une capture d'écran de l'éditeur SQL
3. Dis-moi ce qui se passe

Je t'aiderai à résoudre le problème ! 😊
