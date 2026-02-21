import { useState, useCallback } from "react";
import { OCRResult } from "@/lib/ocr";

type Mode = "medicine" | "informatique";

export interface Message {
  role: "user" | "assistant";
  content: string;
  images?: string[];
  ocrResults?: OCRResult[];
  imageUrl?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat(mode: Mode) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(
    async (content: string, images?: string[], ocrResults?: OCRResult[]) => {
      // Ne PAS inclure les résultats OCR dans le contenu affiché
      // L'OCR est utilisé seulement pour l'analyse IA en arrière-plan
      const userMsg: Message = {
        role: "user",
        content: content, // Contenu original de l'utilisateur uniquement
        images,
        ocrResults, // Gardé pour référence mais non affiché
      };

      // Pour l'IA, inclure les résultats OCR mais ne pas les afficher à l'utilisateur
      let enhancedContent = content;
      
      if (ocrResults && ocrResults.length > 0) {
        const ocrText = ocrResults
          .map((result, index) => 
            `--- Question ${index + 1} (OCR ${Math.round(result.confidence)}%) ---\n${result.text}`
          )
          .join('\n\n');
        
        enhancedContent = content 
          ? `${content}\n\n${ocrText}`
          : ocrText;
      }

      // Create image URLs for display (use first image for backward compatibility)
      const imageUrl = images && images.length > 0 ? images[0] : undefined;

      const updatedMessages = [...messages, { ...userMsg, imageUrl }];
      setMessages(updatedMessages);
      setIsLoading(true);

      let assistantSoFar = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
              images: m.images,
              // For backward compatibility with the backend
              imageBase64: m.images?.[0],
            })),
            mode,
            enableCrossValidation: mode === "medicine",
            systemOverride: `RÉPONSES COURTES : Sois extrêmement concis. Réponds directement sans développement sauf si "développe" ou "explique en détail" est demandé. Format : Réponse directe + Certitude.`
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ error: "Erreur réseau" }));
          upsert(`⚠️ ${err.error || "Erreur du service"}`);
          setIsLoading(false);
          return;
        }

        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") break;
            try {
              const parsed = JSON.parse(json);
              const c = parsed.choices?.[0]?.delta?.content;
              if (c) upsert(c);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (e) {
        console.error(e);
        upsert("⚠️ Erreur de connexion. Réessayez.");
      }

      setIsLoading(false);
    },
    [messages, mode]
  );

  const reset = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, send, reset, setMessages };
}
