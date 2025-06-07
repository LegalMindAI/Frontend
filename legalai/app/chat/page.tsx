// app/chat/page.tsx

"use client";

import React from "react";
import AIChat from "../components/Chat";

export default function ChatPage() {
  // Dummy function to simulate async API response
  const onSendMessage = async (message: string): Promise<string> => {
    // Replace this with your actual API call logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Echo: ${message}`);
      }, 1000);
    });
  };

  return <AIChat onSendMessage={onSendMessage} />;
}
