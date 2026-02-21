import { Heart, Brain, Stethoscope, Monitor, Code, FileText, Activity, Zap, ArrowRight } from "lucide-react";

type Mode = "medicine" | "informatique";

interface NeonSuggestionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  mode: Mode;
}

const NeonSuggestionCard = ({ title, description, icon, onClick, mode }: NeonSuggestionCardProps) => {
  const getNeonBorder = () => {
    if (mode === "medicine") {
      return "border-blue-500/50 shadow-lg shadow-blue-500/25 hover:border-blue-500 hover:shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/40";
    } else {
      return "border-purple-500/50 shadow-lg shadow-purple-500/25 hover:border-purple-500 hover:shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/40";
    }
  };

  const getNeonBg = () => {
    if (mode === "medicine") {
      return "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20";
    } else {
      return "bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20";
    }
  };

  const getIconBg = () => {
    if (mode === "medicine") {
      return "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25";
    } else {
      return "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-xl backdrop-blur-md border-2 transition-all duration-300 transform hover:scale-105 ${getNeonBorder()} ${getNeonBg()}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${getIconBg()} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-sm text-foreground mb-1 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs font-semibold text-muted-foreground line-clamp-1">
              {description}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </button>
  );
};

interface NeonSuggestionGridProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const NeonSuggestionGrid = ({ mode, onSuggestionClick }: NeonSuggestionGridProps) => {
  const medicineSuggestions = [
    {
      title: "Signes AVC",
      description: "Symptômes d'alerte immédiats",
      icon: <Brain className="w-4 h-4" />,
      query: "Quels sont les signes d'un AVC ?"
    },
    {
      title: "QCM Pharma",
      description: "Analyse pharmacologique",
      icon: <FileText className="w-4 h-4" />,
      query: "Analysez ce QCM de pharmacologie"
    },
    {
      title: "Cycle Krebs",
      description: "Cycle métabolique énergétique",
      icon: <Activity className="w-4 h-4" />,
      query: "Expliquez le cycle de Krebs"
    },
    {
      title: "Douleur Thoracique",
      description: "Diagnostic différentiel",
      icon: <Heart className="w-4 h-4" />,
      query: "Diagnostic différentiel d'une douleur thoracique"
    }
  ];

  const informatiqueSuggestions = [
    {
      title: "Python Debug",
      description: "Correction de code Python",
      icon: <Code className="w-4 h-4" />,
      query: "Corrigez ce code Python"
    },
    {
      title: "Complexité",
      description: "Analyse Quicksort",
      icon: <Zap className="w-4 h-4" />,
      query: "Expliquez la complexité de quicksort"
    },
    {
      title: "TCP vs UDP",
      description: "Protocoles réseau",
      icon: <Monitor className="w-4 h-4" />,
      query: "Différence entre TCP et UDP"
    },
    {
      title: "QCM SQL",
      description: "Bases de données",
      icon: <FileText className="w-4 h-4" />,
      query: "QCM sur les bases de données SQL"
    }
  ];

  const suggestions = mode === "medicine" ? medicineSuggestions : informatiqueSuggestions;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <NeonSuggestionCard
            key={index}
            title={suggestion.title}
            description={suggestion.description}
            icon={suggestion.icon}
            onClick={() => onSuggestionClick(suggestion.query)}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};

export default NeonSuggestionGrid;
