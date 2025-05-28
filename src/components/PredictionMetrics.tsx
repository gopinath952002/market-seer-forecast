
import React, { useState } from 'react';
import { StockPrediction } from '@/utils/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, BarChart2, PieChart, Lightbulb, Percent, Info, BookOpen, Bell, EyeIcon, EyeOffIcon } from 'lucide-react';
import { 
  calculateRiskLevel, 
  getRSIEducationalContext, 
  getMACDEducationalContext,
  getBollingerEducationalContext,
  getRecommendationContext,
  RiskLevel
} from './technical-indicators/indicatorUtils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import DisclaimerAlert from './DisclaimerAlert';
import { convertUsdToInr, formatINR, isIndianStock } from '@/utils/currencyUtils';

interface PredictionMetricsProps {
  prediction: StockPrediction;
}

const PredictionMetrics: React.FC<PredictionMetricsProps> = ({ prediction }) => {
  const { metrics, indicators } = prediction;
  const [showEducation, setShowEducation] = useState(false);
  
  // Check if this is an Indian stock - if so, don't convert prices
  const shouldConvertToINR = !isIndianStock(prediction.ticker);
  
  // Convert current price to INR for Bollinger context only if it's a US stock
  const currentPriceINR = shouldConvertToINR ? convertUsdToInr(prediction.metadata.currentPrice) : prediction.metadata.currentPrice;
  const bollingerUpperINR = shouldConvertToINR ? convertUsdToInr(indicators.bollingerUpper) : indicators.bollingerUpper;
  const bollingerLowerINR = shouldConvertToINR ? convertUsdToInr(indicators.bollingerLower) : indicators.bollingerLower;
  
  // Determine if prediction is relatively bullish or bearish
  const isBullish = indicators.recommendation === "Buy" || indicators.recommendation === "Strong Buy";
  const isBearish = indicators.recommendation === "Sell" || indicators.recommendation === "Strong Sell";
  
  // Define color based on recommendation
  const recommendationColor = isBullish 
    ? "text-finance-green" 
    : (isBearish ? "text-finance-red" : "text-yellow-500");

  // Get risk level
  const riskLevel = calculateRiskLevel(prediction);
  
  // Define color for risk level badge - fixing the "warning" variant issue
  const riskBadgeVariant = 
    riskLevel === 'Low' ? "secondary" : 
    riskLevel === 'Medium' ? "outline" : "destructive";

  // Education context for indicators
  const rsiContext = getRSIEducationalContext(indicators.rsi);
  const macdContext = getMACDEducationalContext(indicators.macd);
  const bollingerContext = getBollingerEducationalContext(
    currentPriceINR,
    bollingerUpperINR,
    bollingerLowerINR
  );
  const recommendationContext = getRecommendationContext(indicators.recommendation, indicators.rsi);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Prediction Metrics & Indicators</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowEducation(!showEducation)}
            className="flex items-center gap-1.5"
          >
            {showEducation ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {showEducation ? 'Hide' : 'Show'} Educational Context
          </Button>
        </div>
      </div>

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
            
            {showEducation && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm">
                <p className="mb-1 font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  About These Metrics
                </p>
                <ul className="list-disc pl-5 text-blue-700 dark:text-blue-200 space-y-1">
                  <li><strong>Accuracy</strong>: Percentage of predictions within acceptable range</li>
                  <li><strong>Confidence</strong>: Model's certainty in its predictions</li>
                  <li><strong>RMSE/MAE</strong>: Error rates (lower is better)</li>
                </ul>
              </div>
            )}
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
              <TooltipProvider>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          RSI <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </p>
                        <p className="text-lg font-bold">{indicators.rsi}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{rsiContext}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          MACD <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </p>
                        <p className="text-lg font-bold">{indicators.macd}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{macdContext}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          Bollinger Upper <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </p>
                        <p className="text-lg font-bold">{formatINR(bollingerUpperINR)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{bollingerContext}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          Bollinger Lower <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </p>
                        <p className="text-lg font-bold">{formatINR(bollingerLowerINR)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{bollingerContext}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
            
            {showEducation && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm">
                <p className="mb-1 font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Understanding Technical Indicators
                </p>
                <ul className="list-disc pl-5 text-blue-700 dark:text-blue-200 space-y-1">
                  <li><strong>RSI</strong>: &gt;70 overbought, &lt;30 oversold</li>
                  <li><strong>MACD</strong>: Momentum indicator, shows trend changes</li>
                  <li><strong>Bollinger</strong>: Price volatility bands</li>
                </ul>
                <div className="mt-2 flex justify-end">
                  <a 
                    href="https://www.investopedia.com/technical-analysis-4689657" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            )}
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
              <div className="flex items-center gap-2">
                <div className={`text-3xl font-bold ${recommendationColor}`}>
                  {indicators.recommendation}
                </div>
                <Badge variant={riskBadgeVariant}>{riskLevel} Risk</Badge>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                {recommendationContext}
              </div>
              
              {showEducation && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm w-full">
                  <p className="mb-1 font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Interpreting Risk Level
                  </p>
                  <ul className="list-disc pl-5 text-blue-700 dark:text-blue-200 space-y-1">
                    <li><strong>Low Risk</strong>: Higher confidence, lower volatility</li>
                    <li><strong>Medium Risk</strong>: Moderate confidence and volatility</li>
                    <li><strong>High Risk</strong>: Lower confidence, higher volatility</li>
                  </ul>
                  <div className="mt-2 flex justify-end">
                    <a 
                      href="https://www.investopedia.com/terms/r/risk.asp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Learn more about risk
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer section */}
      <DisclaimerAlert className="mt-6" />
    </div>
  );
};

export default PredictionMetrics;
