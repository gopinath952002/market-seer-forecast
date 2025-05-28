
// Enhanced prediction data type with confidence intervals
export interface EnhancedPredictionData {
  date: string;
  actual: number | null;
  predicted: number;
  confidenceInterval?: string;
  lowerBound?: string;
  upperBound?: string;
}

// Define interfaces for Bollinger Bands data
export interface BollingerHistoricalDataPoint {
  date: string;
  price: number;
  upperBand: number;
  lowerBand: number;
  middleBand: number;
  isPrediction: boolean;
}

export interface BollingerPredictionDataPoint extends BollingerHistoricalDataPoint {
  confidenceInterval: string;
}

// Define risk level types
export type RiskLevel = 'Low' | 'Medium' | 'High';
