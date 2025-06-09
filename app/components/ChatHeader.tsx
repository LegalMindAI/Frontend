// src/components/ChatHeader.tsx
"use client"
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth';
import { toast } from '@/components/ui/toast';

interface ChatHeaderProps {
  chatType: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatType }) => {
  const { user } = useAuth();

  const handleLogOut = async (): Promise<void> => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      window.location.href = '/'; // Redirect to home page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full bg-gray-50/10 rounded px-6 py-4 flex justify-between items-center border-b">
      <div>
        <p className="text-2xl md:text-3xl font-semibold text-white">
          👋 Welcome to LegalAI!
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Mode: <span className="font-medium">{chatType}</span>
        </p>
      </div>
      <button
        onClick={handleLogOut}
        className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded transition duration-200 cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
};

export default ChatHeader;
