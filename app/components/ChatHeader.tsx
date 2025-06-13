// src/components/ChatHeader.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth';
import { toast } from '@/components/ui/toast';
import { LogOut, Settings, Scale, Sparkles, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { checkAdvancedServiceHealth } from '../integration/chatService';
import ShareButton from '@/app/components/chat/ShareButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  chatType: string;
  onChatTypeChange: (type: "Basic" | "Professional") => void;
  currentChatId?: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatType, onChatTypeChange, currentChatId }) => {
  const { user } = useAuth();
  const [isAdvancedHealthy, setIsAdvancedHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      if (chatType === "Professional") {
        const isHealthy = await checkAdvancedServiceHealth();
        setIsAdvancedHealthy(isHealthy);
        
        if (!isHealthy) {
          toast({
            title: "Service Unavailable",
            description: "The advanced legal analysis service is currently experiencing technical difficulties. Please try again later or switch to basic mode.",
            variant: "destructive",
          });
          onChatTypeChange("Basic");
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [chatType, onChatTypeChange]);

  const handleLogOut = async (): Promise<void> => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      window.location.href = '/';
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
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/10 p-2 rounded-full">
            <Scale size={20} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">LegalAI Assistant</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "gap-2 border-gray-800 bg-[#1a1d24] text-white hover:bg-[#1e2330] hover:text-white",
                  !isAdvancedHealthy && chatType === "Professional" && "border-red-500"
                )}
                disabled={!isAdvancedHealthy && chatType === "Professional"}
              >
                {chatType === "Professional" ? (
                  <Sparkles size={16} className="text-amber-500" />
                ) : (
                  <Scale size={16} className="text-blue-500" />
                )}
                {chatType} Mode
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1d24] border-gray-800 text-white">
              <DropdownMenuItem 
                onClick={() => onChatTypeChange("Basic")}
                className="hover:bg-[#1e2330] cursor-pointer"
              >
                <Scale size={16} className="mr-2 text-blue-500" />
                Basic Mode
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onChatTypeChange("Professional")}
                className={cn(
                  "hover:bg-[#1e2330] cursor-pointer",
                  !isAdvancedHealthy && "opacity-50 cursor-not-allowed"
                )}
                disabled={!isAdvancedHealthy}
              >
                <Sparkles size={16} className="mr-2 text-amber-500" />
                Professional Mode
                {!isAdvancedHealthy && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2">
                          <AlertCircle size={14} className="text-red-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-red-700 text-white">
                        The advanced legal analysis service is currently experiencing technical difficulties. Please try again later or switch to basic mode.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentChatId && <ShareButton chatId={currentChatId} />}

          <Button
            onClick={handleLogOut}
            variant="ghost"
            size="icon"
            title="Log Out"
            className="text-gray-400 hover:text-white hover:bg-[#1a1d24]"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
