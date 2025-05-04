
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronUp, ChevronDown, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockForecasts = [
  { 
    id: 1, 
    ticker: 'AAPL', 
    name: 'Apple Inc.', 
    currentPrice: 174.23, 
    predictedPrice: 189.50,
    changePercent: 8.76,
    recommendation: 'Buy',
    confidence: 85,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 2, 
    ticker: 'MSFT', 
    name: 'Microsoft Corporation', 
    currentPrice: 417.58, 
    predictedPrice: 445.20,
    changePercent: 6.61,
    recommendation: 'Strong Buy',
    confidence: 92,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 3, 
    ticker: 'GOOGL', 
    name: 'Alphabet Inc.', 
    currentPrice: 172.52, 
    predictedPrice: 184.10,
    changePercent: 6.71, 
    recommendation: 'Buy',
    confidence: 78,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 4, 
    ticker: 'AMZN', 
    name: 'Amazon.com Inc.', 
    currentPrice: 181.92, 
    predictedPrice: 199.80,
    changePercent: 9.83,
    recommendation: 'Strong Buy',
    confidence: 89,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 5, 
    ticker: 'META', 
    name: 'Meta Platforms Inc.', 
    currentPrice: 478.22, 
    predictedPrice: 465.30,
    changePercent: -2.70,
    recommendation: 'Hold',
    confidence: 67,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 6, 
    ticker: 'TSLA', 
    name: 'Tesla Inc.', 
    currentPrice: 175.10, 
    predictedPrice: 158.22,
    changePercent: -9.64,
    recommendation: 'Sell',
    confidence: 77,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 7, 
    ticker: 'NVDA', 
    name: 'NVIDIA Corporation', 
    currentPrice: 950.02, 
    predictedPrice: 1025.45,
    changePercent: 7.94,
    recommendation: 'Buy',
    confidence: 83,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
  { 
    id: 8, 
    ticker: 'JPM', 
    name: 'JPMorgan Chase & Co.', 
    currentPrice: 197.48, 
    predictedPrice: 211.20,
    changePercent: 6.95,
    recommendation: 'Buy',
    confidence: 76,
    date: '2025-05-01',
    timeFrame: '30 days'
  },
];

const Forecasts = () => {
  const [sortField, setSortField] = useState('ticker');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedForecasts = [...mockForecasts].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRecommendationClass = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'strong buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'buy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'sell':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'strong sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="flex-1 container py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-finance-blue dark:text-finance-teal">
              Stock Forecasts
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>May 2025</span>
              </Button>
            </div>
          </div>
          
          <Card className="mb-8 shadow-md border-blue-100 dark:border-blue-900/30">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl text-finance-blue dark:text-finance-teal">
                Market AI Forecasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mt-2">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Forecasts</TabsTrigger>
                  <TabsTrigger value="bullish">Bullish</TabsTrigger>
                  <TabsTrigger value="bearish">Bearish</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900">
                      <TableRow>
                        <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('ticker')}>
                          <div className="flex items-center gap-1">
                            Symbol
                            {sortField === 'ticker' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-1">
                            Name
                            {sortField === 'name' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort('currentPrice')}>
                          <div className="flex items-center gap-1 justify-end">
                            Current Price
                            {sortField === 'currentPrice' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort('predictedPrice')}>
                          <div className="flex items-center gap-1 justify-end">
                            Forecast Price
                            {sortField === 'predictedPrice' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                          <div className="flex items-center gap-1 justify-end">
                            Change
                            {sortField === 'changePercent' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('recommendation')}>
                          <div className="flex items-center gap-1">
                            Recommendation
                            {sortField === 'recommendation' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort('confidence')}>
                          <div className="flex items-center gap-1 justify-end">
                            Confidence
                            {sortField === 'confidence' && (
                              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedForecasts.map((forecast) => (
                        <TableRow key={forecast.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium">{forecast.ticker}</TableCell>
                          <TableCell>{forecast.name}</TableCell>
                          <TableCell className="text-right">${forecast.currentPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${forecast.predictedPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className={`inline-flex items-center gap-1 ${forecast.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {forecast.changePercent >= 0 ? 
                                <ArrowUp className="h-3.5 w-3.5" /> : 
                                <ArrowDown className="h-3.5 w-3.5" />
                              }
                              {Math.abs(forecast.changePercent).toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationClass(forecast.recommendation)}`}>
                              {forecast.recommendation}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{forecast.confidence}%</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/?ticker=${forecast.ticker}`}>View</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="bullish">
                  <div className="p-8 text-center text-gray-500">
                    Select the "All Forecasts" tab to view all predictions
                  </div>
                </TabsContent>
                
                <TabsContent value="bearish">
                  <div className="p-8 text-center text-gray-500">
                    Select the "All Forecasts" tab to view all predictions
                  </div>
                </TabsContent>
                
                <TabsContent value="neutral">
                  <div className="p-8 text-center text-gray-500">
                    Select the "All Forecasts" tab to view all predictions
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-blue-100 dark:border-blue-900/30 p-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              Forecasts are generated using advanced AI models and technical analysis. 
              These predictions should be used for informational purposes only and do not constitute financial advice.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Forecasts;
