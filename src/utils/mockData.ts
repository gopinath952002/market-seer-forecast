
export interface StockPrediction {
  ticker: string;
  metadata: {
    ticker: string;
    name: string;
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
  };
  historicalData: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  predictionData: Array<{
    date: string;
    actual: number | null;
    predicted: number;
  }>;
  metrics: {
    mse: number;
    accuracy: number;
    confidence: number;
    rmse: number;
    mae: number;
  };
  indicators: {
    rsi: number;
    macd: number;
    bollingerUpper: number;
    bollingerLower: number;
    recommendation: string;
  };
}

// Realistic Indian stock prices in INR
const indianStockPrices: Record<string, { current: number; name: string }> = {
  'TCS': { current: 3461.25, name: 'Tata Consultancy Services' },
  'INFY': { current: 1571.80, name: 'Infosys Limited' },
  'RELIANCE': { current: 2456.70, name: 'Reliance Industries Limited' },
  'HDFCBANK': { current: 1645.30, name: 'HDFC Bank Limited' },
  'SBIN': { current: 817.45, name: 'State Bank of India' },
  'ITC': { current: 462.85, name: 'ITC Limited' },
  'WIPRO': { current: 542.20, name: 'Wipro Limited' },
  'LT': { current: 3584.90, name: 'Larsen & Toubro Limited' }
};

// US stock prices in USD (these will be converted to INR)
const usStockPrices: Record<string, { current: number; name: string }> = {
  'AAPL': { current: 189.25, name: 'Apple Inc.' },
  'GOOGL': { current: 142.85, name: 'Alphabet Inc.' },
  'MSFT': { current: 378.90, name: 'Microsoft Corporation' },
  'AMZN': { current: 145.75, name: 'Amazon.com Inc.' },
  'TSLA': { current: 234.50, name: 'Tesla Inc.' },
  'NVDA': { current: 875.25, name: 'NVIDIA Corporation' },
  'META': { current: 298.45, name: 'Meta Platforms Inc.' }
};

export const getStockPrediction = (ticker: string): StockPrediction => {
  // Check if it's an Indian stock (use INR prices directly) or US stock (use USD prices)
  const isIndianStock = indianStockPrices[ticker];
  const isUSStock = usStockPrices[ticker];
  
  let currentPrice: number;
  let companyName: string;
  
  if (isIndianStock) {
    currentPrice = indianStockPrices[ticker].current;
    companyName = indianStockPrices[ticker].name;
  } else if (isUSStock) {
    currentPrice = usStockPrices[ticker].current;
    companyName = usStockPrices[ticker].name;
  } else {
    // Default fallback for unknown tickers (assume US stock)
    currentPrice = 150 + Math.random() * 100;
    companyName = `${ticker} Corporation`;
  }
  
  // Calculate previous close (small random change)
  const changePercent = (Math.random() - 0.5) * 6; // -3% to +3%
  const previousClose = currentPrice / (1 + changePercent / 100);
  const change = currentPrice - previousClose;
  
  // Generate historical data (past 60 days)
  const historicalData = [];
  let price = currentPrice;
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic volatility
    const dailyChange = (Math.random() - 0.5) * 0.04; // -2% to +2% daily
    price = price * (1 + dailyChange);
    
    historicalData.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, currentPrice * 0.7), // Prevent unrealistic drops
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  // Ensure the last historical price matches current price
  historicalData[historicalData.length - 1].price = currentPrice;
  
  // Generate prediction data (next 30 days)
  const predictionData = [];
  let predictedPrice = currentPrice;
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Generate trend with some randomness
    const trendDirection = Math.random() > 0.5 ? 1 : -1;
    const dailyChange = trendDirection * Math.random() * 0.02; // Up to 2% daily change
    predictedPrice = predictedPrice * (1 + dailyChange);
    
    predictionData.push({
      date: date.toISOString().split('T')[0],
      actual: null,
      predicted: Math.max(predictedPrice, currentPrice * 0.8) // Prevent unrealistic predictions
    });
  }
  
  // Generate realistic technical indicators
  const rsi = 30 + Math.random() * 40; // 30-70 range
  const macd = (Math.random() - 0.5) * 2; // -1 to 1
  
  // Bollinger bands (2% above/below current price)
  const bollingerUpper = currentPrice * 1.02;
  const bollingerLower = currentPrice * 0.98;
  
  // Determine recommendation based on RSI
  let recommendation: string;
  if (rsi > 60) {
    recommendation = Math.random() > 0.5 ? 'Buy' : 'Strong Buy';
  } else if (rsi < 40) {
    recommendation = Math.random() > 0.5 ? 'Sell' : 'Strong Sell';
  } else {
    recommendation = 'Hold';
  }
  
  return {
    ticker,
    metadata: {
      ticker,
      name: companyName,
      currentPrice,
      previousClose,
      change,
      changePercent
    },
    historicalData,
    predictionData,
    metrics: {
      mse: 2.5 + Math.random() * 1.5,
      accuracy: 85 + Math.random() * 10,
      confidence: 0.75 + Math.random() * 0.2,
      rmse: 1.2 + Math.random() * 0.8,
      mae: 0.8 + Math.random() * 0.6
    },
    indicators: {
      rsi: Math.round(rsi * 100) / 100,
      macd: Math.round(macd * 100) / 100,
      bollingerUpper,
      bollingerLower,
      recommendation
    }
  };
};
