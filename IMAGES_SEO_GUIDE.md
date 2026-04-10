# 📸 GUIDE - IMAGES SEO POUR ADSPILOT

## 🎯 Images à créer pour optimiser le SEO

### 1️⃣ **Open Graph Image** (Facebook, LinkedIn, WhatsApp)
**Fichier** : `public/og-image.png`
- **Dimensions** : 1200 x 630 pixels
- **Format** : PNG ou JPG
- **Poids max** : 8 MB (recommandé < 300 KB)
- **Ratio** : 1.91:1

**Contenu suggéré** :
```
┌─────────────────────────────────────────┐
│  [Logo AdsPilot]                        │
│                                         │
│  Créez des Pubs qui Convertissent      │
│  pour le Marché Africain                │
│                                         │
│  ✓ +500 Templates                       │
│  ✓ Connexion Shopify                    │
│  ✓ Lancement Campagnes Meta             │
│                                         │
│  ads-pilot.app                          │
└─────────────────────────────────────────┘
```

**Couleurs** :
- Fond : #070B14 (dark blue)
- Accent : #5A5AFB → #9C5DFF (gradient violet)
- Texte : #FFFFFF (white)

---

### 2️⃣ **Twitter Card Image**
**Fichier** : `public/twitter-image.png`
- **Dimensions** : 1200 x 600 pixels
- **Format** : PNG ou JPG
- **Poids max** : 5 MB (recommandé < 300 KB)
- **Ratio** : 2:1

**Contenu suggéré** :
```
┌─────────────────────────────────────────┐
│  [Logo] AdsPilot                        │
│                                         │
│  +500 Templates Pub Meta                │
│  Optimisés pour l'Afrique               │
│                                         │
│  Lancez vos campagnes en 5 min          │
│  Shopify • Canva • Analytics            │
│                                         │
│  🚀 Essai Gratuit → ads-pilot.app       │
└─────────────────────────────────────────┘
```

---

### 3️⃣ **Favicon & Icons PWA**

#### Favicon
**Fichier** : `public/favicon.ico`
- **Dimensions** : 32 x 32 pixels
- **Format** : ICO
- **Design** : Logo AdsPilot simplifié (icône éclair)

#### Apple Touch Icon
**Fichier** : `public/apple-touch-icon.png`
- **Dimensions** : 180 x 180 pixels
- **Format** : PNG
- **Design** : Logo AdsPilot avec fond

#### PWA Icons
**Fichiers** :
- `public/icon-192x192.png` (192 x 192)
- `public/icon-512x512.png` (512 x 512)

**Design** : Logo AdsPilot centré avec padding

---

### 4️⃣ **Screenshots PWA** (Optionnel)

#### Desktop Screenshot
**Fichier** : `public/screenshot-desktop.png`
- **Dimensions** : 1280 x 720 pixels
- **Contenu** : Capture d'écran du dashboard

#### Mobile Screenshot
**Fichier** : `public/screenshot-mobile.png`
- **Dimensions** : 750 x 1334 pixels
- **Contenu** : Capture d'écran mobile du dashboard

---

## 🛠️ OUTILS RECOMMANDÉS

### Design
1. **Canva** - https://canva.com
   - Templates OG image disponibles
   - Facile à utiliser
   - Export haute qualité

2. **Figma** - https://figma.com
   - Design professionnel
   - Collaboration
   - Export optimisé

3. **Photopea** - https://photopea.com
   - Alternative gratuite à Photoshop
   - En ligne
   - Supporte PSD

### Compression
1. **TinyPNG** - https://tinypng.com
   - Compression PNG/JPG
   - Jusqu'à 70% de réduction
   - Qualité préservée

2. **Squoosh** - https://squoosh.app
   - Google tool
   - Compression avancée
   - Comparaison avant/après

3. **ImageOptim** (Mac) - https://imageoptim.com
   - Compression locale
   - Batch processing
   - Gratuit

### Validation
1. **Facebook Debugger** - https://developers.facebook.com/tools/debug
   - Teste Open Graph
   - Voit le rendu Facebook
   - Force le refresh du cache

2. **Twitter Card Validator** - https://cards-dev.twitter.com/validator
   - Teste Twitter Card
   - Voit le rendu Twitter
   - Validation en temps réel

3. **LinkedIn Post Inspector** - https://www.linkedin.com/post-inspector
   - Teste Open Graph LinkedIn
   - Force le refresh

---

## ✅ CHECKLIST

### Avant de créer
- [ ] Lire les specs de chaque plateforme
- [ ] Préparer le texte et le logo
- [ ] Choisir les couleurs de la marque

### Création
- [ ] Créer `og-image.png` (1200x630)
- [ ] Créer `twitter-image.png` (1200x600)
- [ ] Créer `favicon.ico` (32x32)
- [ ] Créer `apple-touch-icon.png` (180x180)
- [ ] Créer `icon-192x192.png`
- [ ] Créer `icon-512x512.png`

### Optimisation
- [ ] Compresser toutes les images
- [ ] Vérifier le poids (< 300 KB)
- [ ] Tester sur TinyPNG
- [ ] Vérifier la qualité visuelle

### Upload
- [ ] Uploader dans `/public`
- [ ] Vérifier les chemins dans `layout.js`
- [ ] Commit et push

### Validation
- [ ] Tester avec Facebook Debugger
- [ ] Tester avec Twitter Card Validator
- [ ] Tester avec LinkedIn Post Inspector
- [ ] Vérifier le rendu sur mobile

---

## 📋 TEMPLATE CANVA

### Étapes pour créer avec Canva :

1. **Créer un design personnalisé**
   - Dimensions : 1200 x 630 px (OG)
   - Dimensions : 1200 x 600 px (Twitter)

2. **Ajouter les éléments**
   - Fond dégradé : #070B14 → #0A0A0F
   - Logo AdsPilot en haut
   - Titre principal (Syne Bold, 48px)
   - Sous-titre (Onest, 24px)
   - 3 bullet points avec icônes
   - URL en bas

3. **Exporter**
   - Format : PNG
   - Qualité : Haute
   - Télécharger

4. **Compresser**
   - Uploader sur TinyPNG
   - Télécharger la version compressée

5. **Uploader**
   - Placer dans `/public`
   - Nommer correctement

---

## 🎨 EXEMPLES DE TEXTE

### Open Graph
**Titre** : "Créez des Pubs qui Convertissent pour l'Afrique"
**Sous-titre** : "+500 Templates • Shopify • Canva • Analytics"
**CTA** : "Essai Gratuit → ads-pilot.app"

### Twitter Card
**Titre** : "AdsPilot - Plateforme Pub Meta pour E-commerce Africain"
**Sous-titre** : "Lancez vos campagnes en 5 min"
**Features** : "✓ Templates ✓ Shopify ✓ Analytics"

---

## 🚀 APRÈS CRÉATION

1. **Valider les images**
   ```bash
   # Vérifier la taille
   ls -lh public/*.png
   
   # Devrait être < 300 KB chacune
   ```

2. **Tester le rendu**
   - Facebook : https://developers.facebook.com/tools/debug
   - Twitter : https://cards-dev.twitter.com/validator
   - LinkedIn : https://www.linkedin.com/post-inspector

3. **Forcer le refresh du cache**
   - Facebook : Cliquer "Scrape Again"
   - Twitter : Révalider l'URL
   - LinkedIn : "Inspect"

4. **Partager pour tester**
   - Créer un post test sur chaque plateforme
   - Vérifier le rendu
   - Ajuster si nécessaire

---

**Besoin d'aide ?** Contacte support@adspilot.com
