import { useState, useRef, useCallback } from "react";
import { Send, ImagePlus, X, Loader2, FileText, Zap, CheckCircle } from "lucide-react";
import { ocrService, OCRResult } from "@/lib/ocr";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ChatInputProps {
  onSend: (message: string, images?: string[], ocrResults?: OCRResult[]) => void;
  isLoading: boolean;
  mode: "medicine" | "informatique";
}

interface ImagePreview {
  id: string;
  url: string;
  base64: string;
  name: string;
  ocrResult?: OCRResult;
  isProcessingOCR?: boolean;
}

const EnhancedChatInput = ({ onSend, isLoading, mode }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limite de 25 images
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
        
        // Auto-process OCR for images
        processOCR(id, base64);
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

  const processOCR = async (imageId: string, base64: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isProcessingOCR: true } : img
    ));

    try {
      const result = await ocrService.extractTextFromImage(base64);
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { 
          ...img, 
          ocrResult: result,
          isProcessingOCR: false 
        } : img
      ));

      // Auto-detect QCM format but DON'T add to input automatically
      if (ocrService.detectQCMFormat(result.text)) {
        const questions = ocrService.extractQuestions(result.text);
        if (questions.length > 0) {
          // Ne PAS ajouter automatiquement à l'input
          // L'utilisateur verra seulement l'image et l'IA traitera en arrière-plan
          console.log('QCM détecté dans l\'image, traitement ultra-rapide en arrière-plan...');
        }
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      setImages(prev => prev.map(img => 
        img.id === imageId ? { 
          ...img, 
          isProcessingOCR: false 
        } : img
      ));
    }
  };

  const handlePDFUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    // For PDF processing, we'd need a server-side solution
    // For now, show a message
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
    const ocrResults = images.map(img => img.ocrResult).filter(Boolean) as OCRResult[];

    onSend(input.trim(), imageBase64s, ocrResults);
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
      el.style.height = Math.min(el.scrollHeight, 150) + "px";
    }
  }, []);

  const accentColor = mode === "medicine" ? "primary" : "accent";

  return (
    <div className="p-4">
      <div className="glass-strong rounded-2xl p-3 max-w-3xl mx-auto">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="w-4 h-4" />
              <span>{images.length} image(s) téléchargée(s)</span>
              {images.some(img => img.ocrResult) && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  OCR traité
                </Badge>
              )}
            </div>
            <div className={`grid gap-2 ${
              images.length === 1 ? 'grid-cols-1' : 
              images.length === 2 ? 'grid-cols-2' : 
              images.length <= 4 ? 'grid-cols-2' :
              images.length <= 6 ? 'grid-cols-3' :
              images.length <= 9 ? 'grid-cols-3' :
              images.length <= 12 ? 'grid-cols-4' :
              'grid-cols-5'
            }`}>
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="h-20 w-full object-cover rounded-lg border border-border/30" 
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {image.isProcessingOCR && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                        <p className="text-white text-sm font-medium">OCR Ultra-Rapide...</p>
                        <p className="text-white/70 text-xs">Traitement intelligent en cours</p>
                      </div>
                    </div>
                  )}
                  {image.ocrResult && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
                      {Math.round(image.ocrResult.confidence)}% confiance
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OCR Progress */}
        {isProcessingOCR && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Zap className="w-4 h-4" />
              <span>Analyse OCR en cours...</span>
            </div>
            <Progress value={ocrProgress} className="h-2" />
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              title="Ajouter des images"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => pdfRef.current?.click()}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              title="Ajouter un PDF"
            >
              <FileText className="w-5 h-5" />
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

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "medicine"
                ? "Question médicale ? Réponse ultra-rapide garantie..."
                : "Code informatique ? Réponse ultra-rapide garantie..."
            }
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading || (!input.trim() && images.length === 0)}
            size="sm"
            className={accentColor === "primary" ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90"}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* OCR Results Summary - plus discret */}
        {images.some(img => img.ocrResult) && (
          <div className="mt-2 text-xs text-muted-foreground opacity-70">
            <Zap className="w-3 h-3 inline mr-1" />
            OCR traité en arrière-plan (non affiché)
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedChatInput;
