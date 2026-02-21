import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export class OCRService {
  private static instance: OCRService;
  private worker: Tesseract.Worker | null = null;

  static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  async initializeWorker(): Promise<void> {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('fra+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
    }
  }

  async extractTextFromImage(imageData: string): Promise<OCRResult> {
    await this.initializeWorker();
    
    try {
      const { data } = await this.worker!.recognize(imageData);
      
      return {
        text: data.text,
        confidence: data.confidence,
        words: (data as any).words?.map((word: any) => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox,
        })),
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Erreur lors de l\'extraction du texte de l\'image');
    }
  }

  async extractTextFromMultipleImages(images: string[]): Promise<OCRResult[]> {
    const results: OCRResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await this.extractTextFromImage(images[i]);
        results.push({
          ...result,
          text: `Question ${i + 1}:\n${result.text}`,
        });
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
        results.push({
          text: `Question ${i + 1}:\n[Erreur d'OCR]`,
          confidence: 0,
        });
      }
    }
    
    return results;
  }

  detectQCMFormat(text: string): boolean {
    const qcmPatterns = [
      /\b[ABCD]\)\s*/g,
      /\b[ABCD]\.\s*/g,
      /\b[ABCD]-\s*/g,
      /\b\d+\)\s*[ABCD]\)/g,
      /\bQuelle\s+est\s+la\s+réponse/gi,
      /\bCocher\s+la\s+bonne\s+réponse/gi,
    ];
    
    return qcmPatterns.some(pattern => pattern.test(text));
  }

  extractQuestions(text: string): string[] {
    const questions: string[] = [];
    
    // Split by common question delimiters
    const questionDelimiters = [
      /\d+\.\s+/g,
      /\d+\)\s+/g,
      /Question\s+\d+/gi,
      /Q\d+\s*[:.]/gi,
    ];
    
    let parts = [text];
    
    for (const delimiter of questionDelimiters) {
      const newParts: string[] = [];
      for (const part of parts) {
        const split = part.split(delimiter);
        if (split.length > 1) {
          // Remove empty first element and add delimiter back
          split.shift();
          newParts.push(...split.map(s => s.trim()));
        } else {
          newParts.push(part);
        }
      }
      parts = newParts;
    }
    
    return parts.filter(p => p.length > 10);
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = OCRService.getInstance();
