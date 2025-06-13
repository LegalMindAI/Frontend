"use client";

import { useState, useEffect } from "react";
import { fetchSharedChat } from "@/app/integration/chatService";
import { SharedChatData, ChatMessage } from "@/app/integration/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SharedChatPage({ params }: { params: { id: string } }) {
  const [sharedChat, setSharedChat] = useState<SharedChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shareId = params?.id;

  useEffect(() => {
    const fetchChat = async () => {
      if (!shareId) return;
      
      try {
        setLoading(true);
        const chatData = await fetchSharedChat(shareId);
        setSharedChat(chatData);
      } catch (err) {
        console.error("Failed to fetch shared chat:", err);
        setError("Failed to load the shared conversation. It may have been removed or the link is invalid.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-8">
            <Scale size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">LegalAI Shared Chat</h1>
          </div>
          <Card className="border border-gray-800 bg-[#1a1d24]">
            <CardContent className="p-8">
              <div className="flex justify-center">
                <div className="animate-pulse flex flex-col gap-4 w-full">
                  <div className="h-6 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  <div className="h-32 bg-slate-700 rounded w-full mt-4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !sharedChat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-8">
            <Scale size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">LegalAI Shared Chat</h1>
          </div>
          <Card className="border border-gray-800 bg-[#1a1d24]">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
              <p className="text-gray-400">{error || "Failed to load the shared conversation"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Scale size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold">LegalAI Shared Chat</h1>
        </div>
        
        <Card className="border border-gray-800 bg-[#1a1d24] mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl">{sharedChat.title}</CardTitle>
            <CardDescription className="text-gray-400">
              Shared on {format(new Date(sharedChat.shared_at), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {sharedChat.conversation.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-full',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {format(new Date(message.timestamp), 'h:mm a, MMMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <Card className="border border-gray-800 bg-[#1a1d24] mt-8">
          <CardFooter className="flex justify-center py-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} />
              <span>Shared using LegalAI</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 