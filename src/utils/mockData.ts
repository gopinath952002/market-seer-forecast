
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
  // Tech Companies
  'AAPL': { name: 'Apple Inc.', basePrice: 173.50 },
  'MSFT': { name: 'Microsoft Corporation', basePrice: 329.80 },
  'GOOG': { name: 'Alphabet Inc.', basePrice: 132.60 },
  'GOOGL': { name: 'Alphabet Inc. Class A', basePrice: 131.85 },
  'AMZN': { name: 'Amazon.com, Inc.', basePrice: 139.75 },
  'META': { name: 'Meta Platforms, Inc.', basePrice: 302.85 },
  'TSLA': { name: 'Tesla, Inc.', basePrice: 251.45 },
  'NVDA': { name: 'NVIDIA Corporation', basePrice: 432.50 },
  'NFLX': { name: 'Netflix, Inc.', basePrice: 434.20 },
  'INTC': { name: 'Intel Corporation', basePrice: 35.20 },
  'AMD': { name: 'Advanced Micro Devices, Inc.', basePrice: 108.45 },
  'CSCO': { name: 'Cisco Systems, Inc.', basePrice: 48.75 },
  'ADBE': { name: 'Adobe Inc.', basePrice: 412.30 },
  'CRM': { name: 'Salesforce, Inc.', basePrice: 251.90 },
  'PYPL': { name: 'PayPal Holdings, Inc.', basePrice: 62.80 },

  // Financial Companies
  'JPM': { name: 'JPMorgan Chase & Co.', basePrice: 141.20 },
  'BAC': { name: 'Bank of America Corporation', basePrice: 33.45 },
  'WFC': { name: 'Wells Fargo & Company', basePrice: 43.60 },
  'C': { name: 'Citigroup Inc.', basePrice: 52.70 },
  'GS': { name: 'The Goldman Sachs Group, Inc.', basePrice: 368.50 },
  'MS': { name: 'Morgan Stanley', basePrice: 87.90 },
  'V': { name: 'Visa Inc.', basePrice: 235.40 },
  'MA': { name: 'Mastercard Incorporated', basePrice: 371.60 },
  'AXP': { name: 'American Express Company', basePrice: 169.30 },
  'BLK': { name: 'BlackRock, Inc.', basePrice: 715.20 },
  
  // Healthcare Companies
  'JNJ': { name: 'Johnson & Johnson', basePrice: 162.40 },
  'PFE': { name: 'Pfizer Inc.', basePrice: 30.25 },
  'ABBV': { name: 'AbbVie Inc.', basePrice: 167.85 },
  'MRK': { name: 'Merck & Co., Inc.', basePrice: 124.70 },
  'UNH': { name: 'UnitedHealth Group Incorporated', basePrice: 515.30 },
  'CVS': { name: 'CVS Health Corporation', basePrice: 75.60 },
  'ABT': { name: 'Abbott Laboratories', basePrice: 111.20 },
  'TMO': { name: 'Thermo Fisher Scientific Inc.', basePrice: 575.40 },
  'DHR': { name: 'Danaher Corporation', basePrice: 248.90 },
  'LLY': { name: 'Eli Lilly and Company', basePrice: 482.70 },
  
  // Consumer Goods & Retail
  'WMT': { name: 'Walmart Inc.', basePrice: 59.60 },
  'PG': { name: 'The Procter & Gamble Company', basePrice: 162.35 },
  'KO': { name: 'The Coca-Cola Company', basePrice: 58.70 },
  'PEP': { name: 'PepsiCo, Inc.', basePrice: 172.80 },
  'COST': { name: 'Costco Wholesale Corporation', basePrice: 564.30 },
  'MCD': { name: 'McDonald\'s Corporation', basePrice: 285.90 },
  'NKE': { name: 'NIKE, Inc.', basePrice: 103.40 },
  'SBUX': { name: 'Starbucks Corporation', basePrice: 95.70 },
  'HD': { name: 'The Home Depot, Inc.', basePrice: 337.80 },
  'TGT': { name: 'Target Corporation', basePrice: 141.35 },
  
  // Industrial & Energy
  'XOM': { name: 'Exxon Mobil Corporation', basePrice: 112.80 },
  'CVX': { name: 'Chevron Corporation', basePrice: 160.25 },
  'BA': { name: 'The Boeing Company', basePrice: 188.30 },
  'CAT': { name: 'Caterpillar Inc.', basePrice: 278.45 },
  'GE': { name: 'General Electric Company', basePrice: 124.60 },
  'MMM': { name: '3M Company', basePrice: 102.30 },
  'HON': { name: 'Honeywell International Inc.', basePrice: 201.75 },
  'UPS': { name: 'United Parcel Service, Inc.', basePrice: 153.40 },
  'RTX': { name: 'RTX Corporation', basePrice: 87.65 },
  'DE': { name: 'Deere & Company', basePrice: 398.20 }
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

// Update popular tickers to show more options
export const popularTickers = [
  'AAPL', 'MSFT', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'WMT'
];

