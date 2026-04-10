# 🚀 BUILD ET DÉPLOIEMENT - ADSPILOT

## 📦 ÉTAPE 1 : Build

```bash
npm install
npm run build
```

## 📁 ÉTAPE 2 : Fichiers à uploader

```
📦 Serveur
├── .next/           ← Build (OBLIGATOIRE)
├── public/          ← Assets
├── node_modules/    ← Dépendances
├── package.json
├── .env             ← Variables
├── .htaccess        ← Apache config
└── next.config.js
```

## 🌐 ÉTAPE 3 : Démarrer en production

### Sur serveur Node.js :
```bash
npm install --production
npm run start
```

### Avec PM2 (recommandé) :
```bash
npm install -g pm2
pm2 start npm --name "adspilot" -- start
pm2 save
pm2 startup
```

**Port** : 3000 (configure reverse proxy Apache)

## 🔧 ÉTAPE 4 : Reverse Proxy Apache

Fichier VirtualHost :
```apache
<VirtualHost *:443>
    ServerName adspilot.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

## ✅ Fichiers créés

- ✅ `.htaccess` (sécurité, compression, cache)
- ✅ Ce guide

**Le .htaccess est prêt avec** :
- Redirection HTTPS
- Compression GZIP
- Cache navigateur
- Sécurité (XSS, CORS)
- Routing Next.js
