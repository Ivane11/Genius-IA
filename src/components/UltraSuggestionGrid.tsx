import { Heart, Brain, Stethoscope, Monitor, Code, FileText, Activity, Zap, ArrowRight } from "lucide-react";

type Mode = "medicine" | "informatique";

interface UltraSuggestionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  mode: Mode;
  delay?: number;
}

const UltraSuggestionCard = ({ title, description, icon, onClick, mode, delay = 0 }: UltraSuggestionCardProps) => {
  const gradientColors = mode === "medicine" 
    ? "from-blue-600/20 via-cyan-500/20 to-blue-600/20 hover:from-blue-500/30 hover:via-cyan-400/30 hover:to-blue-500/30 border-blue-400/20 hover:border-blue-400/40"
    : "from-purple-600/20 via-pink-500/20 to-purple-600/20 hover:from-purple-500/30 hover:via-pink-400/30 hover:to-purple-500/30 border-purple-400/20 hover:border-purple-400/40";

  const glowColor = mode === "medicine" 
    ? "shadow-blue-500/20 hover:shadow-blue-500/40" 
    : "shadow-purple-500/20 hover:shadow-purple-500/40";

  return (
    <button
      onClick={onClick}
      className={`group relative w-full p-5 rounded-3xl glass-morphism-ultra border border-white/10 transition-all duration-500 hover:scale-[1.03] ${glowColor} animate-float`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-3xl ${mode === "medicine" ? 'bg-blue-400/5' : 'bg-purple-400/5'} blur-xl group-hover:blur-2xl transition-all duration-300`} />
      
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon container with neon effect */}
        <div className={`p-3 rounded-2xl ${
          mode === "medicine" 
            ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-blue-500/50 shadow-lg" 
            : "bg-gradient-to-br from-purple-500 to-pink-400 text-white shadow-purple-500/50 shadow-lg"
        } relative overflow-hidden`}>
          {/* Neon glow */}
          <div className={`absolute inset-0 ${mode === "medicine" ? "bg-blue-400" : "bg-purple-400"} blur-lg opacity-50 animate-pulse`} />
          <div className="relative z-10">
            {icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-white/90 transition-colors flex items-center gap-2">
            {title}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
          </h3>
          {description && (
            <p className="text-white/70 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none">
        <div className={`absolute inset-0 rounded-3xl border ${mode === "medicine" ? "border-blue-400/20" : "border-purple-400/20"} animate-pulse`} />
      </div>
    </button>
  );
};

interface UltraSuggestionGridProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const UltraSuggestionGrid = ({ mode, onSuggestionClick }: UltraSuggestionGridProps) => {
  const medicineSuggestions = [
    {
      title: "Signes de l'AVC",
      description: "Quels sont les symptômes et les signes d'alerte immédiats ?",
      icon: <Brain className="w-6 h-6" />,
      query: "Quels sont les signes d'un AVC ?"
    },
    {
      title: "QCM Pharmacologie",
      description: "Analysez et résolvez des questions complexes de pharmacologie",
      icon: <FileText className="w-6 h-6" />,
      query: "Analysez ce QCM de pharmacologie"
    },
    {
      title: "Cycle de Krebs",
      description: "Explication détaillée du cycle métabolique énergétique",
      icon: <Activity className="w-6 h-6" />,
      query: "Expliquez le cycle de Krebs"
    },
    {
      title: "Douleur thoracique",
      description: "Diagnostic différentiel complet et approche clinique",
      icon: <Heart className="w-6 h-6" />,
      query: "Diagnostic différentiel d'une douleur thoracique"
    }
  ];

  const informatiqueSuggestions = [
    {
      title: "Correction Python",
      description: "Analysez et corrigez du code Python avec optimisation",
      icon: <Code className="w-6 h-6" />,
      query: "Corrigez ce code Python"
    },
    {
      title: "Complexité Quicksort",
      description: "Analyse de complexité temporelle et spatiale détaillée",
      icon: <Zap className="w-6 h-6" />,
      query: "Expliquez la complexité de quicksort"
    },
    {
      title: "TCP vs UDP",
      description: "Différences fondamentales et cas d'usage pratiques",
      icon: <Monitor className="w-6 h-6" />,
      query: "Différence entre TCP et UDP"
    },
    {
      title: "QCM Bases SQL",
      description: "Testez vos connaissances avancées en bases de données",
      icon: <FileText className="w-6 h-6" />,
      query: "QCM sur les bases de données SQL"
    }
  ];

  const suggestions = mode === "medicine" ? medicineSuggestions : informatiqueSuggestions;

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-morphism-ultra border border-white/10 mb-4">
          {mode === "medicine" ? (
            <>
              <Heart className="w-6 h-6 text-red-400" />
              <span className="text-white font-semibold">Médecine Avancée</span>
            </>
          ) : (
            <>
              <Monitor className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Informatique Expert</span>
            </>
          )}
        </div>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Choisissez une suggestion ou posez votre propre question pour commencer
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {suggestions.map((suggestion, index) => (
          <UltraSuggestionCard
            key={index}
            title={suggestion.title}
            description={suggestion.description}
            icon={suggestion.icon}
            onClick={() => onSuggestionClick(suggestion.query)}
            mode={mode}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
};

export default UltraSuggestionGrid;
