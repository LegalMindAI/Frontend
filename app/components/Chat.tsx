// app/components/AIChat.tsx
"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import MessageList from "./MessageList";
import ChatInput from "./ChatInputBox";
import InteractiveBackground from "./InteractiveBackground";
import ChatSideBar from "./ChatSideBar";
import { UserButton } from "@/components/auth/user-button";
import Link from "next/link";

type Message = {
  text: string;
  sender: "user" | "bot";
};

interface ChatProps {
  chatType: string;
}

const BASE_URL = "http://127.0.0.1:8000";

export default function AIChat({ chatType }: ChatProps) {
  const [messages, setmessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Fetch chat titles for sidebar
  useEffect(() => {
    fetch(`${BASE_URL}/chat-history/titles`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (data && Array.isArray(data.titles)) {
          setConversations(data.titles);
        } else {
          setConversations([]);
        }
      })
      .catch(() => setConversations([]));
  }, []);

  // Fetch chat details when a chat is selected
  const handleSelect = async (id: string) => {
    setActiveChatId(id);
    try {
      const res = await fetch(`${BASE_URL}/chat-history/${id}`);
      const data = await res.json();
      setmessages(data.messages || []);
    } catch (err) {
      setmessages([]);
    }
  };

  // Start new chat
  const handleNew = () => {
    setActiveChatId(null);
    setmessages([]);
  };

  // Send message to backend
  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    const prevChat = messages.map((msg) => `${msg.sender}: ${msg.text}`);
    const url = chatType === "Professional"
      ? `${BASE_URL}/chat-advanced`
      : `${BASE_URL}/chat-basic`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracted_text: "",
          question: message,
          chat_id: activeChatId, // Pass chat_id if continuing a conversation
        }),
      });
      const data = await response.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const AiResponse = parsed.answer;
      const newMessages: Message[] = [
        ...messages,
        { text: message, sender: "user" as const },
        { text: AiResponse, sender: "bot" as const },
      ];
      setmessages(newMessages);
      // Save chat
      await fetch(`${BASE_URL}/chat-history/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: activeChatId, // Save with chat_id if available
          messages: newMessages,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen text-white relative">
      <InteractiveBackground />
      <div className="absolute top-0 right-0 z-20 p-4 flex gap-2 items-center">
        <Link href="/" className="bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded shadow border border-white/10 transition-colors duration-150 font-medium">Home</Link>
        <UserButton />
      </div>
      <div className="relative z-10 flex flex-row h-screen">
        <ChatSideBar conversations={conversations} onSelect={handleSelect} onNew={handleNew} />
        <main className="flex-1 flex flex-col items-center container mx-auto px-4 h-full">
          <div className="flex flex-col w-full flex-1 h-full justify-between relative">
            <ChatWindow>
              <MessageList messages={messages} />
            </ChatWindow>
            <div className="absolute left-0 right-0 bottom-0 z-30">
              <ChatInput messages={messages} setmessages={setmessages} chatType={chatType} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
