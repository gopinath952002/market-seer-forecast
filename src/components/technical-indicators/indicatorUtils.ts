import { StockPrediction } from '@/utils/mockData';

// Prepare RSI data from prediction object
export const prepareRSIData = (prediction: StockPrediction) => {
  const { historicalData, indicators } = prediction;
  
  // Generate dynamic RSI values for demonstration
  return historicalData.slice(-30).map((item, index) => {
    const baseRsi = indicators.rsi;
    const fluctuation = Math.sin(index / 3) * 8;
    const rsiValue = Math.max(0, Math.min(100, baseRsi + fluctuation));
    
    return {
      date: item.date,
      rsi: rsiValue
    };
  });
};

// Prepare MACD data from prediction object
export const prepareMACDData = (prediction: StockPrediction) => {
  const { historicalData, indicators } = prediction;
  
  // Generate dynamic MACD values for demonstration
  return historicalData.slice(-30).map((item, index) => {
    const baseMACD = indicators.macd;
    const signal = baseMACD - 0.5 + (Math.sin(index / 4) * 0.7);
    const histogram = (baseMACD - signal) * 2;
    
    return {
      date: item.date,
      macd: baseMACD + Math.sin(index / 3) * 0.8,
      signal: signal,
      histogram: histogram
    };
  });
};

// Define interfaces for Bollinger Bands data to fix the type issues
interface BollingerHistoricalDataPoint {
  date: string;
  price: number;
  upperBand: number;
  lowerBand: number;
  middleBand: number;
  isPrediction: boolean;
}

interface BollingerPredictionDataPoint extends BollingerHistoricalDataPoint {
  confidenceInterval: string;
}

// Prepare Bollinger Bands data from prediction object with dynamic values
export const prepareBollingerData = (prediction: StockPrediction) => {
  const { historicalData, predictionData, indicators } = prediction;
  
  // Standard deviation multiplier for Bollinger Bands
  const stdDevMultiplier = 2;
  
  // Calculate historical volatility
  const historicalPrices = historicalData.map(item => item.price);
  const avgPrice = historicalPrices.reduce((sum, price) => sum + price, 0) / historicalPrices.length;
  const variance = historicalPrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / historicalPrices.length;
  const stdDev = Math.sqrt(variance);
  
  const baseVolatility = stdDev / avgPrice; // As a percentage of price
  
  // Combine historical and prediction data
  const combinedData = [...historicalData.slice(-30)];
  const predictionStartDate = predictionData[0]?.date;
  
  // Process historical data
  const result: (BollingerHistoricalDataPoint | BollingerPredictionDataPoint)[] = combinedData.map((item, index) => {
    const price = item.price;
    const volatilityFactor = baseVolatility * (1 + Math.sin(index / 10) * 0.3);
    const middleBand = price;
    const bandWidth = price * volatilityFactor * stdDevMultiplier;
    
    return {
      date: item.date,
      price,
      upperBand: price + bandWidth,
      lowerBand: price - bandWidth,
      middleBand,
      isPrediction: false
    };
  });
  
  // Add prediction data
  predictionData.forEach(item => {
    if (!item.predicted) return;
    
    // Increase volatility for predictions (wider bands indicate more uncertainty)
    const price = 'actual' in item && item.actual ? item.actual : item.predicted;
    const daysSincePredictionStart = new Date(item.date).getTime() - new Date(predictionStartDate).getTime();
    const daysOffset = daysSincePredictionStart / (1000 * 60 * 60 * 24);
    
    // Volatility increases the further we predict
    const volatilityFactor = baseVolatility * (1 + (daysOffset * 0.05));
    const bandWidth = item.predicted * volatilityFactor * stdDevMultiplier;
    
    const predictionPoint: BollingerPredictionDataPoint = {
      date: item.date,
      price: price,
      upperBand: item.predicted + bandWidth,
      lowerBand: item.predicted - bandWidth,
      middleBand: item.predicted,
      isPrediction: true,
      confidenceInterval: bandWidth.toFixed(2)
    };
    
    result.push(predictionPoint);
  });
  
  return result;
};

