
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
