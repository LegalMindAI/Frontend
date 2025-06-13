"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy, Link } from "lucide-react";
import { shareChat } from "@/app/integration/chatService";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareButtonProps {
  chatId: string;
}

const ShareButton = ({ chatId }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    if (!chatId) return;
    
    try {
      setIsSharing(true);
      const response = await shareChat(chatId);
      
      // Construct the share URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/share/${response.share_id}`;
      
      setShareUrl(url);
      
      toast({
        title: "Chat shared successfully",
        description: "You can now share this link with others"
      });
    } catch (error) {
      console.error("Failed to share chat:", error);
      toast({
        title: "Error",
        description: "Failed to share chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error);
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive"
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-[#1a1d24]"
          title="Share Chat"
        >
          <Share2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1d24] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Export Conversation</DialogTitle>
          <DialogDescription className="text-gray-400">
            Generate a shareable link for this conversation
          </DialogDescription>
        </DialogHeader>
        
        {!shareUrl ? (
          <div className="py-4">
            <p className="text-sm text-gray-400 mb-4">
              Create a shareable link that can be accessed without authentication.
            </p>
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? "Generating link..." : "Generate shareable link"}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-sm text-gray-400 mb-2">
              Anyone with this link can view this conversation:
            </p>
            <div className="flex mt-2">
              <Input
                className="flex-1 bg-[#0f1218] border-gray-800 text-gray-300"
                value={shareUrl}
                readOnly
              />
              <Button
                variant="outline"
                size="icon"
                className="ml-2 border-gray-800 text-gray-300 hover:text-white"
                onClick={copyToClipboard}
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          <div className="flex items-center text-xs text-gray-500">
            <Link size={14} className="mr-2" />
            Shared links are accessible to anyone without login
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton; 