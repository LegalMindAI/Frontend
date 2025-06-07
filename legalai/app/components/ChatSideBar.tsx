// src/components/ChatSidebar.tsx


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
  return (
    <div className="w-64 h-screen bg-gray-200 border-r border-gray-800 flex flex-col">
      <div className="p-4 font-bold text-lg">
        💬 Conversations
      </div>

      <button
        className="m-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer"
        onClick={onNew}
      >
        + New Chat
      </button>

      <div className="flex-grow overflow-y-auto">
        {conversations.length === 0 && (
          <div className="px-4 py-2 bg-gray-300 truncate rounded mx-3">
            No Conversations
          </div>
        )}
        {conversations.map((conv, index) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className="px-4 py-2 hover:bg-gray-300 cursor-pointer truncate rounded mx-3"
          >
            {conv.title + ` ${index + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
