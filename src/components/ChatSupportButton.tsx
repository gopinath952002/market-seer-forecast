
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useChatSupport } from '@/hooks/useChatSupport';

const ChatSupportButton: React.FC = () => {
  const { openChat } = useChatSupport();
  
  return (
    <Button
      onClick={openChat}
      className="fixed bottom-6 right-6 rounded-full bg-finance-blue dark:bg-finance-teal shadow-lg p-3 h-14 w-14 flex items-center justify-center"
      variant="default"
      size="icon"
      aria-label="Open support chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default ChatSupportButton;
