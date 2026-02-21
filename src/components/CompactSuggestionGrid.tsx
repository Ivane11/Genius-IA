import { Heart, Brain, Stethoscope, Monitor, Code, FileText, Activity, Zap, ArrowRight } from "lucide-react";

type Mode = "medicine" | "informatique";

interface CompactSuggestionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  mode: Mode;
}

const CompactSuggestionCard = ({ title, description, icon, onClick, mode }: CompactSuggestionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card/80 hover:border-border/50 transition-all duration-200 text-left group"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          mode === "medicine" 
            ? "bg-primary/10 text-primary" 
            : "bg-accent/10 text-accent"
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
};

interface CompactSuggestionGridProps {
  mode: Mode;
  onSuggestionClick: (suggestion: string) => void;
}

const CompactSuggestionGrid = ({ mode, onSuggestionClick }: CompactSuggestionGridProps) => {
  const medicineSuggestions = [
    {
      title: "Signes de l'AVC",
      description: "Symptômes et signes d'alerte immédiats",
      icon: <Brain className="w-4 h-4" />,
      query: "Quels sont les signes d'un AVC ?"
    },
    {
      title: "QCM Pharmacologie",
      description: "Analyse de questions pharmacologiques",
      icon: <FileText className="w-4 h-4" />,
      query: "Analysez ce QCM de pharmacologie"
    },
    {
      title: "Cycle de Krebs",
      description: "Explication du cycle métabolique",
      icon: <Activity className="w-4 h-4" />,
      query: "Expliquez le cycle de Krebs"
    },
    {
      title: "Douleur thoracique",
      description: "Diagnostic différentiel clinique",
      icon: <Heart className="w-4 h-4" />,
      query: "Diagnostic différentiel d'une douleur thoracique"
    }
  ];

  const informatiqueSuggestions = [
    {
      title: "Correction Python",
      description: "Analyse et correction de code",
      icon: <Code className="w-4 h-4" />,
      query: "Corrigez ce code Python"
    },
    {
      title: "Complexité Quicksort",
      description: "Analyse de complexité détaillée",
      icon: <Zap className="w-4 h-4" />,
      query: "Expliquez la complexité de quicksort"
    },
    {
      title: "TCP vs UDP",
      description: "Différences et cas d'usage",
      icon: <Monitor className="w-4 h-4" />,
      query: "Différence entre TCP et UDP"
    },
    {
      title: "QCM Bases SQL",
      description: "Test de connaissances SQL",
      icon: <FileText className="w-4 h-4" />,
      query: "QCM sur les bases de données SQL"
    }
  ];

  const suggestions = mode === "medicine" ? medicineSuggestions : informatiqueSuggestions;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <CompactSuggestionCard
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

export default CompactSuggestionGrid;
