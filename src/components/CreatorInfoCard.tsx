import { User, Mail, Github, Linkedin, Award, Code } from "lucide-react";

interface CreatorInfoCardProps {
  className?: string;
}

const CreatorInfoCard = ({ className }: CreatorInfoCardProps) => {
  return (
    <div className={`p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Ivane Beranger Kouassi</h3>
          <p className="text-sm text-muted-foreground">Développeur & Architecte IA</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Expert en intelligence artificielle médicale et développement d'applications innovantes. 
          Spécialisé dans la création d'assistants IA experts pour le domaine de la santé.
        </p>
      </div>

      {/* Expertise */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Domaines d'expertise
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-3 h-3 text-primary" />
            <span>Intelligence Artificielle</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-3 h-3 text-primary" />
            <span>Médecine Digitale</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-3 h-3 text-primary" />
            <span>React & TypeScript</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-3 h-3 text-primary" />
            <span>UI/UX Design</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Contact & Réseaux</h4>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Github className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Linkedin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorInfoCard;
