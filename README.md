# Genius AI - Assistant Intelligent Spécialisé

**Genius AI** est une application web intelligente spécialisée en médecine et informatique, conçue pour les étudiants et professionnels. Elle combine la puissance de multiples IA (OpenAI, DeepSeek, Claude) avec des fonctionnalités avancées d'OCR et de validation des sources médicales.

## 🚀 Fonctionnalités Principales

### 🏥 Mode Médecine
- **Analyse de QCM et cas cliniques** avec extraction automatique via OCR
- **Validation des sources médicales** (PubMed, UpToDate, Guidelines OMS)
- **Cross-validation** entre multiples providers IA pour une fiabilité maximale
- **Réponses structurées** : réponse principale, justification, niveau de certitude, points clés
- **Génération automatique** de questions d'entraînement similaires

### 💻 Mode Informatique
- **Analyse et correction de code** dans tous les langages
- **Explication détaillée** des algorithmes et structures de données
- **Bonnes pratiques** et patterns recommandés
- **QCM informatiques** avec analyse complète
- **Exercices pratiques** générés automatiquement

### 🎯 Fonctionnalités Transversales
- **OCR Avancé** : Extraction automatique de texte depuis plusieurs images simultanément
- **Interface moderne** : Design sombre responsive avec animations fluides
- **Historique des conversations** : Sauvegarde automatique avec organisation par mode
- **Performance optimisée** : Réponses en moins de 30 secondes
- **Support multi-images** : Traitement simultané de plusieurs captures d'écran

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le développement rapide
- **TailwindCSS** pour le styling moderne
- **shadcn/ui** pour les composants UI de qualité
- **Tesseract.js** pour l'OCR côté client
- **React Query** pour la gestion des états

### Backend
- **Supabase Functions** pour l'API serverless
- **Multiple AI Providers** :
  - OpenAI GPT-4 Vision
  - DeepSeek Chat
  - Claude 3 Sonnet
  - Google Gemini (fallback)
- **Cross-validation** automatique pour le mode médecine
- **Timeout management** (30 secondes max)

### Base de Données
- **Supabase PostgreSQL** pour la persistance
- **Stockage des conversations** avec métadonnées
- **Système de cache** pour optimiser les performances

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd "Genus IA"
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditez `.env` avec vos clés API :
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_key"
OPENAI_API_KEY="your_openai_key"
DEEPSEEK_API_KEY="your_deepseek_key"
CLAUDE_API_KEY="your_claude_key"
LOVABLE_API_KEY="your_lovable_key"
```

4. **Déployer les fonctions Supabase**
```bash
supabase functions deploy chat
```

5. **Démarrer l'application**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🔧 Configuration des API Keys

### OpenAI
1. Créer un compte sur [OpenAI Platform](https://platform.openai.com)
2. Générer une API key dans Settings > API Keys
3. Ajouter la clé dans `.env` : `OPENAI_API_KEY=sk-...`

### DeepSeek
1. Créer un compte sur [DeepSeek](https://platform.deepseek.com)
2. Générer une API key
3. Ajouter la clé dans `.env` : `DEEPSEEK_API_KEY=...`

### Claude (Anthropic)
1. Créer un compte sur [Anthropic Console](https://console.anthropic.com)
2. Générer une API key
3. Ajouter la clé dans `.env` : `CLAUDE_API_KEY=sk-ant-...`

### Supabase
1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer l'URL et la clé publique
3. Ajouter dans `.env` : `VITE_SUPABASE_URL=...` et `VITE_SUPABASE_PUBLISHABLE_KEY=...`

## 📱 Utilisation

### Mode Médecine
1. **Sélectionnez le mode Médecine** dans l'interface
2. **Posez votre question** ou **téléchargez des images** de QCM/cas cliniques
3. **L'OCR analyse automatiquement** les images et extrait le texte
4. **Genius AI fournit** une réponse structurée avec sources validées
5. **Des questions similaires** sont générées pour l'entraînement

### Mode Informatique
1. **Sélectionnez le mode Informatique**
2. **Collez du code** ou **téléchargez des captures d'écran**
3. **Obtenez une analyse détaillée** avec corrections et explications
4. **Apprenez les bonnes pratiques** et optimisations

### Fonctionnalités Avancées
- **Multi-images** : Téléchargez plusieurs images simultanément
- **OCR Intelligent** : Détection automatique des QCM et questions
- **Historique** : Accédez à vos conversations précédentes
- **Export** : Sauvegardez vos réponses importantes

## 🎨 Personnalisation

### Thème et Interface
- Le thème sombre est activé par défaut
- Les couleurs s'adaptent selon le mode (médecine/informatique)
- Animations fluides et transitions modernes

### Prompts Système
Les prompts sont configurables dans `supabase/functions/chat/index.ts` :
- Mode médecine : focus sur validation des sources
- Mode informatique : focus sur bonnes pratiques et performance

## 🔒 Sécurité

- **Pas de stockage** des images sur nos serveurs
- **Traitement local** de l'OCR côté client
- **API sécurisées** avec Supabase Edge Functions
- **Validation des entrées** et sanitisation des données

## 🚀 Performance

- **Optimisation du temps de réponse** (< 30 secondes)
- **Cross-validation parallèle** pour le mode médecine
- **Mise en cache intelligente** des réponses similaires
- **Compression automatique** des images avant traitement

## 📈 Évolutions Futures

### Version Premium
- **Suivi de progression** avancé avec analytics
- **Certifications internes** et badges de compétence
- **Mode collaboratif** pour études de groupe
- **Intégration LMS** pour institutions

### Fonctionnalités en Développement
- **Traitement PDF** complet avec extraction de texte
- **Voix et audio** pour questions vocales
- **Mode offline** avec cache local
- **API publique** pour intégrations tierces

## 🤝 Contribution

Nous accueillons les contributions ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour détails.

## 👨‍⚕️ Auteur

**Ivane Beranger Kouassi**  
Développeur Full-Stack spécialisé en applications médicales et IA

- 📧 Contact : [your-email@example.com]
- 🌐 Portfolio : [your-portfolio.com]
- 💼 LinkedIn : [your-linkedin]

## 🙏 Remerciements

- OpenAI pour les modèles GPT-4 Vision
- Anthropic pour Claude 3
- DeepSeek pour l'IA accessible
- Supabase pour l'infrastructure serverless
- La communauté médicale pour les retours et améliorations

---

**Genius AI** - L'assistant intelligent qui rend l'apprentissage plus intelligent 🧠✨
