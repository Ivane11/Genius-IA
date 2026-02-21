import { Stethoscope, Code2 } from "lucide-react";

type Mode = "medicine" | "informatique";

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center glass rounded-full p-1 gap-1">
      <button
        onClick={() => onModeChange("medicine")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === "medicine"
            ? "bg-primary text-primary-foreground glow-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Stethoscope className="w-4 h-4" />
        Médecine
      </button>
      <button
        onClick={() => onModeChange("informatique")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          mode === "informatique"
            ? "bg-accent text-accent-foreground glow-accent"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Code2 className="w-4 h-4" />
        Informatique
      </button>
    </div>
  );
};

export default ModeToggle;
