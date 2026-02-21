import { ArrowLeft, Menu, User, Settings } from "lucide-react";
import SlidingModeSelector from "@/components/SlidingModeSelector";

interface ChatGPTHeaderProps {
  mode: "medicine" | "informatique";
  onModeChange: (mode: "medicine" | "informatique") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  hasActiveConversation: boolean;
  onBackToHome: () => void;
}

const ChatGPTHeader = ({ 
  mode, 
  onModeChange, 
  sidebarOpen, 
  setSidebarOpen, 
  hasActiveConversation, 
  onBackToHome 
}: ChatGPTHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Menu and Back Arrow */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Back Arrow - Only when conversation is active */}
          {hasActiveConversation && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Retour</span>
            </button>
          )}
        </div>

        {/* Center - Logo and Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <img src="/LOGO.png" alt="Genius AI" className="w-6 h-6 rounded" />
          </div>
          <h1 className="text-lg font-bold">
            <span className="gradient-text">Genius</span>{" "}
            <span className="text-foreground">AI</span>
          </h1>
        </div>

        {/* Right - Profile and Settings */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mode Selector - Compact below header */}
      <div className="px-4 pb-3">
        <div className="max-w-3xl mx-auto">
          <SlidingModeSelector mode={mode} onModeChange={onModeChange} />
        </div>
      </div>
    </header>
  );
};

export default ChatGPTHeader;
