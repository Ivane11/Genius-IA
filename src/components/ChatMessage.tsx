import React from "react";
import { User, Bot, CheckCircle, Eye } from "lucide-react";
import HighlightedMarkdown from "./HighlightedMarkdown";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  mode: "medicine" | "informatique";
  imageUrl?: string;
  images?: string[];
}

const ChatMessage = ({ 
  role, 
  content, 
  mode, 
  imageUrl, 
  images = []
}: ChatMessageProps) => {
  const isUser = role === "user";
  
  // Use images array if available, fallback to single imageUrl
  const displayImages = images.length > 0 ? images : (imageUrl ? [imageUrl] : []);

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-secondary"
            : mode === "medicine"
            ? "bg-primary/20 text-primary"
            : "bg-accent/20 text-accent"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "glass-strong"
            : "bg-transparent"
        }`}
      >
        {/* Multiple Images Display */}
        {displayImages.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {displayImages.length} image(s)
              </span>
            </div>
            <div className={`grid gap-2 ${
              displayImages.length === 1 ? 'grid-cols-1' : 
              displayImages.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2 sm:grid-cols-3'
            }`}>
              {displayImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-border/30 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => {
                      // Open image in new tab instead of fullscreen to prevent black screen
                      window.open(img, '_blank');
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Content */}
        <HighlightedMarkdown content={content} className={`prose prose-sm max-w-none text-sm leading-relaxed ${
          isUser ? "text-foreground" : mode === "medicine" ? "text-blue-900 font-semibold" : "text-purple-900 font-semibold"
        }`} />

        {/* Source indicators for medical responses */}
        {mode === "medicine" && !isUser && content.includes("[Source:") && (
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Sources médicales validées</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
