
import { supabase } from "@/integrations/supabase/client";

// Service for communicating with Python backend via our Supabase edge function
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
  },
  
  // Method to analyze financial data with Python
  async analyzeFinancialData(ticker: string, timeframe: string): Promise<any> {
    try {
      const { data: response, error } = await supabase.functions.invoke('python-bridge', {
        body: {
          endpoint: 'analyze',
          data: { ticker, timeframe }
        }
      });
      
      if (error) throw error;
      return response;
    } catch (error) {
      console.error('Error analyzing financial data with Python:', error);
      throw error;
    }
  }
};
