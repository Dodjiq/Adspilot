# 🎨 GÉNÉRATION DES IMAGES SEO

## 📋 Images créées

Les templates SVG suivants ont été créés dans `/public` :

- ✅ `og-image.svg` - Open Graph (1200x630)
- ✅ `twitter-image.svg` - Twitter Card (1200x600)
- ✅ `icon.svg` - Logo/Icône (512x512)

## 🚀 MÉTHODE 1 : Conversion automatique avec Sharp (Recommandé)

### Installation
```bash
npm install sharp
```

### Conversion
```bash
node scripts/convert-images.js
```

Cela va créer automatiquement :
- `og-image.png` (1200x630)
- `twitter-image.png` (1200x600)
- `apple-touch-icon.png` (180x180)
- `icon-192x192.png` (192x192)
- `icon-512x512.png` (512x512)
- `favicon-32x32.png` (32x32)
- `favicon-16x16.png` (16x16)

### Créer favicon.ico
1. Va sur https://favicon.io/favicon-converter/
2. Upload `favicon-32x32.png`
3. Télécharge `favicon.ico`
4. Place-le dans `/public`

---

## 🎨 MÉTHODE 2 : Conversion manuelle

### Avec Inkscape (Gratuit)
```bash
# Installer Inkscape
# Windows: https://inkscape.org/release/

# Convertir OG Image
inkscape public/og-image.svg --export-filename=public/og-image.png --export-width=1200 --export-height=630

# Convertir Twitter Image
inkscape public/twitter-image.svg --export-filename=public/twitter-image.png --export-width=1200 --export-height=600

# Convertir Icon
inkscape public/icon.svg --export-filename=public/icon-512x512.png --export-width=512 --export-height=512
```

### Avec un éditeur en ligne
1. **Figma** - https://figma.com
   - Importer le SVG
   - Exporter en PNG aux bonnes dimensions

2. **Photopea** - https://photopea.com
   - Ouvrir le SVG
   - Redimensionner si nécessaire
   - Exporter en PNG

3. **SVGOMG** - https://jakearchibald.github.io/svgomg/
   - Optimiser le SVG avant conversion

---

## 📐 DIMENSIONS REQUISES

| Fichier | Dimensions | Format | Usage |
|---------|------------|--------|-------|
| og-image.png | 1200x630 | PNG | Facebook, LinkedIn, WhatsApp |
| twitter-image.png | 1200x600 | PNG | Twitter Card |
| apple-touch-icon.png | 180x180 | PNG | iOS Home Screen |
| icon-192x192.png | 192x192 | PNG | PWA Android |
| icon-512x512.png | 512x512 | PNG | PWA Android |
| favicon.ico | 32x32 | ICO | Browser Tab |

---

## ✅ CHECKLIST

### Après conversion
- [ ] Vérifier que toutes les images sont créées
- [ ] Vérifier la qualité visuelle
- [ ] Vérifier le poids (< 300 KB pour OG/Twitter)
- [ ] Compresser avec TinyPNG si nécessaire
- [ ] Créer favicon.ico
- [ ] Placer tous les fichiers dans `/public`

### Validation
- [ ] Tester avec Facebook Debugger
- [ ] Tester avec Twitter Card Validator
- [ ] Vérifier le favicon dans le navigateur
- [ ] Tester l'installation PWA sur mobile

### Déploiement
- [ ] Commit les images
- [ ] Push sur GitHub
- [ ] Vérifier sur Vercel
- [ ] Forcer le refresh du cache (Facebook, Twitter)

---

## 🎨 PERSONNALISATION

Si tu veux modifier les templates SVG :

### Couleurs
- Fond : `#070B14` (dark blue)
- Gradient : `#5A5AFB` → `#9C5DFF` (violet)
- Texte : `#FFFFFF` (white)

### Textes
Ouvre le fichier SVG et modifie les balises `<text>` :
```svg
<text x="80" y="240" fill="white">
  Ton nouveau texte ici
</text>
```

### Logo
Le logo est un éclair stylisé. Pour le modifier, édite le `<path>` dans la section logo.

---

## 🔧 COMPRESSION

### Avec TinyPNG (En ligne)
1. Va sur https://tinypng.com
2. Upload tes PNG
3. Télécharge les versions compressées
4. Remplace dans `/public`

### Avec ImageOptim (Mac)
```bash
# Installer ImageOptim
brew install imageoptim

# Compresser toutes les images
imageoptim public/*.png
```

### Avec pngquant (CLI)
```bash
# Installer pngquant
npm install -g pngquant-bin

# Compresser
pngquant public/og-image.png --output public/og-image.png --force
```

---

## 📊 OBJECTIFS DE POIDS

| Image | Poids max | Poids idéal |
|-------|-----------|-------------|
| og-image.png | 500 KB | < 200 KB |
| twitter-image.png | 500 KB | < 200 KB |
| apple-touch-icon.png | 100 KB | < 50 KB |
| icon-512x512.png | 200 KB | < 100 KB |
| icon-192x192.png | 50 KB | < 30 KB |
| favicon.ico | 20 KB | < 10 KB |

---

## 🚨 TROUBLESHOOTING

### Sharp ne s'installe pas
```bash
# Essayer avec --ignore-scripts
npm install sharp --ignore-scripts

# Ou utiliser la méthode manuelle
```

### Les images sont floues
- Augmenter la qualité dans le script : `quality: 95`
- Vérifier que les dimensions sont correctes
- Utiliser un outil de conversion de meilleure qualité

### Les images sont trop lourdes
- Compresser avec TinyPNG
- Réduire la qualité : `quality: 80`
- Utiliser WebP au lieu de PNG (si supporté)

---

## 📞 SUPPORT

Besoin d'aide ?
- Documentation : Voir `IMAGES_SEO_GUIDE.md`
- Configuration : Voir `CONFIGURATION_SEO.md`
- Contact : support@adspilot.com
