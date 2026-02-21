import { ArrowLeft, Menu, User, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import SlidingModeSelector from "@/components/SlidingModeSelector";

interface CleanHeaderProps {
  mode: "medicine" | "informatique";
  onModeChange: (mode: "medicine" | "informatique") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  hasActiveConversation: boolean;
  onBackToHome: () => void;
}

const CleanHeader = ({ 
  mode, 
  onModeChange, 
  sidebarOpen, 
  setSidebarOpen, 
  hasActiveConversation, 
  onBackToHome 
}: CleanHeaderProps) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/10">
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
              <span className="text-sm font-semibold hidden sm:inline">Retour</span>
            </button>
          )}
        </div>

        {/* Center - Logo and Name - Perfectly Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <img src="/LOGO.png" alt="Genius AI" className="w-6 h-6 rounded" />
          </div>
          <h1 className="text-xl font-black">
            <span className="gradient-text font-black">Genius</span>{" "}
            <span className="text-foreground font-black">AI</span>
          </h1>
        </div>

        {/* Right - Profile and Dark Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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

export default CleanHeader;