// Generate confidence intervals for prediction data
export const addConfidenceIntervals = (prediction: StockPrediction) => {
  const { predictionData, metrics } = prediction;
  
  const baseConfidence = metrics.confidence;
  const volatility = 1 - baseConfidence; // Higher confidence = lower volatility
  
  return predictionData.map((item, index) => {
    if (!item.predicted) return item;
    
    // If the item already has confidence intervals, return it as is
    if (item.confidenceInterval && item.lowerBound && item.upperBound) {
      return item;
    }
    
    // Increasing uncertainty over time
    const volatilityFactor = volatility * (1 + (index * 0.1));
    const interval = item.predicted * volatilityFactor * 0.05;
    
    return {
      ...item,
      confidenceInterval: interval.toFixed(2),
      lowerBound: (item.predicted - interval).toFixed(2),
      upperBound: (item.predicted + interval).toFixed(2)
    };
  });
};

// New functions for educational context and risk scoring

// Define risk level types
export type RiskLevel = 'Low' | 'Medium' | 'High';

// Calculate risk level based on indicators and prediction confidence
export const calculateRiskLevel = (prediction: StockPrediction): RiskLevel => {
  const { indicators, metrics } = prediction;
  
  // Factors that contribute to risk assessment
  const volatility = 1 - metrics.confidence; // Higher confidence = lower volatility
  const rsiExtreme = Math.abs(indicators.rsi - 50) / 50; // How far RSI is from neutral position
  
  // Bollinger band width as percentage of price
  const bandWidth = (indicators.bollingerUpper - indicators.bollingerLower) / 
    ((indicators.bollingerUpper + indicators.bollingerLower) / 2);
  
  // Combined risk score (0-1)
  const riskScore = (volatility * 0.4) + (rsiExtreme * 0.3) + (bandWidth * 0.3);
  
  // Determine risk level
  if (riskScore < 0.35) return 'Low';
  if (riskScore < 0.65) return 'Medium';
  return 'High';
};

// Get educational context for RSI
export const getRSIEducationalContext = (rsi: number): string => {
  if (rsi >= 70) return "RSI above 70 indicates an overbought condition, suggesting potential price reversal or correction.";
  if (rsi <= 30) return "RSI below 30 indicates an oversold condition, suggesting a potential buying opportunity.";
  return "RSI between 30-70 indicates the asset is trading in a neutral zone.";
};

// Get educational context for MACD
export const getMACDEducationalContext = (macd: number): string => {
  if (macd > 0.5) return "Positive MACD suggests strong upward momentum. Consider a bullish outlook.";
  if (macd < -0.5) return "Negative MACD suggests strong downward momentum. Consider a bearish outlook.";
  return "MACD near zero indicates a potential trend change or consolidation phase.";
};

// Get educational context for Bollinger Bands
export const getBollingerEducationalContext = (
  price: number, 
  upper: number, 
  lower: number
): string => {
  const nearUpper = (upper - price) / price < 0.03;
  const nearLower = (price - lower) / price < 0.03;
  
  if (nearUpper) return "Price near upper Bollinger Band suggests strong uptrend but potential overbought condition.";
  if (nearLower) return "Price near lower Bollinger Band suggests strong downtrend but potential oversold condition.";
  return "Price between Bollinger Bands indicates normal trading conditions.";
};

// Get recommendation explanation
export const getRecommendationContext = (recommendation: string, rsi: number): string => {
  switch (recommendation) {
    case "Strong Buy":
      return "Technical indicators strongly suggest an entry point, with RSI indicating oversold conditions.";
    case "Buy":
      return "Positive momentum detected with favorable technical indicators supporting a buying opportunity.";
    case "Hold":
      return "Technical indicators suggest waiting for clearer signals before making any trading decisions.";
    case "Sell":
      return "Some technical indicators suggest taking profits or reducing position size.";
    case "Strong Sell":
      return "Technical indicators suggest significant downside risk, with RSI potentially showing overbought conditions.";
    default:
      return "Analyze technical indicators for further insights.";
  }
};
