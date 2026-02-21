# 🤖 Genius AI - Assistant Médical et Informatique Ultra-Rapide

**Conçu par [Ivane Beranger Kouassi](https://github.com/ivanebk) - [EBuni Studio Medical Digital Solution](https://ebuni-studio.com)**

---

## 🎯 **Présentation**

Genius AI est un assistant intelligent spécialisé pour les étudiants en médecine et en informatique. Il combine OCR avancé, IA multi-providers, et visualisation 3D pour offrir une expérience d'apprentissage exceptionnelle.

### ✨ **Fonctionnalités Principales**

- 🚀 **Réponses Ultra-Rapides** : < 8 secondes avec 4 providers IA
- 🖼️ **OCR Multi-Images** : Jusqu'à 25 images simultanées
- 🎯 **QCM Surlignage** : Réponses automatiquement surlignées en jaune
- 🫁 **Atlas 3D** : Anatomie humaine interactive avec Three.js
- 👨‍💻 **Info Créateur** : Présentation d'Ivane Beranger Kouassi
- 📱 **Responsive Design** : Optimisé mobile, tablette et PC

---

## 🚀 **Déploiement Rapide**

### **Prérequis**
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Clés API (OpenAI, Gemini, etc.)

### **Installation Express**
```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/genius-ai.git
cd genius-ai

# 2. Lancer le script de déploiement
./QUICK_DEPLOY.sh
```

### **Configuration Manuelle**
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés

# 3. Build du projet
npm run build

# 4. Déployer les fonctions Supabase
supabase functions deploy chat

# 5. Déployer le frontend
vercel --prod  # ou netlify deploy --prod --dir=dist
```

---

## 🔧 **Configuration**

### **Variables d'Environnement**
```env
# Supabase (Obligatoire)
VITE_SUPABASE_PROJECT_ID="votre_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="votre_supabase_key"
VITE_SUPABASE_URL="https://votre-projet.supabase.co"

# Providers IA (Optionnel mais recommandé)
OPENAI_API_KEY="sk-..."
DEEPSEEK_API_KEY="..."
CLAUDE_API_KEY="..."
GEMINI_API_KEY="..."
LOVABLE_API_KEY="..."
```

### **Providers IA Supportés**
- 🤖 **OpenAI GPT-4 Vision** : Meilleure qualité
- 🧠 **DeepSeek Chat** : Rapide et économique
- 🎯 **Claude 3 Sonnet** : Raisonnement avancé
- ⚡ **Gemini 1.5 Pro** : Réflexion profonde
- 🔄 **Lovable Gateway** : Fallback automatique

---

## 🎯 **Fonctionnalités Détaillées**

### 🖼️ **OCR Multi-Images**
- **Capacité** : 25 images simultanées
- **Technologie** : Tesseract.js client-side
- **Confiance** : Affichage du taux de confiance
- **Intégration** : Traitement invisible pour l'utilisateur

### 🎯 **QCM Surlignage**
- **Automatique** : Détection des QCM dans les images
- **Surlignage** : Réponses en jaune vif
- **Format** : `<span style="background-color: yellow;">Réponse</span>`
- **Responsive** : Visible sur tous les écrans

### 🫁 **Atlas 3D Anatomique**
- **Modèles** : Cœur, cerveau, poumons, foie, estomac, reins
- **Animations** : Battements cardiaques, respiration, activité cérébrale
- **Interactions** : Sélection d'organes avec surbrillance
- **Performance** : 60 FPS avec WebGL

### 👨‍💻 **Information Créateur**
- **Nom** : Ivane Beranger Kouassi
- **Agence** : EBuni Studio Medical Digital Solution
- **Compétences** : Graphiste, designer, développeur, IA certifié
- **Style** : Réponses variées mais cohérentes

---

## 📱 **Utilisation**

### **Interface Principale**
1. **Mode** : Choisir entre Médecine et Informatique
2. **Upload** : Ajouter jusqu'à 25 images ou PDF
3. **Question** : Poser une question ou coller du texte
4. **Réponse** : Obtenir une réponse ultra-rapide avec surlignage

### **Atlas 3D**
1. **Activation** : Cliquer sur "Atlas 3D" (mode médecine)
2. **Navigation** : Rotation avec la souris/tactile
3. **Sélection** : Cliquer sur un organe pour le voir en détail
4. **Animation** : Observer les animations physiologiques

### **QCM**
1. **Upload** : Ajouter une image de QCM
2. **OCR** : Traitement automatique invisible
3. **Réponse** : Solutions surlignées en jaune
4. **Explication** : Réponse concise avec source

---

## 🏗️ **Architecture Technique**

### **Frontend**
- **Framework** : React 18 + TypeScript
- **Styling** : TailwindCSS + shadcn/ui
- **State** : React Query + Zustand
- **3D** : Three.js + React Three Fiber
- **OCR** : Tesseract.js client-side

### **Backend**
- **Platform** : Supabase Edge Functions
- **Database** : PostgreSQL (Supabase)
- **Auth** : Supabase Auth
- **Storage** : Supabase Storage
- **Functions** : Deno runtime

### **Performance**
- **Build** : Vite + SWC
- **Bundle** : 973 kB (gzipped: 278 kB)
- **Loading** : < 3 secondes First Contentful Paint
- **Response** : < 8 secondes IA response

---

## 🔍 **Tests et Qualité**

### **Tests Automatisés**
```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Linting
npm run lint

# Build test
npm run build
```

### **Performance**
- ✅ **Lighthouse** : 95+ score
- ✅ **Mobile Friendly** : Responsive design
- ✅ **Accessibility** : WCAG 2.1 AA
- ✅ **SEO** : Meta tags optimisés

---

## 📊 **Monitoring**

### **Analytics**
- **Frontend** : Vercel Analytics ou Google Analytics
- **Backend** : Supabase Logs
- **Performance** : Lighthouse CI
- **Errors** : Sentry (optionnel)

### **Métriques Clés**
- ⚡ **Response Time** : < 8 secondes
- 📦 **Success Rate** : > 95%
- 👥 **Active Users** : Dashboard analytics
- 🖼️ **OCR Processing** : < 2 secondes par image

---

## 🤝 **Contributions**

### **Développement**
```bash
# Fork le projet
git clone https://github.com/votre-username/genius-ai.git

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Commit et push
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite

# Pull request
```

### **Guidelines**
- 📝 **Code style** : ESLint + Prettier
- 🧪 **Tests** : Couverture > 80%
- 📚 **Documentation** : Comments JSDoc
- 🎨 **UI/UX** : Respect design system

---

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 **À Propos du Créateur**

**Ivane Beranger Kouassi** est un développeur passionné spécialisé dans :
- 🎨 **Design Graphique** : UI/UX moderne et accessible
- 💻 **Développement Web** : React, TypeScript, Node.js
- 🤖 **Intelligence Artificielle** : Certifié et expérimenté
- 🏥 **Solutions Médicales** : EBuni Studio Medical Digital Solution

### **Contact**
- 📧 **Email** : contact@ebuni-studio.com
- 🌐 **Web** : https://ebuni-studio.com
- 💼 **LinkedIn** : https://linkedin.com/in/ivane-beranger-kouassi
- 🐙 **GitHub** : https://github.com/ivanebk

---

## 🚀 **Déployez Genius AI Maintenant !**

**Votre assistant médical et informatique ultra-rapide est prêt à révolutionner l'apprentissage !**

```bash
# Déploiement en une seule commande
./QUICK_DEPLOY.sh
```

*Genius AI - Conçu avec passion par Ivane Beranger Kouassi* 🎨🤖

*EBuni Studio Medical Digital Solution* 🏢
