"use client";
import React, { useState } from "react";
import { FiMic, FiFileText } from "react-icons/fi";
import { LuFile } from "react-icons/lu";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import VoiceInput from "./VoiceInput";

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
  const [file, setFile] = useState<File | null>(null);
  const [extracted_text,setextracted_text] = useState<string>("");

  const url =
    chatType === "Professional"
      ? "http://127.0.0.1:8000/chat-advanced"
      : "http://127.0.0.1:8000/chat-basic";
  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    const prevChat = messages.map((msg) => `${msg.sender}: ${msg.text}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extracted_text: "",
          question: message,
          previous_convo: prevChat,
        }),
      });

      const data = await response.json();
      const parsed = JSON.parse(data);
      const AiResponse = parsed.answer;

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

 const handleExportPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const selectedFile = e.target.files[0]; 
  setFile(selectedFile); 
  const formData = new FormData();
  formData.append("file", selectedFile); 

  try {
    const response = await fetch("http://127.0.0.1:8000/pdf-upload", {
      method: "POST",
      body: formData, 
    });

    const data = await response.json();
    setextracted_text(data.extracted_text);
    
  } catch (err) {
    console.error("Upload failed", err);
  }
};


  // 🖼 Export to Image
  const handleExportImage = () => {
    const chatElement = document.getElementById("chat-window");
    if (!chatElement) return;

    html2canvas(chatElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "chat.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="p-4 flex justify-center items-center ">
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
          className="
            w-full resize-none  px-4  pr-20
            text-sm placeholder:text-white 
            focus:outline-none 
          "
        />

        <button
          onClick={() => handleSend(input)}
          className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-md hover:bg-black hover:text-white shadow transition h-10"
        >
          ➤
        </button>
        <VoiceInput display={input} showDisplay={handleVoiceText} />

        <div className="absolute bottom-[1rem] left-4 flex gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.txt,.docx"
            onChange={handleExportPDF}
            name="FileInput"
            id="FileInput"
            title="Export PDF"
            className="hidden"
          />
          <label
            htmlFor="FileInput"
            className="bg-white  text-black p-2 rounded-md hover:bg-black hover:text-white transition"
          >
            {" "}
            <FiFileText />
          </label>

          <button
            onClick={handleExportImage}
            title="Export Image"
            className="bg-white text-black p-2 rounded-md hover:bg-black hover:text-white transition"
          >
            <LuFile />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
