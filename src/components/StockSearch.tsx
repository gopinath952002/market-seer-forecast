
import React, { useState } from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { mockStockInfo, popularTickers } from '@/utils/mockData';

interface StockSearchProps {
  onSearch: (ticker: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch }) => {
  const [ticker, setTicker] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSearch = () => {
    if (!ticker.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a stock ticker symbol",
        variant: "destructive"
      });
      return;
    }
    
    const upperTicker = ticker.trim().toUpperCase();
    
    if (!mockStockInfo[upperTicker]) {
      toast({
        title: "Stock Not Found",
        description: `Could not find stock with ticker: ${upperTicker}`,
        variant: "destructive"
      });
      return;
    }
    
    // Add to recent searches (no duplicates)
    if (!recentSearches.includes(upperTicker)) {
      setRecentSearches(prev => [upperTicker, ...prev].slice(0, 3));
    }
    
    onSearch(upperTicker);
    setTicker('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Stock Price Prediction</h2>
      
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Enter stock ticker (e.g., AAPL, TSLA)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            className="bg-finance-blue hover:bg-finance-blue-light dark:bg-finance-teal dark:hover:bg-finance-teal/90"
            onClick={handleSearch}
          >
            Predict
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-4">
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(item => (
                <button
                  key={item}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => onSearch(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular stocks */}
        <div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Popular Stocks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTickers.map(ticker => (
              <button
                key={ticker}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                onClick={() => onSearch(ticker)}
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
