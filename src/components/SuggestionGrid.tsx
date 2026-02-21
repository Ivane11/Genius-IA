import { Heart, Brain, Stethoscope, Monitor, Code, FileText, Activity, Zap } from "lucide-react";

type Mode = "medicine" | "informatique";

interface SuggestionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  mode: Mode;
}

const SuggestionCard = ({ title, description, icon, onClick, mode }: SuggestionCardProps) => {
  const gradientColors = mode === "medicine" 
    ? "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-200/30 hover:border-blue-300/50"
    : "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-200/30 hover:border-purple-300/50";

  return (
    <button
      onClick={onClick}
      className={`group relative w-full p-4 rounded-2xl bg-gradient-to-br ${gradientColors} border border-border/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-left`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${
          mode === "medicine" 
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
            : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

interface SuggestionGridProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionGrid = ({ mode, onSuggestionClick }: SuggestionGridProps) => {
  const medicineSuggestions = [
    {
      title: "Signes de l'AVC",
      description: "Quels sont les symptômes et les signes d'alerte ?",
      icon: <Brain className="w-5 h-5" />,
      query: "Quels sont les signes d'un AVC ?"
    },
    {
      title: "QCM Pharmacologie",
      description: "Analysez et résolvez des questions de pharmacologie",
      icon: <FileText className="w-5 h-5" />,
      query: "Analysez ce QCM de pharmacologie"
    },
    {
      title: "Cycle de Krebs",
      description: "Explication détaillée du cycle métabolique",
      icon: <Activity className="w-5 h-5" />,
      query: "Expliquez le cycle de Krebs"
    },
    {
      title: "Douleur thoracique",
      description: "Diagnostic différentiel et approche clinique",
      icon: <Heart className="w-5 h-5" />,
      query: "Diagnostic différentiel d'une douleur thoracique"
    }
  ];

  const informatiqueSuggestions = [
    {
      title: "Correction Python",
      description: "Analysez et corrigez du code Python",
      icon: <Code className="w-5 h-5" />,
      query: "Corrigez ce code Python"
    },
    {
      title: "Complexité Quicksort",
      description: "Analyse de complexité et optimisation",
      icon: <Zap className="w-5 h-5" />,
      query: "Expliquez la complexité de quicksort"
    },
    {
      title: "TCP vs UDP",
      description: "Différences et cas d'usage des protocoles",
      icon: <Monitor className="w-5 h-5" />,
      query: "Différence entre TCP et UDP"
    },
    {
      title: "QCM Bases SQL",
      description: "Testez vos connaissances en bases de données",
      icon: <FileText className="w-5 h-5" />,
      query: "QCM sur les bases de données SQL"
    }
  ];

  const suggestions = mode === "medicine" ? medicineSuggestions : informatiqueSuggestions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-4xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <SuggestionCard
          key={index}
          title={suggestion.title}
          description={suggestion.description}
          icon={suggestion.icon}
          onClick={() => onSuggestionClick(suggestion.query)}
          mode={mode}
        />
      ))}
    </div>
  );
};

export default SuggestionGrid;
