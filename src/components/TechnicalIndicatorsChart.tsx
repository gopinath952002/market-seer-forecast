
import React from 'react';
import { StockPrediction } from '@/utils/mockData';
import { format, parseISO } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar, 
  ComposedChart, Area
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TechnicalIndicatorsChartProps {
  prediction: StockPrediction;
}

const TechnicalIndicatorsChart: React.FC<TechnicalIndicatorsChartProps> = ({ prediction }) => {
  const { historicalData, predictionData, indicators } = prediction;

  // Prepare RSI data
  const rsiData = historicalData.slice(-30).map((item, index) => {
    // Generate mock RSI values for demonstration
    const baseRsi = indicators.rsi;
    const fluctuation = Math.sin(index / 3) * 8;
    const rsiValue = Math.max(0, Math.min(100, baseRsi + fluctuation));
    
    return {
      date: item.date,
      rsi: rsiValue
    };
  });

  // Prepare MACD data
  const macdData = historicalData.slice(-30).map((item, index) => {
    // Generate mock MACD values for demonstration
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

  // Prepare Bollinger Bands data
  const bollingerData = [...historicalData.slice(-30), ...predictionData].map((item) => {
    const price = item.price || item.actual || 0;
    
    return {
      date: item.date,
      price: price,
      upperBand: indicators.bollingerUpper,
      lowerBand: indicators.bollingerLower,
      middleBand: (indicators.bollingerUpper + indicators.bollingerLower) / 2
    };
  });

  // Chart configurations for colors
  const rsiConfig = {
    rsi: {
      label: "RSI",
      theme: {
        light: "#8B5CF6",
        dark: "#A78BFA",
      }
    }
  };

  const macdConfig = {
    macd: {
      label: "MACD",
      theme: {
        light: "#3B82F6",
        dark: "#60A5FA",
      }
    },
    signal: {
      label: "Signal",
      theme: {
        light: "#EC4899",
        dark: "#F472B6",
      }
    },
    histogram: {
      label: "Histogram",
      theme: {
        light: "#10B981",
        dark: "#34D399",
      }
    }
  };

  const bollingerConfig = {
    price: {
      label: "Price",
      theme: {
        light: "#3B82F6",
        dark: "#60A5FA",
      }
    },
    upperBand: {
      label: "Upper Band",
      theme: {
        light: "#10B981",
        dark: "#34D399",
      }
    },
    lowerBand: {
      label: "Lower Band",
      theme: {
        light: "#F43F5E",
        dark: "#FB7185",
      }
    },
    middleBand: {
      label: "Middle Band",
      theme: {
        light: "#8B5CF6",
        dark: "#A78BFA",
      }
    }
  };

  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 h-[450px]">
      <h2 className="text-lg font-semibold mb-4">Technical Indicators</h2>
      
      <Tabs defaultValue="rsi" className="h-[90%]">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="rsi">RSI</TabsTrigger>
          <TabsTrigger value="macd">MACD</TabsTrigger>
          <TabsTrigger value="bollinger">Bollinger Bands</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rsi" className="h-full">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Relative Strength Index (RSI) helps identify overbought or oversold conditions
          </div>
          <ChartContainer config={rsiConfig} className="h-[85%]">
            <LineChart data={rsiData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="rsi" 
                stroke="var(--color-rsi)" 
                strokeWidth={2}
                name="rsi"
              />
              {/* Reference lines for overbought/oversold */}
              <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" label={{ value: 'Overbought', position: 'insideLeft', fill: 'red', fontSize: 11 }} />
              <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" label={{ value: 'Oversold', position: 'insideLeft', fill: 'green', fontSize: 11 }} />
            </LineChart>
          </ChartContainer>
        </TabsContent>
        
        <TabsContent value="macd" className="h-full">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Moving Average Convergence Divergence (MACD) shows momentum changes
          </div>
          <ChartContainer config={macdConfig} className="h-[85%]">
            <ComposedChart data={macdData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                dataKey="histogram" 
                fill="var(--color-histogram)" 
                name="histogram"
              />
              <Line 
                type="monotone" 
                dataKey="macd" 
                stroke="var(--color-macd)" 
                strokeWidth={2}
                dot={false}
                name="macd"
              />
              <Line 
                type="monotone" 
                dataKey="signal" 
                stroke="var(--color-signal)" 
                strokeWidth={2}
                dot={false}
                name="signal"
              />
            </ComposedChart>
          </ChartContainer>
        </TabsContent>
        
        <TabsContent value="bollinger" className="h-full">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Bollinger Bands show volatility and potential reversals
          </div>
          <ChartContainer config={bollingerConfig} className="h-[85%]">
            <LineChart data={bollingerData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="upperBand" 
                stroke="var(--color-upperBand)" 
                strokeWidth={2}
                dot={false}
                name="upperBand"
              />
              <Line 
                type="monotone" 
                dataKey="lowerBand" 
                stroke="var(--color-lowerBand)" 
                strokeWidth={2}
                dot={false}
                name="lowerBand"
              />
              <Line 
                type="monotone" 
                dataKey="middleBand" 
                stroke="var(--color-middleBand)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="middleBand"
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="var(--color-price)" 
                strokeWidth={2}
                name="price"
              />
            </LineChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalIndicatorsChart;
