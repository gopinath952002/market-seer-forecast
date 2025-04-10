
import React, { useState } from 'react';
import Header from '@/components/Header';
import StockSearch from '@/components/StockSearch';
import PredictionChart from '@/components/PredictionChart';
import TechnicalIndicatorsChart from '@/components/TechnicalIndicatorsChart';
import PredictionMetrics from '@/components/PredictionMetrics';
import Footer from '@/components/Footer';
import ChatSupportButton from '@/components/ChatSupportButton';
import ChatDialog from '@/components/ChatDialog';
import { getStockPrediction, StockPrediction } from '@/utils/mockData';
import { AlertTriangle, ChevronDown, Database } from 'lucide-react';
import { useStockData } from '@/services/stockApi';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string>('');
  const [useRealApi, setUseRealApi] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  // Set up the React Query hook
  const { data: apiData, isLoading: isApiLoading, error } = useStockData(
    currentTicker, 
    useRealApi && !!currentTicker
  );
  
  const handleSearch = (ticker: string) => {
    setCurrentTicker(ticker);
    
    if (useRealApi) {
      // API fetching happens through the React Query hook
      // The UI will update when the data loads
    } else {
      // Use mock data
      // Simulate API call with a delay
      setPrediction(null);
      
      setTimeout(() => {
        const result = getStockPrediction(ticker);
        setPrediction(result);
      }, 1500);
    }
  };
  
  // Update prediction when API data loads
  React.useEffect(() => {
    if (apiData) {
      setPrediction(apiData);
    }
  }, [apiData]);
  
  // Handle API errors
  React.useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);
  
  // Determine if we're in a loading state
  const isLoading = useRealApi ? isApiLoading : (currentTicker && !prediction);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Disclaimer banner */}
        {showDisclaimer && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800">Demonstration Only</h3>
                <div className="text-sm text-amber-700 mt-1">
                  <p>This is a demo of a stock prediction interface. All data is simulated and should not be used for investment decisions.</p>
                </div>
              </div>
              <button 
                className="ml-auto text-amber-600 hover:text-amber-800"
                onClick={() => setShowDisclaimer(false)}
              >
                <span className="sr-only">Dismiss</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* API Switch */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <Label htmlFor="api-mode" className="text-sm text-gray-500">
            Use Live API
          </Label>
          <Switch
            id="api-mode"
            checked={useRealApi}
            onCheckedChange={setUseRealApi}
          />
        </div>
        
        <div className="mb-8">
          <StockSearch onSearch={handleSearch} isRealApi={useRealApi} />
        </div>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-t-finance-blue dark:border-t-finance-teal border-gray-200 dark:border-gray-700 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {useRealApi ? 'Fetching live data and generating predictions...' : 'Processing data and generating predictions...'}
            </p>
          </div>
        )}
        
        {!isLoading && prediction && (
          <div className="space-y-8">
            <PredictionChart prediction={prediction} />
            <TechnicalIndicatorsChart prediction={prediction} />
            <PredictionMetrics prediction={prediction} />
            
            {!useRealApi && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center border border-dashed border-gray-300 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Try the Live API
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Toggle the "Use Live API" switch above to fetch real stock data from Alpha Vantage API.
                </p>
              </div>
            )}
          </div>
        )}
        
        {!isLoading && !prediction && error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">API Error</h3>
            <p className="text-red-700 dark:text-red-300">
              There was a problem fetching stock data. Please try again later or try a different ticker symbol.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      
      {/* Chat support components */}
      <ChatSupportButton />
      <ChatDialog />
    </div>
  );
};

export default Index;
