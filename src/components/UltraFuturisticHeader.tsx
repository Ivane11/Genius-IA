import { ArrowLeft, Menu, Brain, Heart, Monitor, Sparkles } from "lucide-react";
import SlidingModeSelector from "@/components/SlidingModeSelector";

interface UltraFuturisticHeaderProps {
  mode: "medicine" | "informatique";
  onModeChange: (mode: "medicine" | "informatique") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  hasActiveConversation: boolean;
  onBackToHome: () => void;
}

const UltraFuturisticHeader = ({ 
  mode, 
  onModeChange, 
  sidebarOpen, 
  setSidebarOpen, 
  hasActiveConversation, 
  onBackToHome 
}: UltraFuturisticHeaderProps) => {
  return (
    <header className="relative z-50 glass-morphism-ultra border-b border-white/10 dark:border-white/5">
      {/* Glow effect behind header */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Menu Button - Always visible */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl glass-morphism hover:bg-white/10 dark:hover:bg-white/5 text-white/80 hover:text-white transition-all duration-300 border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back Button - Only when conversation is active */}
          {hasActiveConversation && (
            <button
              onClick={onBackToHome}
              className="p-2.5 rounded-xl glass-morphism hover:bg-white/10 dark:hover:bg-white/5 text-white/80 hover:text-white transition-all duration-300 border border-white/10 animate-slide-up"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center - Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 blur-xl animate-pulse-glow" />
            <img src="/LOGO.png" alt="Genius AI" className="w-7 h-7 rounded-xl relative z-10" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">
              <span className="gradient-text-ultra">Genius</span>{" "}
              <span className="text-white/90">AI</span>
            </h1>
            <p className="text-xs text-white/60">Assistant IA Expert</p>
          </div>
        </div>

        {/* Right Section - Mode Selector */}
        <div className="hidden md:block">
          <SlidingModeSelector mode={mode} onModeChange={onModeChange} />
        </div>
      </div>
      
      {/* Mobile Mode Selector */}
      <div className="md:hidden px-6 pb-4">
        <SlidingModeSelector mode={mode} onModeChange={onModeChange} />
      </div>
    </header>
  );
};

export default UltraFuturisticHeader;
