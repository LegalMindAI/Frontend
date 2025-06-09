"use client";
import React from "react";

interface ChatHeaderProps {
  chatType: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatType }) => {
  return (
    <div className="w-full bg-gray-50/10 rounded px-6 py-4 flex justify-between items-center border-b mb-4">
      <div>
        <p className="text-2xl md:text-3xl font-semibold text-white">
          👋 Welcome to LegalAI!
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Mode: <span className="font-medium">{chatType}</span>
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
