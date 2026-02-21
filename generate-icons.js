#!/usr/bin/env node

// Genius AI - Générateur d'Icônes PWA
// Conçu par Ivane Beranger Kouassi - EBuni Studio Medical Digital Solution

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZES = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

const PUBLIC_DIR = path.join(__dirname, 'public');
const LOGO_PATH = path.join(PUBLIC_DIR, 'LOGO.png');

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA pour Genius AI...');
  console.log('👨‍💻 Par Ivane Beranger Kouassi - EBuni Studio Medical Digital Solution\n');

  try {
    // Vérifier si le LOGO.png existe
    if (!fs.existsSync(LOGO_PATH)) {
      console.error('❌ LOGO.png non trouvé dans le dossier public/');
      console.log('📝 Veuillez placer votre fichier LOGO.png dans le dossier public/');
      process.exit(1);
    }

    // Créer les icônes
    for (const { size, name } of SIZES) {
      const outputPath = path.join(PUBLIC_DIR, name);
      
      await sharp(LOGO_PATH)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`✅ ${name} (${size}x${size}) généré`);
    }

    // Générer favicon.ico
    const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');
    await sharp(LOGO_PATH)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(faviconPath);

    console.log('✅ favicon.ico généré');

    console.log('\n🎉 Toutes les icônes PWA ont été générées avec succès !');
    console.log('📱 Genius AI est maintenant prêt pour l\'installation mobile !\n');

    console.log('📋 Icônes générées :');
    SIZES.forEach(({ size, name }) => {
      console.log(`   📄 ${name} (${size}x${size}px)`);
    });
    console.log('   📄 favicon.ico (32x32px)');

    console.log('\n🚀 Prochaines étapes :');
    console.log('   1. npm run build');
    console.log('   2. vercel --prod');
    console.log('   3. Tester l\'installation sur mobile');

  } catch (error) {
    console.error('❌ Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

// Vérifier si Sharp est installé
try {
  require('sharp');
} catch (error) {
  console.error('❌ Sharp n\'est pas installé');
  console.log('📦 Installation : npm install sharp');
  process.exit(1);
}

generateIcons();
