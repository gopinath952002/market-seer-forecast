
// Generate realistic stock price data and predictions
import { format, subDays } from 'date-fns';

export interface StockData {
  date: string; // ISO date string
  price: number;
  volume: number;
}

export interface PredictionData {
  date: string; // ISO date string
  actual?: number; // Historical actual price (if available)
  predicted: number;
}

export interface StockMetadata {
  ticker: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

export interface StockPrediction {
  ticker: string;
  metadata: StockMetadata;
  historicalData: StockData[];
  predictionData: PredictionData[];
  metrics: {
    mse: number; // Mean squared error
    rmse: number; // Root mean squared error
    mae: number; // Mean absolute error
    accuracy: number; // Percentage accuracy
    confidence: number; // Prediction confidence (0-1)
  };
  indicators: {
    rsi: number; // Relative Strength Index
    macd: number; // MACD
    bollingerUpper: number; // Bollinger Band Upper
    bollingerLower: number; // Bollinger Band Lower
    recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  };
}

// Helper functions to generate realistic mock data
const getRandomChange = (volatility = 0.02): number => {
  return (Math.random() * 2 - 1) * volatility;
};

const getRandomVolume = (baseVolume = 1000000): number => {
  return Math.floor(baseVolume * (0.5 + Math.random()));
};

export const generateHistoricalData = (
  ticker: string,
  days = 90,
  basePrice = 150
): StockData[] => {
  const data: StockData[] = [];
  let price = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const change = getRandomChange();
    price = price * (1 + change);
    
    data.push({
      date,
      price: parseFloat(price.toFixed(2)),
      volume: getRandomVolume()
    });
  }
  
  return data;
};

export const generatePredictions = (
  historicalData: StockData[], 
  futureDays = 14,
  errorMargin = 0.05
): PredictionData[] => {
  const predictions: PredictionData[] = [];
  
  // Include some historical data with predictions for comparison
  const comparisonDays = 7;
  const startIndex = Math.max(0, historicalData.length - comparisonDays);
  
  // Add predictions for existing data (to show comparison)
  for (let i = startIndex; i < historicalData.length; i++) {
    const item = historicalData[i];
    const error = (Math.random() * 2 - 1) * errorMargin;
    const predictedPrice = item.price * (1 + error);
    
    predictions.push({
      date: item.date,
      actual: item.price,
      predicted: parseFloat(predictedPrice.toFixed(2))
    });
  }
  
  // Generate future predictions
  let lastPrice = historicalData[historicalData.length - 1].price;
  const today = new Date();
  
  for (let i = 1; i <= futureDays; i++) {
    const change = getRandomChange();
    lastPrice = lastPrice * (1 + change);
    const date = format(subDays(today, -i), 'yyyy-MM-dd');
    
    predictions.push({
      date,
      predicted: parseFloat(lastPrice.toFixed(2))
    });
  }
  
  return predictions;
};

export const mockStockInfo: Record<string, { name: string; basePrice: number }> = {
  'AAPL': { name: 'Apple Inc.', basePrice: 173.50 },
  'MSFT': { name: 'Microsoft Corporation', basePrice: 329.80 },
  'TSLA': { name: 'Tesla, Inc.', basePrice: 251.45 },
  'AMZN': { name: 'Amazon.com, Inc.', basePrice: 139.75 },
  'GOOG': { name: 'Alphabet Inc.', basePrice: 132.60 },
  'META': { name: 'Meta Platforms, Inc.', basePrice: 302.85 },
  'NFLX': { name: 'Netflix, Inc.', basePrice: 434.20 },
  'NVDA': { name: 'NVIDIA Corporation', basePrice: 432.50 },
};

export const getStockPrediction = (ticker: string): StockPrediction | null => {
  const stockInfo = mockStockInfo[ticker.toUpperCase()];
  
  if (!stockInfo) {
    return null;
  }
  
  const historicalData = generateHistoricalData(
    ticker, 
    90, 
    stockInfo.basePrice
  );
  
  const lastClose = historicalData[historicalData.length - 1].price;
  const prevClose = historicalData[historicalData.length - 2].price;
  const change = lastClose - prevClose;
  const changePercent = (change / prevClose) * 100;
  
  const predictionData = generatePredictions(historicalData);
  
  // Random indicators but realistic ranges
  const rsi = 30 + Math.random() * 40; // Between 30-70
  const macd = -2 + Math.random() * 4; // Between -2 and 2
  const bollingerRange = lastClose * 0.1; // 10% range for Bollinger bands
  
  // Determine recommendation based on indicators
  let recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  if (rsi < 30) recommendation = "Strong Buy";
  else if (rsi < 40) recommendation = "Buy";
  else if (rsi < 60) recommendation = "Hold";
  else if (rsi < 70) recommendation = "Sell";
  else recommendation = "Strong Sell";
  
  return {
    ticker,
    metadata: {
      ticker,
      name: stockInfo.name,
      currentPrice: lastClose,
      previousClose: prevClose,
      change,
      changePercent
    },
    historicalData,
    predictionData,
    metrics: {
      mse: parseFloat((Math.random() * 10).toFixed(2)),
      rmse: parseFloat((Math.random() * 3).toFixed(2)),
      mae: parseFloat((Math.random() * 2).toFixed(2)),
      accuracy: parseFloat((70 + Math.random() * 20).toFixed(2)),
      confidence: parseFloat((0.6 + Math.random() * 0.3).toFixed(2))
    },
    indicators: {
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(2)),
      bollingerUpper: parseFloat((lastClose + bollingerRange).toFixed(2)),
      bollingerLower: parseFloat((lastClose - bollingerRange).toFixed(2)),
      recommendation
    }
  };
};

export const popularTickers = Object.keys(mockStockInfo).slice(0, 5);
