
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, timestamp }) => {
  const isAgent = sender === 'agent';
  
  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isAgent ? "justify-start" : "justify-end"
    )}>
      {isAgent && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="Support Agent" />
          <AvatarFallback className="bg-finance-blue dark:bg-finance-teal text-white text-xs">AI</AvatarFallback>
        </Avatar>
      )}
      
      <div className="max-w-[80%]">
        <div className={cn(
          "rounded-xl px-4 py-2 text-sm",
          isAgent ? "bg-gray-100 dark:bg-gray-800" : "bg-finance-blue dark:bg-finance-teal text-white"
        )}>
          {content}
        </div>
        <div className={cn(
          "text-xs text-gray-500 mt-1",
          isAgent ? "text-left" : "text-right"
        )}>
          {new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(timestamp)}
        </div>
      </div>
      
      {!isAgent && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-gray-500 text-white text-xs">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
