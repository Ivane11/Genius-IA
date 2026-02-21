import { useState, useRef, useCallback } from "react";
import { Send, ImagePlus, X, Loader2, FileText, Zap, CheckCircle, Mic } from "lucide-react";
import { ocrService, OCRResult } from "@/lib/ocr";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FloatingChatInputProps {
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

const FloatingChatInput = ({ onSend, isLoading, mode }: FloatingChatInputProps) => {
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

      if (ocrService.detectQCMFormat(result.text)) {
        const questions = ocrService.extractQuestions(result.text);
        if (questions.length > 0) {
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
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, []);

  const accentColor = mode === "medicine" ? "primary" : "accent";

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="max-w-4xl mx-auto">
        {/* Image Previews - Floating above input */}
        {images.length > 0 && (
          <div className="mb-3 glass-morphism rounded-2xl p-4 border border-border/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
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
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                  {image.isProcessingOCR && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>
                  )}
                  {image.ocrResult && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
                      {Math.round(image.ocrResult.confidence)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Input - Glassmorphism floating design */}
        <div className="glass-morphism rounded-3xl p-4 bg-background/90 backdrop-blur-2xl border border-border/20 shadow-2xl">
          <div className="flex items-end gap-3">
            {/* Left side - Upload buttons */}
            <div className="flex gap-1.5">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-secondary/50"
                title="Ajouter des images"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => pdfRef.current?.click()}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-secondary/50"
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

            {/* Textarea - Expanded */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "medicine"
                  ? "Posez votre question médicale..."
                  : "Posez votre question informatique..."
              }
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-base text-foreground placeholder:text-muted-foreground py-2.5 leading-relaxed"
            />

            {/* Send button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!input.trim() && images.length === 0)}
              size="lg"
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                accentColor === "primary" 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl" 
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* OCR Status - More subtle */}
          {images.some(img => img.ocrResult) && (
            <div className="mt-2 text-xs text-muted-foreground/70 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>OCR traité automatiquement</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingChatInput;
