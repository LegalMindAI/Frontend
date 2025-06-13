// src/components/ChatWindow.tsx
import { useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  children: ReactNode;
}

function ChatWindow({ children }: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [children]);

  return (
    <div
      className={cn(
        "flex-1 h-full overflow-y-auto",
        "bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20"
      )}
      ref={scrollContainerRef}
    >
      <div className="relative h-full">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
