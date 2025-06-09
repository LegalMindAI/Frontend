import React from "react";
import html2canvas from "html2canvas";
import { LuFile } from "react-icons/lu";

const ExportImageButton: React.FC = () => {
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
    <button
      onClick={handleExportImage}
      title="Export Image"
      className="bg-white text-black p-2 rounded-md hover:bg-black hover:text-white transition"
    >
      <LuFile />
    </button>
  );
};

export default ExportImageButton;
