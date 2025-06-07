// src/components/ChatHeader.tsx
import React from 'react';

const ChatHeader: React.FC = () => {
  const handleLogOut = (): void => {
      console.log("Logging out");
  };

  return (
    <div className="w-full bg-gray-50/10 rounded px-6 py-4 flex justify-between items-center  border-b">
      <p className="text-2xl md:text-3xl font-semibold text-whiteca">
        👋 Welcome to LegalAI!
      </p>
      <button
        onClick={handleLogOut}
        className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded transition duration-200 cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
};

export default ChatHeader;
