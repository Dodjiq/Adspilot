# ⚙️ CONFIGURATION SEO - ADSPILOT

## 🎯 Variables d'environnement à ajouter

Ajoute ces variables dans ton fichier `.env.local` (ne jamais commit `.env` !) :

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console (déjà fait ✅)
# Le code de vérification est dans app/layout.js ligne 69

# Google Tag Manager (optionnel)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 📊 ÉTAPES DE CONFIGURATION

### 1. Google Analytics 4 ✅

#### Créer une propriété GA4
1. Va sur https://analytics.google.com
2. Créer un compte → "AdsPilot"
3. Créer une propriété → "AdsPilot Production"
4. Configurer le flux de données Web
5. URL : `https://ads-pilot.app`
6. Copier le **Measurement ID** (format: G-XXXXXXXXXX)

#### Ajouter à .env.local
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Vérifier l'installation
1. Déployer sur Vercel
2. Visiter https://ads-pilot.app
3. Ouvrir Google Analytics
4. Aller dans "Temps réel"
5. Tu devrais voir ta visite !

---

### 2. Google Search Console ✅ (Déjà fait)

#### Vérifier la propriété
1. Va sur https://search.google.com/search-console
2. Ajouter une propriété → "ads-pilot.app"
3. Méthode de vérification : **Balise HTML**
4. Copier le code de vérification
5. Remplacer `your-google-verification-code` dans `app/layout.js` ligne 69

#### Soumettre le sitemap
1. Dans Search Console → "Sitemaps"
2. Ajouter un nouveau sitemap
3. URL : `https://ads-pilot.app/sitemap.xml`
4. Envoyer
5. Attendre l'indexation (24-48h)

---

### 3. Meta Tags - Open Graph

#### Créer les images (voir IMAGES_SEO_GUIDE.md)
1. `public/og-image.png` (1200x630)
2. `public/twitter-image.png` (1200x600)
3. `public/favicon.ico` (32x32)
4. `public/apple-touch-icon.png` (180x180)
5. `public/icon-192x192.png`
6. `public/icon-512x512.png`

#### Valider
1. Facebook : https://developers.facebook.com/tools/debug
2. Twitter : https://cards-dev.twitter.com/validator
3. LinkedIn : https://www.linkedin.com/post-inspector

---

### 4. Structured Data (JSON-LD) ✅

Déjà configuré dans :
- `app/layout.js` (SoftwareApplication)
- `app/page.js` (FAQPage)

#### Valider
1. Va sur https://validator.schema.org
2. Coller l'URL : `https://ads-pilot.app`
3. Vérifier qu'il n'y a pas d'erreurs
4. Ou utiliser Google Rich Results Test : https://search.google.com/test/rich-results

---

### 5. Robots.txt & Sitemap ✅

Déjà créés :
- `public/robots.txt`
- `app/sitemap.js`

#### Vérifier
```bash
# Tester robots.txt
curl https://ads-pilot.app/robots.txt

# Tester sitemap
curl https://ads-pilot.app/sitemap.xml
```

---

### 6. PWA Manifest ✅

Déjà créé : `public/site.webmanifest`

#### Tester
1. Ouvrir Chrome DevTools
2. Onglet "Application"
3. Section "Manifest"
4. Vérifier que tout est correct

---

## 🔧 COMMANDES UTILES

### Vérifier le SEO local
```bash
# Lancer le dev server
npm run dev

# Tester les meta tags
curl -I http://localhost:3000

# Vérifier le sitemap
curl http://localhost:3000/sitemap.xml

# Vérifier robots.txt
curl http://localhost:3000/robots.txt
```

### Déployer sur Vercel
```bash
# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID

# Déployer
git push origin main

# Vercel déploie automatiquement
```

---

## ✅ CHECKLIST POST-DÉPLOIEMENT

### Immédiat (Aujourd'hui)
- [x] Créer compte Google Analytics 4
- [x] Ajouter GA_MEASUREMENT_ID dans Vercel
- [x] Vérifier Google Search Console
- [x] Soumettre sitemap à Google
- [ ] Créer images OG et Twitter
- [ ] Valider structured data
- [ ] Tester partages sociaux

### Court terme (Cette semaine)
- [ ] Configurer Google Tag Manager (optionnel)
- [ ] Ajouter événements GA4 personnalisés
- [ ] Créer tableaux de bord Analytics
- [ ] Configurer alertes Search Console
- [ ] Vérifier Core Web Vitals

### Moyen terme (Ce mois)
- [ ] Analyser les premiers résultats SEO
- [ ] Optimiser selon les données
- [ ] Créer contenu blog
- [ ] Link building strategy
- [ ] A/B testing meta descriptions

---

## 📊 ÉVÉNEMENTS GA4 À TRACKER

### Événements automatiques (déjà trackés)
- ✅ page_view
- ✅ scroll
- ✅ click
- ✅ file_download

### Événements personnalisés à ajouter
```javascript
// Inscription
gtag('event', 'sign_up', {
  method: 'Email'
});

// Connexion
gtag('event', 'login', {
  method: 'Email'
});

// Template sélectionné
gtag('event', 'select_item', {
  item_id: 'template_id',
  item_name: 'Template Name'
});

// Campagne lancée
gtag('event', 'campaign_launch', {
  campaign_type: 'Meta',
  budget: 50
});
```

---

## 🎯 OBJECTIFS SEO

### Mois 1
- [ ] Indexation complète (toutes les pages)
- [ ] 100+ visites organiques
- [ ] 10+ mots-clés positionnés
- [ ] 0 erreurs Search Console

### Mois 3
- [ ] 500+ visites organiques/mois
- [ ] 50+ mots-clés positionnés
- [ ] Top 10 pour 5 mots-clés principaux
- [ ] 10+ backlinks de qualité

### Mois 6
- [ ] 2000+ visites organiques/mois
- [ ] 100+ mots-clés positionnés
- [ ] Top 3 pour mots-clés principaux
- [ ] 50+ backlinks de qualité
- [ ] Domain Authority 30+

---

## 🚨 ERREURS À ÉVITER

### ❌ Ne jamais faire
1. Commit le fichier `.env` avec les secrets
2. Utiliser des images non optimisées (> 500 KB)
3. Oublier les alt texts sur les images
4. Dupliquer les meta descriptions
5. Ignorer les erreurs Search Console
6. Acheter des backlinks de mauvaise qualité
7. Sur-optimiser les mots-clés (keyword stuffing)

### ✅ Toujours faire
1. Compresser les images
2. Tester sur mobile
3. Vérifier Core Web Vitals
4. Mettre à jour le sitemap
5. Analyser les données GA4
6. Répondre aux erreurs Search Console
7. Créer du contenu de qualité

---

## 📞 SUPPORT

### Ressources
- Documentation Next.js SEO : https://nextjs.org/learn/seo/introduction-to-seo
- Google Search Central : https://developers.google.com/search
- Schema.org : https://schema.org
- Web.dev : https://web.dev

### Outils
- Google Analytics : https://analytics.google.com
- Google Search Console : https://search.google.com/search-console
- PageSpeed Insights : https://pagespeed.web.dev
- Lighthouse : Chrome DevTools

---

**Configuration réalisée par** : Cascade AI  
**Date** : 10 Avril 2026  
**Contact** : support@adspilot.com
