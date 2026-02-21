import { useState, useRef, useEffect, useCallback } from "react";
import { Brain, Heart, Monitor, Sparkles } from "lucide-react";
import CleanHeader from "@/components/CleanHeader";
import ChatMessage from "@/components/ChatMessage";
import CenteredChatInput from "@/components/CenteredChatInput";
import ChatSidebar, { Conversation } from "@/components/ChatSidebar";
import MiniSuggestionGrid from "@/components/MiniSuggestionGrid";
import { useChat, Message } from "@/hooks/useChat";
import { OCRResult } from "@/lib/ocr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "medicine" | "informatique";

const Index = () => {
  const [mode, setMode] = useState<Mode>("medicine");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleBackToHome = () => {
    setActiveConvId(null);
    reset();
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

  const hasActiveConversation = messages.length > 0;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Header - Perfectly Centered Logo */}
        <CleanHeader
          mode={mode}
          onModeChange={setMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          hasActiveConversation={hasActiveConversation}
          onBackToHome={handleBackToHome}
        />

        {/* Messages Area - Centered with max-w-3xl */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto h-full px-4">
            {/* Welcome State - Clean without Creator Card */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                {/* Mini Suggestion Grid */}
                <MiniSuggestionGrid mode={mode} onSuggestionClick={handleSend} />
              </div>
            ) : (
              /* Chat Messages - Centered */
              <div className="py-6 space-y-6">
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
        </div>

        {/* Centered Chat Input with Glassmorphism */}
        <CenteredChatInput onSend={handleSend} isLoading={isLoading} mode={mode} />
      </div>
    </div>
  );
};

export default Index;
