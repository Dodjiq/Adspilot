/**
 * Script pour convertir les SVG en PNG
 * 
 * Installation requise:
 * npm install sharp
 * 
 * Usage:
 * node scripts/convert-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function convertImages() {
  console.log('🎨 Conversion des images SVG en PNG...\n');

  try {
    // 1. OG Image (1200x630)
    console.log('📸 Conversion og-image.svg → og-image.png (1200x630)...');
    await sharp(path.join(publicDir, 'og-image.svg'))
      .resize(1200, 630)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'og-image.png'));
    console.log('✅ og-image.png créé\n');

    // 2. Twitter Image (1200x600)
    console.log('📸 Conversion twitter-image.svg → twitter-image.png (1200x600)...');
    await sharp(path.join(publicDir, 'twitter-image.svg'))
      .resize(1200, 600)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'twitter-image.png'));
    console.log('✅ twitter-image.png créé\n');

    // 3. Apple Touch Icon (180x180)
    console.log('📸 Conversion icon.svg → apple-touch-icon.png (180x180)...');
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(180, 180)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png créé\n');

    // 4. PWA Icon 192x192
    console.log('📸 Conversion icon.svg → icon-192x192.png (192x192)...');
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(192, 192)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    console.log('✅ icon-192x192.png créé\n');

    // 5. PWA Icon 512x512
    console.log('📸 Conversion icon.svg → icon-512x512.png (512x512)...');
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(512, 512)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'icon-512x512.png'));
    console.log('✅ icon-512x512.png créé\n');

    // 6. Favicon (32x32) - converti en ICO
    console.log('📸 Conversion icon.svg → favicon-32x32.png (32x32)...');
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(32, 32)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✅ favicon-32x32.png créé\n');

    // 7. Favicon (16x16)
    console.log('📸 Conversion icon.svg → favicon-16x16.png (16x16)...');
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(16, 16)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✅ favicon-16x16.png créé\n');

    // Afficher les tailles des fichiers
    console.log('📊 Tailles des fichiers créés:\n');
    const files = [
      'og-image.png',
      'twitter-image.png',
      'apple-touch-icon.png',
      'icon-192x192.png',
      'icon-512x512.png',
      'favicon-32x32.png',
      'favicon-16x16.png'
    ];

    files.forEach(file => {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   ${file}: ${sizeKB} KB`);
      }
    });

    console.log('\n✅ Toutes les images ont été converties avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Vérifier les images dans /public');
    console.log('   2. Pour créer favicon.ico, utiliser: https://favicon.io/favicon-converter/');
    console.log('   3. Uploader favicon-32x32.png sur favicon.io');
    console.log('   4. Télécharger favicon.ico et le placer dans /public');
    console.log('   5. Commit et push les images');

  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    process.exit(1);
  }
}

// Vérifier si sharp est installé
try {
  require.resolve('sharp');
  convertImages();
} catch (e) {
  console.error('❌ Le package "sharp" n\'est pas installé.');
  console.log('\n📦 Installation requise:');
  console.log('   npm install sharp');
  console.log('\nPuis relancer:');
  console.log('   node scripts/convert-images.js');
  process.exit(1);
}
