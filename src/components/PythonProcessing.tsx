
import React, { useEffect, useState } from 'react';
import { pythonService } from '@/services/pythonService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PythonProcessingProps {
  data?: any;
  onProcessed?: (results: any) => void;
}

const PythonProcessing: React.FC<PythonProcessingProps> = ({ 
  data = null, 
  onProcessed 
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  // Function to process data with Python
  const processData = async () => {
    if (!data) return;
    
    setLoading(true);
    try {
      const result = await pythonService.processData(data);
      setResults(result);
      if (onProcessed) onProcessed(result);
      
      toast({
        title: "Processing Complete",
        description: "Data has been processed successfully",
      });
    } catch (error) {
      console.error('Error processing data:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const ws = pythonService.connectWebSocket((data) => {
      setRealtimeData(prev => [...prev, data].slice(-10)); // Keep last 10 updates
    });
    
    setWebSocket(ws);
    
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Python Data Processing</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Process your data in real-time using Python backend services
        </p>
      </div>

      <div className="flex space-x-4">
        <Button 
          onClick={processData} 
          disabled={loading || !data}
          className="bg-finance-blue hover:bg-finance-blue/90 dark:bg-finance-teal dark:hover:bg-finance-teal/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Data'
          )}
        </Button>
      </div>

      {results && (
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
          <h4 className="text-sm font-medium mb-2">Processing Results:</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      {realtimeData.length > 0 && (
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
          <h4 className="text-sm font-medium mb-2">Real-time Updates:</h4>
          <div className="space-y-2 max-h-40 overflow-auto">
            {realtimeData.map((item, index) => (
              <div key={index} className="text-xs p-2 bg-white dark:bg-gray-700 rounded">
                {JSON.stringify(item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonProcessing;
