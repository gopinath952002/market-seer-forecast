
import React from 'react';
import { StockPrediction } from '@/utils/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, BarChart2, PieChart, Lightbulb, Percent } from 'lucide-react';

interface PredictionMetricsProps {
  prediction: StockPrediction;
}

const PredictionMetrics: React.FC<PredictionMetricsProps> = ({ prediction }) => {
  const { metrics, indicators } = prediction;
  
  // Determine if prediction is relatively bullish or bearish
  const isBullish = indicators.recommendation === "Buy" || indicators.recommendation === "Strong Buy";
  const isBearish = indicators.recommendation === "Sell" || indicators.recommendation === "Strong Sell";
  
  // Define color based on recommendation
  const recommendationColor = isBullish 
    ? "text-finance-green" 
    : (isBearish ? "text-finance-red" : "text-yellow-500");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Prediction metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Prediction Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
              <p className="text-lg font-bold">{metrics.accuracy}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
              <p className="text-lg font-bold">{(metrics.confidence * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">RMSE</p>
              <p className="text-lg font-bold">{metrics.rmse}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">MAE</p>
              <p className="text-lg font-bold">{metrics.mae}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Technical indicators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">RSI</p>
              <p className="text-lg font-bold">{indicators.rsi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">MACD</p>
              <p className="text-lg font-bold">{indicators.macd}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bollinger Upper</p>
              <p className="text-lg font-bold">${indicators.bollingerUpper}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bollinger Lower</p>
              <p className="text-lg font-bold">${indicators.bollingerLower}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI recommendation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center pt-2">
            <div className={`text-3xl font-bold ${recommendationColor}`}>
              {indicators.recommendation}
            </div>
            <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
              {isBullish ? (
                "Technical indicators suggest a positive outlook for this stock."
              ) : isBearish ? (
                "Technical indicators suggest caution with this stock."
              ) : (
                "Technical indicators suggest a neutral position for this stock."
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionMetrics;
