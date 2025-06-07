// app/chat/layout.tsx

import React, { ReactNode } from "react";
// import Header from "../components/Header";
import Footer from "../components/Footer";
export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-white  bg-gradient-to-br from-white/10  to-white/0 flex flex-col">
     
      <main className="flex-grow min-h-screen ">{children}</main>
    
    </div>
  );
}
