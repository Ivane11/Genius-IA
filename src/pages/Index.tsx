import { useState, useRef, useEffect, useCallback } from "react";
import { Brain, Heart, Monitor, Sparkles } from "lucide-react";
import FuturisticHeader from "@/components/FuturisticHeader";
import ChatMessage from "@/components/ChatMessage";
import FuturisticChatInput from "@/components/FuturisticChatInput";
import ChatSidebar, { Conversation } from "@/components/ChatSidebar";
import NeonSuggestionGrid from "@/components/NeonSuggestionGrid";
import { useChat, Message } from "@/hooks/useChat";
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

  const handleSend = useCallback((message: string, images?: string[]) => {
    if (!activeConvId) {
      const id = crypto.randomUUID();
      const conv: Conversation = {
        id,
        title: message.slice(0, 40) || "Image",
        mode,
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(id);
    }
    send(message, images);
  }, [activeConvId, mode, send]);

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
        {/* Futuristic Header */}
        <FuturisticHeader
          mode={mode}
          onModeChange={setMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          hasActiveConversation={hasActiveConversation}
          onBackToHome={handleBackToHome}
        />

        {/* Messages Area - Centered with max-w-3xl */}
        <div className="flex-1 overflow-y-auto pb-40">
          <div className="max-w-3xl mx-auto h-full px-4">
            {/* Welcome State - Clean without Logo */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                {/* Neon Suggestion Grid */}
                <NeonSuggestionGrid mode={mode} onSuggestionClick={handleSend} />
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
                  />
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Futuristic Chat Input */}
        <FuturisticChatInput onSend={handleSend} isLoading={isLoading} mode={mode} />
      </div>
    </div>
  );
};

export default Index;
