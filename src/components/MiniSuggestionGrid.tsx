import { Heart, Brain, Stethoscope, Monitor, Code, FileText, Activity, Zap, ArrowRight } from "lucide-react";

type Mode = "medicine" | "informatique";

interface MiniSuggestionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  mode: Mode;
}

const MiniSuggestionCard = ({ title, description, icon, onClick, mode }: MiniSuggestionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-lg bg-card/70 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:border-border/70 transition-all duration-200 text-left group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          mode === "medicine" 
            ? "bg-primary/20 text-primary border border-primary/30" 
            : "bg-accent/20 text-accent border border-accent/30"
        } flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
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

interface MiniSuggestionGridProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const MiniSuggestionGrid = ({ mode, onSuggestionClick }: MiniSuggestionGridProps) => {
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
          <MiniSuggestionCard
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

export default MiniSuggestionGrid;
