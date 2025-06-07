// src/components/MessageList.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  sender: 'user' | 'bot'; // or extend if you have more roles
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-3 ">
      {messages.length === 0 && <div><p className="text-gray-400 text-center text-5xl mt-32">Welcome to LegalAi</p>
      <p className="text-gray-400 text-center text-xl mt-5">Send a message to get started</p></div>}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-xl px-4 py-2 rounded-xl ${
            msg.sender === 'user'
              ? 'bg-gray-700/50 border border-white/20 text-white self-end'
              : 'bg-gray-200/30 text-white self-start'
          }`}
        >
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
