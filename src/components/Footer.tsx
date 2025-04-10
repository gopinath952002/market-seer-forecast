
import React from 'react';
import { Github, Bot, FileLineChart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Market Seer — AI-Powered Stock Predictions
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Created with React, TensorFlow and LSTM Neural Networks
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-finance-blue dark:hover:text-finance-teal transition-colors"
              aria-label="Project GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-finance-blue dark:hover:text-finance-teal transition-colors"
              aria-label="AI Model Documentation"
            >
              <Bot className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-finance-blue dark:hover:text-finance-teal transition-colors"
              aria-label="Full Analysis"
            >
              <FileLineChart className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          <p>This is a demonstration using simulated data. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
