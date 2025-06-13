// app/components/AIChat.tsx
"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import MessageList from "./MessageList";
import ChatInput from "./ChatInputBox";

type Message = {
  text: string;
  sender: "user" | "bot";
};

interface ChatProps {
  chatType: string;
}

export default function AIChat({ chatType }: ChatProps) {
  const [messages, setmessages] = useState<Message[]>([]);
  const [activeChatType, setActiveChatType] = useState<"Basic" | "Professional">(
    chatType === "Professional" ? "Professional" : "Basic"
  );
  const [chatId, setChatId] = useState<string | null>(null);

  const handleChatTypeChange = (type: "Basic" | "Professional") => {
    setActiveChatType(type);
  };

  const handleChatIdChange = (newChatId: string) => {
    setChatId(newChatId);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        <ChatHeader 
          chatType={activeChatType} 
          onChatTypeChange={handleChatTypeChange} 
        />
      </div>
      <ChatWindow>
        <MessageList messages={messages} />
      </ChatWindow>
      <ChatInput 
        messages={messages} 
        setmessages={setmessages} 
        chatType={activeChatType} 
        chatId={chatId}
        onChatIdChange={handleChatIdChange}
      />
    </div>
  );
}
