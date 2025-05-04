
import { supabase } from "@/integrations/supabase/client";

// Service for communicating with Python backend via our Supabase edge function
export const pythonService = {
  // Method to process data in real-time with Python
  async processData(data: any): Promise<any> {
    try {
      const { data: response, error } = await supabase.functions.invoke('python-bridge', {
        body: {
          endpoint: 'process',
          data
        }
      });
      
      if (error) throw error;
      return response;
    } catch (error) {
      console.error('Error processing data with Python:', error);
      throw error;
    }
  },
  
  // For real-time WebSocket communication
  connectWebSocket(onMessage: (data: any) => void): WebSocket {
    // Replace this URL with your actual Python WebSocket server when you have it deployed
    const ws = new WebSocket('wss://your-python-websocket-server.example.com/ws');
    
    ws.onopen = () => {
      console.log('Connected to Python WebSocket');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from Python WebSocket');
    };
    
    return ws;
  }
};
