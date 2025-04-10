
import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-finance-blue dark:bg-finance-teal rounded-md p-2">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-finance-blue dark:text-finance-teal">Market Seer</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stock Price Prediction with AI</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm">
          <a href="#" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </a>
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal">Documentation</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
