
import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatSupportStore {
  isOpen: boolean;
  messages: Message[];
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => void;
}

// Mock responses for the chat bot
const botResponses = [
  "Thanks for reaching out! How can I help you with Market Seer today?",
  "I'd be happy to explain how our stock predictions work. We use LSTM neural networks trained on historical data.",
  "You can search for any stock ticker in the search box at the top of the page.",
  "Our prediction model considers various technical indicators including RSI, MACD, and moving averages.",
  "The predictions shown are for demonstration purposes only and shouldn't be used for actual trading decisions.",
  "Is there anything else you'd like to know about Market Seer?",
];

// Generate a random response from the bot
const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

export const useChatSupport = create<ChatSupportStore>((set) => ({
  isOpen: false,
  messages: [
    {
      id: '1',
      content: 'Hello! Welcome to Market Seer support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ],
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  sendMessage: (content) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
    }));

    // Simulate typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getRandomResponse(),
        sender: 'agent',
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, botMessage],
      }));
    }, 1000);

    // Show toast notification
    toast({
      title: "Message sent",
      description: "Support agent is typing...",
      duration: 2000,
    });
  },
}));
