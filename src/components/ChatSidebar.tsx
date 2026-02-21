import { Plus, MessageSquare, Trash2, User, Mail, Github, Linkedin, Award, Code, Info } from "lucide-react";

export interface Conversation {
  id: string;
  title: string;
  mode: "medicine" | "informatique";
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
}

const ChatSidebar = ({ conversations, activeId, onSelect, onNew, onDelete, isOpen }: ChatSidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xl z-40 sm:hidden" />
      
      <div className="w-80 h-full flex flex-col bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-50 transform transition-transform duration-300 sm:relative sm:transform-none">
        {/* New Conversation Button */}
        <div className="p-4">
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                activeId === conv.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Creator Info Section */}
        <div className="border-t border-sidebar-border">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-sidebar-foreground">Ivane Beranger Kouassi</h3>
                <p className="text-xs font-semibold text-muted-foreground">Développeur & Architecte IA</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-4 border-b border-sidebar-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Expert en intelligence artificielle médicale et développement d'applications innovantes. Spécialisé dans la création d'assistants IA experts pour le domaine de la santé.
            </p>
          </div>

          {/* Expertise */}
          <div className="p-4 border-b border-sidebar-border">
            <h4 className="text-xs font-black text-sidebar-foreground mb-3 flex items-center gap-2">
              <Award className="w-3 h-3 text-primary" />
              Domaines d'expertise
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code className="w-3 h-3 text-primary" />
                <span>Intelligence Artificielle</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code className="w-3 h-3 text-primary" />
                <span>Médecine Digitale</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code className="w-3 h-3 text-primary" />
                <span>React & TypeScript</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code className="w-3 h-3 text-primary" />
                <span>UI/UX Design</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-4 border-b border-sidebar-border">
            <h4 className="text-xs font-semibold text-sidebar-foreground mb-3">Contact & Réseaux</h4>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Mail className="w-3 h-3" />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Github className="w-3 h-3" />
              </button>
              <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Linkedin className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <img src="/LOGO.png" alt="Genius AI" className="w-6 h-6 rounded-full" />
              </div>
              <div>
                <span className="text-xs font-black text-sidebar-foreground block">Genius AI</span>
                <span className="text-[10px] font-semibold text-muted-foreground">Assistant IA Expert</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
