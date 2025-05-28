
import { StockPrediction } from '@/utils/mockData';
import { RiskLevel } from './types';

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
