// src/components/ChatSidebar.tsx
import React, { useState } from "react";

interface Conversation {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onNew: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, onSelect, onNew }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-black/60 backdrop-blur-md border-r border-white/10 flex flex-col text-white font-sans transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <span className={`font-bold text-lg tracking-tight transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>💬 Conversations</span>
        <button
          className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <span className="text-lg">&#8250;</span> : <span className="text-lg">&#8249;</span>}
        </button>
      </div>
      {!collapsed && (
        <button
          className="m-4 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition-colors duration-200 font-medium shadow"
          onClick={onNew}
        >
          + New Chat
        </button>
      )}
      <div className={`flex-grow overflow-y-auto ${collapsed ? 'px-1' : ''}`}>
        {conversations.length === 0 && !collapsed && (
          <div className="px-4 py-2 bg-white/10 text-white rounded mx-3">
            No Conversations
          </div>
        )}
        {conversations.map((conv, index) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`truncate rounded mx-3 my-1 transition-colors duration-150 text-white font-medium cursor-pointer ${collapsed ? 'px-2 py-2 text-center' : 'px-4 py-2 hover:bg-purple-900/60 active:bg-purple-800/80'}`}
            title={conv.title}
          >
            {collapsed ? <span className="text-lg">💬</span> : conv.title + ` ${index + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
