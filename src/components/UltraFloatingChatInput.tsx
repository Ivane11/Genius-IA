import { useState, useRef, useCallback } from "react";
import { Send, ImagePlus, X, Loader2, FileText, Zap, CheckCircle, Mic } from "lucide-react";
import { ocrService, OCRResult } from "@/lib/ocr";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UltraFloatingChatInputProps {
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

const UltraFloatingChatInput = ({ onSend, isLoading, mode }: UltraFloatingChatInputProps) => {
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

  const accentGradient = mode === "medicine" 
    ? "from-blue-500 via-cyan-400 to-blue-500" 
    : "from-purple-500 via-pink-400 to-purple-500";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-6 pb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Image Previews - Floating above input */}
        {images.length > 0 && (
          <div className="mb-4 glass-morphism-ultra rounded-3xl p-5 border border-white/10 transform -translate-y-2">
            <div className="flex items-center gap-3 text-white/80 text-sm mb-4">
              <ImagePlus className="w-5 h-5" />
              <span>{images.length} image(s) téléchargée(s)</span>
              {images.some(img => img.ocrResult) && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  OCR traité
                </Badge>
              )}
            </div>
            <div className={`grid gap-3 ${
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
                    className="h-20 w-full object-cover rounded-2xl border border-white/10" 
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {image.isProcessingOCR && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mb-2"></div>
                        <p className="text-white text-xs font-medium">OCR...</p>
                      </div>
                    </div>
                  )}
                  {image.ocrResult && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 rounded-b-2xl backdrop-blur-sm">
                      {Math.round(image.ocrResult.confidence)}% confiance
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Input - Ultra-futuristic glassmorphism */}
        <div className="glass-morphism-ultra rounded-3xl p-5 border border-white/10 relative overflow-hidden">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${accentGradient} opacity-10 blur-xl`} />
          
          <div className="relative z-10 flex items-end gap-4">
            {/* Left side - Upload buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-3 text-white/60 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10 border border-white/10"
                title="Ajouter des images"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => pdfRef.current?.click()}
                className="p-3 text-white/60 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10 border border-white/10"
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

            {/* Textarea */}
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
              className="flex-1 bg-transparent resize-none outline-none text-base text-white placeholder:text-white/40 py-3 leading-relaxed"
            />

            {/* Send button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (!input.trim() && images.length === 0)}
              size="lg"
              className={`px-6 py-4 rounded-2xl transition-all duration-300 bg-gradient-to-r ${accentGradient} hover:scale-105 text-white border-0 shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* OCR Status */}
          {images.some(img => img.ocrResult) && (
            <div className="mt-3 text-xs text-white/50 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>OCR traité automatiquement avec intelligence artificielle</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltraFloatingChatInput;
