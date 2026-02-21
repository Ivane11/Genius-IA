import { useState, useRef } from "react";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, imageBase64?: string) => void;
  isLoading: boolean;
  mode: "medicine" | "informatique";
}

const ChatInput = ({ onSend, isLoading, mode }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if ((!input.trim() && !imageBase64) || isLoading) return;
    onSend(input.trim(), imageBase64 || undefined);
    setInput("");
    setImagePreview(null);
    setImageBase64(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 150) + "px";
    }
  };

  const accentColor = mode === "medicine" ? "primary" : "accent";

  return (
    <div className="p-4">
      <div className="glass-strong rounded-2xl p-3 max-w-3xl mx-auto">
        {imagePreview && (
          <div className="relative inline-block mb-2">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-border/30" />
            <button
              onClick={() => { setImagePreview(null); setImageBase64(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "medicine"
                ? "Posez une question médicale, collez un QCM..."
                : "Collez du code, posez une question technique..."
            }
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!input.trim() && !imageBase64)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isLoading || (!input.trim() && !imageBase64)
                ? "text-muted-foreground"
                : accentColor === "primary"
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-accent text-accent-foreground glow-accent"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
