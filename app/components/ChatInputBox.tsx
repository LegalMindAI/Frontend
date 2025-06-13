"use client";
import React, { useState } from "react";
import { LuSend, LuImage, LuMic } from "react-icons/lu";
import { Paperclip, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import VoiceInput from "./VoiceInput";
import { sendChatMessage, uploadPdf } from "../integration/chatService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  text: string;
  sender: "user" | "bot";
}
interface ChatInputProps {
  messages: Message[];
  setmessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatType: string;
  chatId: string | null;
  onChatIdChange: (newChatId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  messages, 
  setmessages, 
  chatType, 
  chatId, 
  onChatIdChange 
}) => {
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [extracted_text, setextracted_text] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await sendChatMessage(
        message,
        extracted_text,
        chatId,
        chatType === "Professional"
      );

      // Update chatId if it's a new chat
      if (response.chat_id && (!chatId || chatId !== response.chat_id)) {
        onChatIdChange(response.chat_id);
      }

      setmessages((prev) => [
        ...prev,
        { text: message, sender: "user" },
        {
          text: response.answer,
          sender: "bot",
        },
      ]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceText = (voiceText: string) => {
    setInput(voiceText);
  };

  const handleExportPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    try {
      const response = await uploadPdf(selectedFile);
      setextracted_text(response.extracted_text);
    } catch (err) {
      console.error("Upload failed:", err);
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex w-full">
        {/* Space for sidebar */}
        <div className="w-80 flex-shrink-0"></div>
        
        {/* Main content area */}
        <div className="flex-1 pb-6">
          <div className="bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/95 to-transparent pt-10 relative">
            <div className="max-w-4xl mx-auto px-6">
              {chatType === "Professional" && (
                <div className="absolute -top-10 left-0 right-0 flex justify-center">
                  <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 border border-amber-500/20">
                    <Sparkles size={12} />
                    Professional Mode Active
                  </div>
                </div>
              )}
              
              <div className="bg-[#1a1d24] backdrop-blur-md shadow-lg rounded-2xl border border-gray-800/50 overflow-hidden relative">
                <div className="flex items-center px-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.txt,.docx"
                    onChange={handleExportPDF}
                    name="FileInput"
                    id="FileInput"
                    title="Upload Document"
                    className="hidden"
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
                        >
                          <label htmlFor="FileInput" className="cursor-pointer p-2">
                            <Paperclip size={18} />
                          </label>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                        e.preventDefault();
                        handleSend(input);
                      }
                    }}
                    placeholder={chatType === "Professional" ? "Ask your legal question..." : "Type your message..."}
                    className={cn(
                      "min-h-12 resize-none py-3 px-3 mx-2 flex-1",
                      "text-base placeholder:text-gray-500",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "bg-transparent border-0"
                    )}
                  />
                  
                  <div className="flex gap-2 items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setIsVoiceActive(!isVoiceActive)}
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
                          >
                            <LuMic size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voice input</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleSend(input)}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className={cn(
                              "rounded-full bg-blue-600 hover:bg-blue-700 text-white",
                              (isLoading || !input.trim()) ? "opacity-50 cursor-not-allowed" : ""
                            )}
                          >
                            <LuSend size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send message</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
