
import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockStockInfo, popularTickers } from '@/utils/mockData';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface StockSearchProps {
  onSearch: (ticker: string) => void;
  isRealApi?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, isRealApi = false }) => {
  const [ticker, setTicker] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<string[]>([]);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter stocks based on input
  useEffect(() => {
    if (ticker.trim()) {
      const filtered = Object.keys(mockStockInfo).filter(
        stock => stock.includes(ticker.toUpperCase()) || 
                mockStockInfo[stock].name.toUpperCase().includes(ticker.toUpperCase())
      ).slice(0, 10); // Limit to 10 results for performance
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  }, [ticker]);
  
  const handleSearch = (selectedTicker: string = ticker) => {
    const upperTicker = selectedTicker.trim().toUpperCase();
    
    if (!upperTicker) {
      toast({
        title: "Empty Search",
        description: "Please enter a stock ticker symbol",
        variant: "destructive"
      });
      return;
    }
    
    // When using real API, skip this validation
    if (!isRealApi && !mockStockInfo[upperTicker]) {
      toast({
        title: "Stock Not Found",
        description: `Could not find stock with ticker: ${upperTicker}`,
        variant: "destructive"
      });
      return;
    }
    
    // Add to recent searches (no duplicates)
    if (!recentSearches.includes(upperTicker)) {
      setRecentSearches(prev => [upperTicker, ...prev].slice(0, 5));
    }
    
    onSearch(upperTicker);
    setTicker('');
    setOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setTicker('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-card rounded-xl shadow-lg p-6 border border-white/20 dark:border-gray-800/50">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-finance-blue dark:text-finance-teal bg-clip-text">Stock Price Prediction</h2>
        {isRealApi && (
          <span className="px-3 py-1 text-xs bg-gradient-to-r from-finance-blue to-accent text-white dark:from-finance-teal dark:to-accent rounded-full shadow-sm">
            Live API
          </span>
        )}
      </div>
      
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Popover open={open && filteredStocks.length > 0} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    ref={inputRef}
                    className="pl-9 pr-8 border-finance-blue/20 dark:border-finance-teal/20 focus:border-finance-blue dark:focus:border-finance-teal transition-all duration-300"
                    placeholder="Search by ticker or company name"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={() => ticker.trim() && setOpen(true)}
                  />
                  {ticker && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </button>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px] border border-blue-100 dark:border-blue-900 shadow-lg" align="start">
                <Command>
                  <CommandList>
                    {filteredStocks.length > 0 ? (
                      <CommandGroup heading="Stocks">
                        {filteredStocks.map((stock) => (
                          <CommandItem
                            key={stock}
                            value={stock}
                            onSelect={() => handleSearch(stock)}
                            className="flex justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            <span className="font-medium">{stock}</span>
                            <span className="text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                              {mockStockInfo[stock].name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No stocks found</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            className="gradient-button shadow-md"
            onClick={() => handleSearch()}
          >
            Predict
          </Button>
        </div>
      </div>
      
      <div className="mt-5 flex flex-col gap-5">
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm text-finance-blue dark:text-finance-teal mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(item => (
                <button
                  key={item}
                  className="px-3 py-1.5 text-sm bg-blue-50/80 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-md flex items-center gap-1.5 transition-all duration-200 border border-blue-100/50 dark:border-blue-800/50"
                  onClick={() => onSearch(item)}
                >
                  <span>{item}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {mockStockInfo[item]?.name && `(${mockStockInfo[item].name.split(' ')[0]})`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular stocks */}
        <div>
          <div className="flex items-center gap-1.5 text-sm text-finance-blue dark:text-finance-teal mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Popular Stocks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTickers.map(ticker => (
              <button
                key={ticker}
                className="px-3 py-1.5 text-sm bg-blue-50/80 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-md flex items-center gap-1.5 transition-all duration-200 border border-blue-100/50 dark:border-blue-800/50"
                onClick={() => onSearch(ticker)}
              >
                <span>{ticker}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {mockStockInfo[ticker]?.name && `(${mockStockInfo[ticker].name.split(' ')[0]})`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
