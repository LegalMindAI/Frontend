// src/components/ChatSidebar.tsx

"use client";

import { useEffect, useState } from "react";
import { getChatHistoryTitles } from "../integration/chatService";
import { ChatHistoryTitle } from "../integration/api";
import { PlusCircle, MessageSquare, Search, Settings, Trash2, Scale, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Add chat type badge component
const ChatTypeBadge = ({ type }: { type: string }) => {
  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basic':
        return 'bg-blue-500/20 text-blue-400';
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400';
      case 'highlight':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <span className={cn(
      "text-xs px-2 py-0.5 rounded-full font-medium",
      getBadgeStyle(type)
    )}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onSelectChat,
  onNewChat,
  currentChatId,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const history = await getChatHistoryTitles();
        setChatHistory(history);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 border-r border-gray-800 flex flex-col bg-[#0f1218]">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            LegalAI
          </h1>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings size={18} />
          </Button>
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 mb-4 text-white"
        >
          <PlusCircle size={16} />
          <span>New Conversation</span>
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-[#1a1d24] border-gray-800 text-gray-300 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h3 className="text-xs font-medium text-gray-500 mb-2 px-1">Recent Conversations</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col gap-3 w-full px-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-[#1a1d24] rounded-lg w-full" />
              ))}
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8 px-4">
            {searchQuery ? "No conversations match your search" : "No conversation history"}
          </div>
        ) : (
          <div className="space-y-1 px-1">
            {filteredHistory.map((chat) => (
              <div 
                key={chat.chat_id}
                className={cn(
                  "group relative rounded-lg transition-all duration-200",
                  currentChatId === chat.chat_id 
                    ? "bg-[#1e2330]" 
                    : "hover:bg-[#1a1d24]"
                )}
              >
                <Button
                  onClick={() => onSelectChat(chat.chat_id)}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-3 h-auto rounded-lg",
                    "text-left flex items-start gap-3",
                    currentChatId === chat.chat_id 
                      ? "text-white" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {chat.title.includes("Professional") ? (
                      <Sparkles size={16} className="text-amber-500" />
                    ) : (
                      <MessageSquare size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}
                      </div>
                      <ChatTypeBadge type={chat.chat_type} />
                    </div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
