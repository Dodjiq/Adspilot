# 🔧 SCRAPIFY - FIX RAPIDE NetworkError

## ❌ Problème
`NetworkError when attempting to fetch resource` lors du clic sur "Scraper"

## ✅ Solution appliquée

J'ai ajouté un **système de fallback** qui fonctionne sans Edge Function :

### Avant (ne fonctionnait pas) :
- Tentait d'appeler l'Edge Function Supabase
- Si non déployée → erreur réseau

### Maintenant (fonctionne) :
1. **Essaie** l'Edge Function (si déployée)
2. **Si échec** → Utilise le scraping direct côté client via l'API JSON publique de Shopify
3. Sauvegarde dans Supabase

---

## 🚀 Pour que ça fonctionne MAINTENANT

### ÉTAPE 1 : Créer les tables Supabase (OBLIGATOIRE)

Va sur ton dashboard Supabase : https://app.supabase.com

1. Clique sur **SQL Editor** (dans la sidebar)
2. Clique sur **New Query**
3. Copie-colle le contenu du fichier `supabase-scrapify-schema.sql`
4. Clique sur **Run** (ou `Ctrl+Enter`)

**Vérification** : Tu devrais voir un message de succès et les tables créées.

---

## 🧪 Tester maintenant

1. Retourne sur ton dashboard AdsPilot
2. Va dans **Outils** → **Scrapify**
3. Teste avec cette URL :
   ```
   https://www.allbirds.com/products/mens-wool-runners
   ```
   ou
   ```
   https://www.gymshark.com/products/gymshark-vital-seamless-2-0-leggings-black
   ```

4. Clique sur **Scraper**

**Résultat attendu** :
- ✅ Message "Produit scrapé avec succès !"
- ✅ Modal d'édition s'ouvre automatiquement
- ✅ Produit visible dans l'onglet "Historique"

---

## 🔍 Si ça ne fonctionne toujours pas

### Erreur : "relation scraped_products does not exist"
**Solution** : Tu n'as pas exécuté le schéma SQL → Retourne à l'ÉTAPE 1

### Erreur : "URL de produit Shopify invalide"
**Solution** : L'URL doit contenir `/products/` et être un produit Shopify public

### Erreur : "Impossible de récupérer le produit (403)"
**Solution** : Certaines boutiques bloquent le scraping. Essaie une autre URL.

### Erreur : "Impossible de sauvegarder le produit"
**Solution** : Vérifie que les RLS policies sont bien créées (dans le schéma SQL)

---

## 📊 Vérifier que ça marche dans Supabase

1. Va sur **Table Editor** dans Supabase
2. Sélectionne la table `scraped_products`
3. Tu devrais voir tes produits scrapés apparaître

---

## 🎯 Prochaines étapes (optionnel)

Pour améliorer les performances, tu peux déployer l'Edge Function :

```bash
supabase functions deploy scrape-shopify-product
```

Mais **ce n'est plus obligatoire** grâce au fallback ! 🎉

---

## 💡 Comment ça marche maintenant

```
┌─────────────────┐
│ Clic "Scraper"  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Essaie Edge Function    │ ──── ✅ Si OK → Retourne données
└────────┬────────────────┘
         │ ❌ Si erreur
         ▼
┌─────────────────────────┐
│ Fallback : Fetch direct │
│ https://shop.com/       │
│ products/handle.json    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Normalise les données   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Sauvegarde Supabase     │
│ table: scraped_products │
└────────┬────────────────┘
         │
         ▼
    ✅ Succès !
```

---

**Résumé** : Le scraping fonctionne maintenant **sans Edge Function** grâce au fallback automatique ! 🚀
