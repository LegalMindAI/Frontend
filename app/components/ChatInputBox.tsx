"use client";
import React, { useState } from "react";
import { FiMic, FiFileText } from "react-icons/fi";
import { LuFile } from "react-icons/lu";
import VoiceInput from "./VoiceInput";
import FileUpload from "./FileUpload";
import ExportImageButton from "./ExportImageButton";
import { useAuth } from "@/lib/auth-context";

interface Message {
  text: string;
  sender: "user" | "bot";
}
interface ChatInputProps {
  messages: Message[];
  setmessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatType: string;
}
const ChatInput: React.FC<ChatInputProps> = ({ messages, setmessages, chatType }) => {
  const [input, setInput] = useState<string>("");
  const [extracted_text, setextracted_text] = useState<string>("");
  const { user } = useAuth();

  const url =
    chatType === "Professional"
      ? "http://127.0.0.1:8000/chat-advanced"
      : "http://127.0.0.1:8000/chat-basic";
  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    const prevChat = messages.map((msg) => `${msg.sender}: ${msg.text}`);
    try {
      let token = "";
      if (user) {
        token = await user.getIdToken();
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          extracted_text: "",
          question: message,
          previous_convo: prevChat,
        }),
      });

      const data = await response.json();
      const AiResponse = data.answer; // Use data directly

      setmessages((prev) => [
        ...prev,
        { text: message, sender: "user" },
        {
          text: AiResponse,
          sender: "bot",
        },
      ]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleVoiceText = (voiceText: string) => {
    setInput(voiceText);
  };

  return (
    <div className=" flex justify-center items-center bg-black  max-w-3xl mx-auto rounded-xl">
      <div className="w-full max-w-3xl relative min-h-32 bg-gray-100/20 focus:ring-1 shadow-[0_2px_10px_rgba(255,255,255,0.05)] rounded-xl pt-3">
        <textarea
          rows={3} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(input);
            }
          }}
          placeholder="Send a message..."
          className="w-full resize-none  px-4  pr-20 text-sm placeholder:text-white focus:outline-none"
        />

        <button
          onClick={() => handleSend(input)}
          className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-md hover:bg-black hover:text-white shadow transition h-10"
        >
          ➤
        </button>
        <VoiceInput display={input} showDisplay={handleVoiceText} />

        <div className="absolute bottom-[1rem] left-4 flex gap-3">
          <FileUpload onExtractedText={setextracted_text} />
          <label htmlFor="FileInput" className="bg-white  text-black p-2 rounded-md hover:bg-black hover:text-white transition">
            <FiFileText />
          </label>
          <ExportImageButton />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
