
import { StockPrediction } from '@/utils/mockData';
import { EnhancedPredictionData, BollingerHistoricalDataPoint, BollingerPredictionDataPoint } from './types';

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
    const price = item.actual ? item.actual : item.predicted;
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
export const addConfidenceIntervals = (prediction: StockPrediction): EnhancedPredictionData[] => {
  const { predictionData, metrics } = prediction;
  
  const baseConfidence = metrics.confidence;
  const volatility = 1 - baseConfidence; // Higher confidence = lower volatility
  
  return predictionData.map((item, index) => {
    if (!item.predicted) return item as EnhancedPredictionData;
    
    // Increasing uncertainty over time
    const volatilityFactor = volatility * (1 + (index * 0.1));
    const interval = item.predicted * volatilityFactor * 0.05;
    
    return {
      ...item,
      confidenceInterval: interval.toFixed(2),
      lowerBound: (item.predicted - interval).toFixed(2),
      upperBound: (item.predicted + interval).toFixed(2)
    } as EnhancedPredictionData;
  });
};
