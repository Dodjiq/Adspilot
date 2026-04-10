/**
 * Script pour créer favicon.ico à partir du PNG
 * 
 * Installation requise:
 * npm install to-ico
 * 
 * Usage:
 * node scripts/create-favicon.js
 */

const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function createFavicon() {
  console.log('🎨 Création de favicon.ico...\n');

  try {
    // Lire les fichiers PNG
    const favicon16 = fs.readFileSync(path.join(publicDir, 'favicon-16x16.png'));
    const favicon32 = fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'));

    // Créer le fichier ICO avec les deux tailles
    const icoBuffer = await toIco([favicon16, favicon32]);

    // Écrire le fichier
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    const stats = fs.statSync(path.join(publicDir, 'favicon.ico'));
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`✅ favicon.ico créé (${sizeKB} KB)\n`);
    console.log('📝 Prochaines étapes:');
    console.log('   1. Vérifier favicon.ico dans /public');
    console.log('   2. Tester dans le navigateur');
    console.log('   3. Commit et push');

  } catch (error) {
    console.error('❌ Erreur lors de la création du favicon:', error);
    console.log('\n💡 Alternative:');
    console.log('   1. Va sur https://favicon.io/favicon-converter/');
    console.log('   2. Upload public/favicon-32x32.png');
    console.log('   3. Télécharge favicon.ico');
    console.log('   4. Place-le dans /public');
    process.exit(1);
  }
}

// Vérifier si to-ico est installé
try {
  require.resolve('to-ico');
  createFavicon();
} catch (e) {
  console.error('❌ Le package "to-ico" n\'est pas installé.');
  console.log('\n📦 Installation requise:');
  console.log('   npm install to-ico');
  console.log('\nPuis relancer:');
  console.log('   node scripts/create-favicon.js');
  console.log('\n💡 Ou utiliser https://favicon.io/favicon-converter/');
  process.exit(1);
}
