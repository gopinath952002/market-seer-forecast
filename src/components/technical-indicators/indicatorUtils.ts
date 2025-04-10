
import { StockPrediction } from '@/utils/mockData';

// Prepare RSI data from prediction object
export const prepareRSIData = (prediction: StockPrediction) => {
  const { historicalData, indicators } = prediction;
  
  // Generate mock RSI values for demonstration
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
  
  // Generate mock MACD values for demonstration
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

// Prepare Bollinger Bands data from prediction object
export const prepareBollingerData = (prediction: StockPrediction) => {
  const { historicalData, predictionData, indicators } = prediction;
  
  // Combine historical and prediction data
  return [...historicalData.slice(-30), ...predictionData].map((item) => {
    // Handle different types safely using type checking
    const price = 'price' in item ? item.price : ('actual' in item && item.actual) || 0;
    
    return {
      date: item.date,
      price: price,
      upperBand: indicators.bollingerUpper,
      lowerBand: indicators.bollingerLower,
      middleBand: (indicators.bollingerUpper + indicators.bollingerLower) / 2
    };
  });
};
