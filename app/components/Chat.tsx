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

  return (
    <div className="h-screen flex flex-col justify-center">
      <ChatHeader chatType={chatType} />
      <ChatWindow>
        <MessageList messages={messages} />
      </ChatWindow>
      <ChatInput messages={messages} setmessages={setmessages} chatType={chatType} />
    </div>
  );
}
