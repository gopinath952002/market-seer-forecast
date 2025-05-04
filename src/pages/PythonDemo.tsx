
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PythonProcessing from '@/components/PythonProcessing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Play, Brain } from 'lucide-react';

const PythonDemo = () => {
  const [inputData, setInputData] = useState<string>('{"ticker": "AAPL", "days": 30, "analysis_type": "trend"}');
  const [processedResults, setProcessedResults] = useState<any>(null);

  const handleProcess = () => {
    try {
      const parsedData = JSON.parse(inputData);
      return parsedData;
    } catch (e) {
      console.error('Invalid JSON input:', e);
      return null;
    }
  };

  const handleProcessed = (results: any) => {
    setProcessedResults(results);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-finance-blue dark:text-finance-teal mb-4">
              Python Real-time Processing Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Connect to Python backend for advanced real-time data analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-finance-blue dark:text-finance-teal" /> 
                  Input Data
                </CardTitle>
                <CardDescription>
                  Enter JSON data to be processed by the Python backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="font-mono h-[200px]"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder='{"ticker": "AAPL", "days": 30, "analysis_type": "trend"}'
                />
                <Button 
                  className="mt-4 bg-finance-blue hover:bg-finance-blue/90 dark:bg-finance-teal dark:hover:bg-finance-teal/90"
                  onClick={() => handleProcess()}
                >
                  <Play className="mr-2 h-4 w-4" /> Parse Input
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Python Processing</CardTitle>
                <CardDescription>
                  Process data and view real-time results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PythonProcessing 
                  data={handleProcess()} 
                  onProcessed={handleProcessed} 
                />
              </CardContent>
            </Card>
          </div>
          
          {processedResults && (
            <Card>
              <CardHeader>
                <CardTitle>Results Visualization</CardTitle>
                <CardDescription>
                  Visualization of the processed data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-800 rounded-md p-4 min-h-[200px] flex items-center justify-center">
                  {/* This would be replaced with actual visualization based on results */}
                  <p className="text-gray-500 dark:text-gray-400">
                    Visualization would appear here based on Python processing results
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Next Steps for Python Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Deploy a Python FastAPI server with WebSocket support</li>
                <li>Update the edge function with your Python server URL</li>
                <li>Connect your React app to the Python backend</li>
                <li>Implement advanced data processing algorithms in Python</li>
                <li>Add real-time data visualization in the frontend</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PythonDemo;
