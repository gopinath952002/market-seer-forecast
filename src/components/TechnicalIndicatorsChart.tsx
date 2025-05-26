
import React from 'react';
import { StockPrediction } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndicatorChartContainer from './technical-indicators/IndicatorChartContainer';
import RSIChart from './technical-indicators/RSIChart';
import MACDChart from './technical-indicators/MACDChart';
import BollingerBandsChart from './technical-indicators/BollingerBandsChart';
import { 
  prepareRSIData, 
  prepareMACDData, 
  prepareBollingerData 
} from './technical-indicators/indicatorUtils';

interface TechnicalIndicatorsChartProps {
  prediction: StockPrediction;
}

const TechnicalIndicatorsChart: React.FC<TechnicalIndicatorsChartProps> = ({ prediction }) => {
  // Prepare data for each chart
  const rsiData = prepareRSIData(prediction);
  const macdData = prepareMACDData(prediction);
  const bollingerData = prepareBollingerData(prediction);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 h-[600px] w-full max-w-5xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Technical Indicators</h2>
      
      <Tabs defaultValue="rsi" className="h-[calc(100%-3rem)] w-full flex flex-col">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="rsi" className="text-sm">RSI</TabsTrigger>
          <TabsTrigger value="macd" className="text-sm">MACD</TabsTrigger>
          <TabsTrigger value="bollinger" className="text-sm">Bollinger Bands</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 w-full min-h-0">
          <TabsContent value="rsi" className="h-full w-full m-0">
            <IndicatorChartContainer 
              title="RSI" 
              description="Relative Strength Index (RSI) helps identify overbought or oversold conditions"
            >
              <RSIChart rsiData={rsiData} />
            </IndicatorChartContainer>
          </TabsContent>
          
          <TabsContent value="macd" className="h-full w-full m-0">
            <IndicatorChartContainer 
              title="MACD" 
              description="Moving Average Convergence Divergence (MACD) shows momentum changes"
            >
              <MACDChart macdData={macdData} />
            </IndicatorChartContainer>
          </TabsContent>
          
          <TabsContent value="bollinger" className="h-full w-full m-0">
            <IndicatorChartContainer 
              title="Bollinger Bands" 
              description="Bollinger Bands show volatility and potential price reversals using standard deviations"
            >
              <BollingerBandsChart bollingerData={bollingerData} />
            </IndicatorChartContainer>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TechnicalIndicatorsChart;
