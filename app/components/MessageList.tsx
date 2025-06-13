// src/components/MessageList.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { BotIcon, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface Message {
  text: string;
  sender: 'user' | 'bot'; // or extend if you have more roles
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const speechSynthesisRef = useRef<typeof window.speechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Handle speech end to reset state
  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.onend = () => setSpeakingIdx(null);
      utteranceRef.current.onerror = () => setSpeakingIdx(null);
    }
  }, [speakingIdx]);

  return (
    <div 
      id="chat-window" 
      className="h-[calc(100vh-120px)] overflow-y-auto"
      ref={scrollContainerRef}
    >
      <div className="flex flex-col space-y-8 p-6 pb-44">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to LegalAI</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Your intelligent legal assistant powered by advanced AI
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                <h3 className="font-medium mb-1">Research</h3>
                <p className="text-sm text-muted-foreground">Find relevant case law and statutes</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                <h3 className="font-medium mb-1">Analyze</h3>
                <p className="text-sm text-muted-foreground">Get insights on legal documents</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                <h3 className="font-medium mb-1">Draft</h3>
                <p className="text-sm text-muted-foreground">Create legal documents</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                <h3 className="font-medium mb-1">Explain</h3>
                <p className="text-sm text-muted-foreground">Simplify complex legal concepts</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex w-full max-w-3xl mx-auto",
              msg.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === 'bot' && (
              <div className="mr-4 mt-1 flex flex-col items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <BotIcon size={16} />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div
              className={cn(
                "px-4 py-3 rounded-xl max-w-[85%]",
                msg.sender === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-[#1a1d24] text-gray-100 rounded-tl-none border border-gray-800"
              )}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              {msg.sender === 'bot' && (
                <div className="flex gap-2 mt-2">
                  <button
                    title={copiedIdx === index ? "Copied!" : "Copy"}
                    className={cn(
                      "p-1 rounded transition flex items-center justify-center",
                      copiedIdx === index ? "bg-green-500/80 text-white" : "hover:bg-primary/20"
                    )}
                    onClick={() => {
                      navigator.clipboard.writeText(msg.text);
                      setCopiedIdx(index);
                      setTimeout(() => setCopiedIdx(null), 1000);
                    }}
                    style={{ lineHeight: 0 }}
                  >
                    {copiedIdx === index ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                    )}
                  </button>
                  <button
                    title={speakingIdx === index ? "Stop" : "Read Aloud"}
                    className={cn(
                      "p-1 rounded transition flex items-center justify-center",
                      speakingIdx === index ? "bg-blue-500/80 text-white animate-pulse" : "hover:bg-primary/20"
                    )}
                    onClick={() => {
                      if (speakingIdx === index) {
                        if (speechSynthesisRef.current) speechSynthesisRef.current.cancel();
                        setSpeakingIdx(null);
                      } else {
                        if ('speechSynthesis' in window) {
                          if (speechSynthesisRef.current) speechSynthesisRef.current.cancel();
                          const utterance = new window.SpeechSynthesisUtterance(msg.text);
                          utterance.lang = 'en-IN';
                          utterance.onend = () => setSpeakingIdx(null);
                          utterance.onerror = () => setSpeakingIdx(null);
                          utteranceRef.current = utterance;
                          setSpeakingIdx(index);
                          window.speechSynthesis.speak(utterance);
                        }
                      }
                    }}
                    style={{ lineHeight: 0 }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 5v14M18.364 5.636a9 9 0 0 1 0 12.728M15.536 8.464a5 5 0 0 1 0 7.072"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {msg.sender === 'user' && (
              <div className="ml-4 mt-1">
                <Avatar className="h-8 w-8 border-2 border-blue-500/20">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
