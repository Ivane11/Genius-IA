import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Brain, Activity } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import ChatMessage from "@/components/ChatMessage";
import EnhancedChatInput from "@/components/EnhancedChatInput";
import ChatSidebar, { Conversation } from "@/components/ChatSidebar";
import Anatomy3D from "@/components/Anatomy3D";
import { useChat, Message } from "@/hooks/useChat";
import { OCRResult } from "@/lib/ocr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "medicine" | "informatique";

const Index = () => {
  const [mode, setMode] = useState<Mode>("medicine");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAnatomy, setShowAnatomy] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [savedMessages, setSavedMessages] = useState<Record<string, { messages: Message[]; mode: Mode }>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, send, reset, setMessages } = useChat(mode);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages when they change
  useEffect(() => {
    if (activeConvId && messages.length > 0) {
      setSavedMessages((prev) => ({
        ...prev,
        [activeConvId]: { messages, mode },
      }));
      // Update title from first user message
      const firstUser = messages.find((m) => m.role === "user");
      if (firstUser) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, title: firstUser.content.slice(0, 40) || "Image", mode }
              : c
          )
        );
      }
    }
  }, [messages, activeConvId, mode]);

  const handleSend = useCallback(
    (content: string, images?: string[], ocrResults?: OCRResult[]) => {
      if (!activeConvId) {
        const id = crypto.randomUUID();
        const conv: Conversation = {
          id,
          title: content.slice(0, 40) || "Image",
          mode,
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveConvId(id);
      }
      send(content, images, ocrResults);
    },
    [activeConvId, mode, send]
  );

  const handleNewConversation = () => {
    setActiveConvId(null);
    reset();
  };

  const handleSelectConversation = (id: string) => {
    const saved = savedMessages[id];
    if (saved) {
      setMessages(saved.messages);
      setMode(saved.mode);
    }
    setActiveConvId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setSavedMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeConvId === id) {
      setActiveConvId(null);
      reset();
    }
  };

  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <img src="/LOGO.png" alt="Genius AI" className="w-6 h-6 rounded" />
              </div>
              <h1 className="text-lg font-bold">
                <span className="gradient-text">Genius</span>{" "}
                <span className="text-foreground">AI</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === "medicine" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnatomy(!showAnatomy)}
                className="flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                {showAnatomy ? "Masquer" : "Afficher"} Atlas 3D
              </Button>
            )}
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex h-full">
            {/* Zone principale */}
            <div className={`flex-1 ${showAnatomy && mode === "medicine" ? "mr-96" : ""}`}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <img src="/LOGO.png" alt="Genius AI" className="w-16 h-16 rounded-xl" />
                  </div>
                  <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-2">
                      <span className="gradient-text">Genius AI</span>
                    </h2>
                    <p className="text-xs text-muted-foreground/60 mb-2">Conçu par Ivane Beranger Kouassi</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {mode === "medicine"
                        ? "Assistant médical expert avec OCR, validation des sources et cross-validation IA."
                        : "Assistant informatique expert avec analyse de code, QCM et capture d'écran."}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">OCR Automatique</div>
                      <div className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">Sources Validées</div>
                      <div className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-xs">Cross-Validation</div>
                      <div className="bg-success/10 text-success px-2 py-1 rounded text-xs">&lt; 30s</div>
                      {mode === "medicine" && (
                        <div className="bg-purple-10 text-purple-600 px-2 py-1 rounded text-xs">Atlas 3D</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                    {(mode === "medicine"
                      ? [
                          "Quels sont les signes d'un AVC ?",
                          "Analysez ce QCM de pharmacologie",
                          "Expliquez le cycle de Krebs",
                          "Diagnostic différentiel d'une douleur thoracique",
                        ]
                      : [
                          "Corrigez ce code Python",
                          "Expliquez la complexité de quicksort",
                          "Différence entre TCP et UDP",
                          "QCM sur les bases de données SQL",
                        ]
                    ).map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="glass rounded-xl px-4 py-3 text-left text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
                  {messages.map((msg, i) => (
                    <ChatMessage
                      key={i}
                      role={msg.role}
                      content={msg.content}
                      mode={mode}
                      imageUrl={msg.imageUrl}
                      images={msg.images}
                      ocrResults={msg.ocrResults}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Panneau latéral - Atlas 3D (uniquement mode médecine) */}
            {showAnatomy && mode === "medicine" && (
              <div className="w-96 border-l border-border/50 bg-background/95 p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Atlas Anatomique 3D</h3>
                  <p className="text-sm text-muted-foreground">
                    Explorez le corps humain en 3D avec des organes interactifs et animations réalistes.
                  </p>
                </div>
                <Anatomy3D />
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Informations:</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Cliquez sur les organes pour les sélectionner</div>
                    <div>• Rotation automatique du modèle</div>
                    <div>• Animations physiologiques réalistes</div>
                    <div>• Support des 6 organes principaux</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <EnhancedChatInput onSend={handleSend} isLoading={isLoading} mode={mode} />
      </div>
    </div>
  );
};

export default Index;
