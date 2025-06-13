import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
}

function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;