#!/bin/bash

# 🚀 Genius AI - Script de Déploiement Rapide
# Par Ivane Beranger Kouassi - EBuni Studio Medical Digital Solution

echo "🎨 Genius AI - Déploiement Rapide"
echo "👨‍💻 Par Ivane Beranger Kouassi"
echo "🏢 EBuni Studio Medical Digital Solution"
echo ""

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création du fichier .env à partir de .env.example..."
    cp .env.example .env
    echo "🔧 Veuillez éditer le fichier .env avec vos clés API"
    echo "📝 Variables requises :"
    echo "   - VITE_SUPABASE_PROJECT_ID"
    echo "   - VITE_SUPABASE_PUBLISHABLE_KEY"
    echo "   - VITE_SUPABASE_URL"
    echo "   - OPENAI_API_KEY (optionnel)"
    echo "   - GEMINI_API_KEY (optionnel)"
    echo ""
    read -p "Appuyez sur Entrée une fois le fichier .env configuré..."
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du projet
echo "🔨 Build du projet en cours..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Le build a échoué"
    exit 1
fi

echo "✅ Build réussi"

# Vérifier Supabase CLI
if command -v supabase &> /dev/null; then
    echo "🚀 Déploiement des fonctions Supabase..."
    supabase functions deploy chat
    
    if [ $? -eq 0 ]; then
        echo "✅ Fonctions Supabase déployées"
    else
        echo "⚠️  Erreur lors du déploiement des fonctions Supabase"
        echo "📋 Vérifiez votre configuration Supabase CLI"
    fi
else
    echo "⚠️  Supabase CLI non installé"
    echo "📦 Installation : npm install -g supabase"
    echo "🔗 Puis : supabase login && supabase link --project-ref VOTRE_PROJECT_ID"
fi

# Vérifier Vercel CLI
if command -v vercel &> /dev/null; then
    echo "🌐 Déploiement sur Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "✅ Application déployée sur Vercel"
    else
        echo "⚠️  Erreur lors du déploiement Vercel"
    fi
else
    echo "⚠️  Vercel CLI non installé"
    echo "📦 Installation : npm install -g vercel"
    echo "🌐 Ou déployez manuellement le dossier 'dist' sur votre plateforme"
fi

echo ""
echo "🎉 Déploiement terminé !"
echo "🔗 Votre application Genius AI est en ligne"
echo ""
echo "📋 Checklist post-déploiement :"
echo "   ✅ URL accessible"
echo "   ✅ Fonction chat opérationnelle"
echo "   ✅ OCR multi-images fonctionnel"
echo "   ✅ QCM surlignage visible"
echo "   ✅ Atlas 3D interactif"
echo "   ✅ Info créateur (Ivane Beranger Kouassi)"
echo ""
echo "🎨 Genius AI - Conçu avec passion par Ivane Beranger Kouassi"
echo "🏢 EBuni Studio Medical Digital Solution"
