
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
import { AlertTriangle, ChevronDown } from 'lucide-react';

const Index = () => {
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  const handleSearch = (ticker: string) => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      const result = getStockPrediction(ticker);
      setPrediction(result);
      setIsLoading(false);
    }, 1500);
  };
  
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
        
        <div className="mb-8">
          <StockSearch onSearch={handleSearch} />
        </div>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-t-finance-blue dark:border-t-finance-teal border-gray-200 dark:border-gray-700 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Processing data and generating predictions...
            </p>
          </div>
        )}
        
        {!isLoading && prediction && (
          <div className="space-y-8">
            <PredictionChart prediction={prediction} />
            <TechnicalIndicatorsChart prediction={prediction} />
            <PredictionMetrics prediction={prediction} />
            
            {/* Future Todo: Add detailed analysis component */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center border border-dashed border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Integration Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                In the next version, this app will connect to a real backend API that uses TensorFlow LSTM models to generate predictions based on real stock data.
              </p>
            </div>
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
