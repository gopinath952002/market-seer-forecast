
import { supabase } from "@/integrations/supabase/client";

// Service for communicating with Python backend via our Supabase edge function
// Kept for potential future use, but currently not actively used in the application
export const pythonService = {
  // Method to process data with Python
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
  }
};
