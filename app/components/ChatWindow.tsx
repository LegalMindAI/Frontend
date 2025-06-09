// src/components/ChatWindow.tsx
import { useRef, useEffect, ReactNode } from "react";

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
      className="flex-1 h-full overflow-y-auto px-4 py-4 max-h-screen scrollbar-none" // hide scrollbar
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Firefox/IE fallback
      ref={scrollContainerRef}
    >
      {/* Hide scrollbar for Webkit browsers */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
      {children}
    </div>
  );
}

export default ChatWindow;
