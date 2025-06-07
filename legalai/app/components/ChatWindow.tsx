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
        behavior: "smooth", // <- this makes it smooth
      });
    }
  }, [children]); // run when children change (i.e., new messages)

  return (
    <div
      className="flex-grow overflow-y-auto px-4 py-4"
      ref={scrollContainerRef}
    >
      {children}
    </div>
  );
}

export default ChatWindow;
