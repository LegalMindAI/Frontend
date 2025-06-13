// app/chat/page.tsx

"use client";

import { useState, useEffect } from "react";
import ChatHeader from "../components/ChatHeader";
import ChatSidebar from "../components/ChatSideBar";
import MessageList from "../components/MessageList";
import ChatInputBox from "../components/ChatInputBox";
import { getChatHistory } from "../integration/chatService";
import { Message } from "../types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatType, setChatType] = useState<"Basic" | "Professional">("Basic");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleChatTypeChange = (type: "Basic" | "Professional") => {
    setChatType(type);
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      const chatHistory = await getChatHistory(chatId);
      const formattedMessages: Message[] = chatHistory.conversation.map((msg) => ({
        text: msg.content,
        sender: msg.role === "user" ? "user" : "bot" as const,
      }));
      setMessages(formattedMessages);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      {/* Sidebar */}
      <ChatSidebar
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0d14] relative">
        {/* Background pattern - subtle grid */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <ChatHeader 
            chatType={chatType} 
            onChatTypeChange={handleChatTypeChange} 
            currentChatId={currentChatId} 
          />
          <div className="flex-1 relative">
            <MessageList messages={messages} />
            <ChatInputBox
              messages={messages}
              setmessages={setMessages}
              chatType={chatType}
              chatId={currentChatId}
              onChatIdChange={setCurrentChatId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
