
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, Shield, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Disclaimer = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="flex-1 container py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild size="sm" className="mb-4">
              <Link to="/" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Predictions
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Shield className="h-6 w-6 text-finance-blue dark:text-finance-teal" />
              Legal Disclaimer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Important information about the use of Market Seer Forecast's predictions.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Not Financial Advice</h2>
            </div>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              All predictions, analyses, and information provided through Market Seer Forecast are for 
              informational and educational purposes only. The content should not be construed as financial advice.
            </p>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Market Seer Forecast does not recommend that any financial instrument should be bought, sold, or held by you. 
              Do conduct your own due diligence and consult your financial advisor before making any investment decisions.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                Trading and investing in financial markets carries a high degree of risk, and can result in the loss of all your investment.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-finance-blue dark:text-finance-teal" />
              <h2 className="text-xl font-semibold">Accuracy of Information</h2>
            </div>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              While we strive to provide accurate and reliable predictions, all forecasts are probabilistic in nature 
              and should be understood as estimates rather than guarantees.
            </p>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Our predictions are based on historical data, technical indicators, and machine learning models. 
              Past performance is not indicative of future results. Market conditions change rapidly and unpredictably.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300">
              By using Market Seer Forecast, you acknowledge that you understand these risks and limitations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">User Agreement</h2>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              By accessing and using Market Seer Forecast, you agree:
            </p>
            
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>That predictions are informational, not investment advice</li>
              <li>To conduct your own research before making any investment decisions</li>
              <li>Not to hold Market Seer Forecast responsible for any investment losses</li>
              <li>To comply with all applicable financial regulations in your jurisdiction</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300">
              If you do not agree to these terms, please discontinue use of the application immediately.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
