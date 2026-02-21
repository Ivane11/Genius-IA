import { Plus, MessageSquare, Trash2 } from "lucide-react";

export interface Conversation {
  id: string;
  title: string;
  mode: "medicine" | "informatique";
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
}

const ChatSidebar = ({ conversations, activeId, onSelect, onNew, onDelete, isOpen }: ChatSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-72 h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
              activeId === conv.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <img src="/LOGO.png" alt="Genius AI" className="w-6 h-6 rounded-full" />
          </div>
          <div>
            <span className="text-xs font-medium text-sidebar-foreground block">Genius AI</span>
            <span className="text-[10px] text-muted-foreground">par Ivane Beranger Kouassi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
