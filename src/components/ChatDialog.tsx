
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useChatSupport } from '@/hooks/useChatSupport';

const ChatDialog: React.FC = () => {
  const { isOpen, messages, closeChat, sendMessage } = useChatSupport();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeChat()}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col p-0">
        <DialogHeader className="border-b p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Market Seer Support
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeChat}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="border-t p-4 flex items-center gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
