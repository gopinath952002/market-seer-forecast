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
import { AlertTriangle, ChevronDown, Database, BookOpen } from 'lucide-react';
import { useStockData } from '@/services/stockApi';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string>('');
  const [useRealApi, setUseRealApi] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  const { data: apiData, isLoading: isApiLoading, error } = useStockData(
    currentTicker, 
    useRealApi && !!currentTicker
  );
  
  const handleSearch = async (ticker: string) => {
    setCurrentTicker(ticker);
    
    if (useRealApi) {
      // API fetching happens through the React Query hook
    } else {
      setPrediction(null);
      
      setTimeout(async () => {
        const result = getStockPrediction(ticker);
        setPrediction(result);

        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { error } = await supabase
              .from('stock_predictions')
              .insert({
                ticker,
                predicted_direction: result.indicators.recommendation.toLowerCase(),
                initial_price: result.metadata.currentPrice,
                user_id: user.id
              });

            if (error) throw error;

            toast({
              title: "Prediction Tracked",
              description: "We'll notify you about significant price movements.",
            });
          }
        } catch (error) {
          console.error('Error saving prediction:', error);
          toast({
            title: "Error",
            description: "Failed to track prediction. Please try again.",
            variant: "destructive",
          });
        }
      }, 1500);
    }
  };
  
  React.useEffect(() => {
    if (apiData) {
      setPrediction(apiData);
    }
  }, [apiData]);
  
  React.useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);
  
  const isLoading = useRealApi ? isApiLoading : (currentTicker && !prediction);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="flex-1 container py-8 px-4 sm:px-6">
        {showDisclaimer && (
          <div className="glass-card bg-amber-50/80 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 mb-8 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">Demonstration Only</h3>
                <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  <p>This is a demo of a stock prediction interface. All data is simulated and should not be used for investment decisions.</p>
                </div>
              </div>
              <button 
                className="ml-auto text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                onClick={() => setShowDisclaimer(false)}
              >
                <span className="sr-only">Dismiss</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-4 flex items-center justify-end gap-2">
          <Label htmlFor="api-mode" className="text-sm text-gray-600 dark:text-gray-300">
            Use Live API
          </Label>
          <Switch
            id="api-mode"
            checked={useRealApi}
            onCheckedChange={setUseRealApi}
            className="data-[state=checked]:bg-finance-blue dark:data-[state=checked]:bg-finance-teal"
          />
        </div>
        
        <div className="mb-8 transform hover:translate-y-[-2px] transition-all duration-300">
          <StockSearch onSearch={handleSearch} isRealApi={useRealApi} />
        </div>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 glass-card rounded-xl">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-t-finance-blue dark:border-t-finance-teal border-gray-200/50 dark:border-gray-700/50 animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">
              {useRealApi ? 'Fetching live data and generating predictions...' : 'Processing data and generating predictions...'}
            </p>
          </div>
        )}
        
        {!isLoading && prediction && (
          <div className="space-y-8">
            <div className="hover-scale">
              <PredictionChart prediction={prediction} />
            </div>
            <div className="hover-scale">
              <TechnicalIndicatorsChart prediction={prediction} />
            </div>
            <div className="hover-scale">
              <PredictionMetrics prediction={prediction} />
            </div>
            
            <div className="glass-card rounded-lg p-6 border border-blue-200/50 dark:border-blue-500/20 hover-scale">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-finance-blue dark:text-finance-teal" />
                <h3 className="text-lg font-medium text-finance-blue dark:text-finance-teal">
                  Learn More About Technical Analysis
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="https://www.investopedia.com/terms/r/rsi.asp" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-medium mb-2">Understanding RSI</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn how the Relative Strength Index helps identify overbought and oversold conditions.
                  </p>
                </a>
                <a 
                  href="https://www.investopedia.com/terms/m/macd.asp" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-medium mb-2">MACD Explained</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Discover how Moving Average Convergence Divergence shows momentum changes in price.
                  </p>
                </a>
                <a 
                  href="https://www.investopedia.com/terms/b/bollingerbands.asp" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-medium mb-2">Bollinger Bands Guide</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn how Bollinger Bands help visualize volatility and potential reversals.
                  </p>
                </a>
              </div>
            </div>
            
            {!useRealApi && (
              <div className="glass-card rounded-lg p-6 text-center border border-blue-200/50 dark:border-blue-500/20 hover-scale">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-finance-blue dark:text-finance-teal animated-pulse" />
                  <h3 className="text-lg font-medium text-finance-blue dark:text-finance-teal">
                    Try the Live API
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Toggle the "Use Live API" switch above to fetch real stock data from Alpha Vantage API.
                </p>
              </div>
            )}
          </div>
        )}
        
        {!isLoading && !prediction && error && (
          <div className="bg-red-50/80 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 glass-card">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">API Error</h3>
            <p className="text-red-700 dark:text-red-300">
              There was a problem fetching stock data. Please try again later or try a different ticker symbol.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      
      <ChatSupportButton />
      <ChatDialog />
      <Toaster />
    </div>
  );
};

export default Index;
