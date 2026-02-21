import { useState, useRef, useCallback } from "react";
import { Send, ImagePlus, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CenteredChatInputProps {
  onSend: (message: string, images?: string[]) => void;
  isLoading: boolean;
  mode: "medicine" | "informatique";
}

interface ImagePreview {
  id: string;
  url: string;
  base64: string;
  name: string;
}

const CenteredChatInput = ({ onSend, isLoading, mode }: CenteredChatInputProps) => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 25) {
      alert(`Maximum 25 images autorisées. Vous avez sélectionné ${files.length} images.`);
      return;
    }

    const newImages: ImagePreview[] = files.map((file, index) => {
      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        setImages(prev => prev.map(img => 
          img.id === id ? { ...img, base64 } : img
        ));
      };
      
      reader.readAsDataURL(file);
      
      return {
        id,
        url,
        base64: "",
        name: file.name,
      };
    });

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handlePDFUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    alert('Traitement PDF: Cette fonctionnalité sera bientôt disponible. Pour l\'instant, veuillez convertir votre PDF en images.');
  }, []);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if ((!input.trim() && images.length === 0) || isLoading) return;

    const imageBase64s = images.map(img => img.base64).filter(Boolean);

    onSend(input.trim(), imageBase64s);
    setInput("");
    setImages([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, images, isLoading, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleTextareaInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, []);

  const accentColor = mode === "medicine" ? "primary" : "accent";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mb-3 p-3 rounded-xl bg-background/95 backdrop-blur-md border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <ImagePlus className="w-4 h-4" />
              <span>{images.length} image(s)</span>
            </div>
            <div className={`grid gap-2 ${
              images.length === 1 ? 'grid-cols-1' : 
              images.length <= 2 ? 'grid-cols-2' : 
              images.length <= 4 ? 'grid-cols-2' :
              images.length <= 6 ? 'grid-cols-3' :
              'grid-cols-4'
            }`}>
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="h-16 w-full object-cover rounded-lg border border-border/30" 
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Input - Centered with Enhanced Visibility */}
        <div className="p-3 rounded-xl bg-background/95 backdrop-blur-md border-border/50 shadow-lg">
          <div className="flex items-end gap-2">
            {/* Upload buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50 border border-border/30"
                title="Ajouter des images"
              >
                <ImagePlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => pdfRef.current?.click()}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50 border border-border/30"
                title="Ajouter un PDF"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={pdfRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePDFUpload}
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "medicine"
                  ? "Question médicale..."
                  : "Question informatique..."
              }
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground py-2"
            />

            {/* Send button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!input.trim() && images.length === 0)}
              size="sm"
              className={accentColor === "primary" ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" : "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredChatInput;
