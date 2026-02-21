import { Stethoscope, Code2 } from "lucide-react";

type Mode = "medicine" | "informatique";

interface SlidingModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const SlidingModeSelector = ({ mode, onModeChange }: SlidingModeSelectorProps) => {
  return (
    <div className="relative inline-flex items-center glass-morphism rounded-2xl p-1.5 bg-background/80 backdrop-blur-xl border border-border/20">
      {/* Sliding background */}
      <div 
        className={`absolute top-1.5 left-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-out ${
          mode === "medicine" 
            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-200/30" 
            : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-200/30 translate-x-full"
        }`}
      />
      
      {/* Medicine button */}
      <button
        onClick={() => onModeChange("medicine")}
        className={`relative z-10 flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          mode === "medicine"
            ? "text-blue-700 dark:text-blue-300"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Stethoscope className={`w-4.5 h-4.5 transition-all duration-300 ${
          mode === "medicine" ? "text-blue-600 dark:text-blue-400" : ""
        }`} />
        <span className="relative">Médecine</span>
      </button>
      
      {/* Informatique button */}
      <button
        onClick={() => onModeChange("informatique")}
        className={`relative z-10 flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          mode === "informatique"
            ? "text-purple-700 dark:text-purple-300"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Code2 className={`w-4.5 h-4.5 transition-all duration-300 ${
          mode === "informatique" ? "text-purple-600 dark:text-purple-400" : ""
        }`} />
        <span className="relative">Informatique</span>
      </button>
    </div>
  );
};

export default SlidingModeSelector;
