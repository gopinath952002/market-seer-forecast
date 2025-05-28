
import React from 'react';
import { format, parseISO } from 'date-fns';
import { StockPrediction } from '@/utils/mockData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, ReferenceLine, Legend, Area, Tooltip
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { addConfidenceIntervals } from './technical-indicators/indicatorUtils';
import { convertUsdToInr, formatINR, formatINRShort, getExchangeRateInfo, isIndianStock } from '@/utils/currencyUtils';

interface PredictionChartProps {
  prediction: StockPrediction;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ prediction }) => {
  // Add confidence intervals to prediction data
  const enhancedPredictionData = addConfidenceIntervals(prediction);
  
  // Check if this is an Indian stock - if so, don't convert prices
  const shouldConvertToINR = !isIndianStock(prediction.ticker);
  
  const combinedData = [
    ...prediction.historicalData.map(item => ({
      date: item.date,
      actual: shouldConvertToINR ? convertUsdToInr(item.price) : item.price,
      predicted: null,
      lowerBound: null,
      upperBound: null,
      isHistorical: true
    })),
    ...enhancedPredictionData.map(item => ({
      date: item.date,
      actual: item.actual ? (shouldConvertToINR ? convertUsdToInr(item.actual) : item.actual) : null,
      predicted: shouldConvertToINR ? convertUsdToInr(item.predicted) : item.predicted,
      lowerBound: item.lowerBound ? (shouldConvertToINR ? convertUsdToInr(parseFloat(item.lowerBound)) : parseFloat(item.lowerBound)) : null,
      upperBound: item.upperBound ? (shouldConvertToINR ? convertUsdToInr(parseFloat(item.upperBound)) : parseFloat(item.upperBound)) : null,
      confidenceInterval: item.confidenceInterval ? (shouldConvertToINR ? convertUsdToInr(parseFloat(item.confidenceInterval)) : parseFloat(item.confidenceInterval)) : null,
      isPrediction: true
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const predictionStartIdx = combinedData.findIndex(item => item.predicted !== null);
  const predictionStartDate = predictionStartIdx !== -1 ? combinedData[predictionStartIdx].date : null;

  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };

  const formatYAxis = (value: number) => {
    return formatINRShort(value);
  };

  const chartConfig = {
    actual: {
      label: "Historical",
      theme: {
        light: "#3B82F6",
        dark: "#60A5FA",
      }
    },
    predicted: {
      label: "Prediction",
      theme: {
        light: "#4DA1A9",
        dark: "#5EBFC9",
      }
    },
    confidenceBounds: {
      label: "Confidence Interval",
      theme: {
        light: "rgba(77, 161, 169, 0.2)",
        dark: "rgba(94, 191, 201, 0.2)",
      }
    }
  };

  // Format current price and change
  const currentPrice = shouldConvertToINR ? convertUsdToInr(prediction.metadata.currentPrice) : prediction.metadata.currentPrice;
  const priceChange = shouldConvertToINR ? convertUsdToInr(prediction.metadata.change) : prediction.metadata.change;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            <span className="ticker-highlight">{prediction.ticker}</span> Price Prediction
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {prediction.metadata.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {formatINR(currentPrice)}
          </p>
          <div className={`text-sm ${prediction.metadata.change >= 0 ? 'positive-value' : 'negative-value'}`}>
            {prediction.metadata.change >= 0 ? '+' : ''}
            {formatINR(priceChange)} ({prediction.metadata.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="h-[400px]">
        <ChartContainer config={chartConfig} className="h-full">
          <LineChart data={combinedData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12, fill: '#888' }}
              padding={{ left: 10, right: 10 }}
              label={{ value: 'Date (Historical → Prediction)', position: 'insideBottom', offset: -15, fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12, fill: '#888' }}
              domain={['auto', 'auto']}
              label={{ value: 'Price (INR)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value: any, name: any, entry: any) => {
                    if (name === 'actual') return [formatINR(Number(value)), 'Historical'];
                    if (name === 'predicted') {
                      const item = combinedData.find(item => 
                        item.date === entry.payload.date && 
                        item.predicted === value
                      );
                      const confInterval = item && 'confidenceInterval' in item ? item.confidenceInterval : null;
                      return [
                        `${formatINR(Number(value))}${confInterval ? ` ± ${formatINR(confInterval)}` : ''}`, 
                        'Prediction'
                      ];
                    }
                    return [formatINR(Number(value)), name];
                  }}
                  labelFormatter={(label) => format(parseISO(String(label)), 'MMM dd, yyyy')}
                />
              } 
            />
            <Legend />
            
            {/* Confidence interval area */}
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-confidenceBounds)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-confidenceBounds)" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <Area 
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
              name="upperBound"
              activeDot={false}
              legendType="none"
            />
            
            <Area 
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fillOpacity={0}
              name="lowerBound"
              activeDot={false}
              legendType="none"
            />
            
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="var(--color-actual)" 
              strokeWidth={2}
              dot={false}
              name="actual"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="var(--color-predicted)" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              name="predicted"
              isAnimationActive={true}
            />
            {predictionStartDate && (
              <ReferenceLine 
                x={predictionStartDate} 
                stroke="#888" 
                strokeDasharray="3 3"
                label={{ value: 'Today', position: 'insideTopRight', fill: '#888', fontSize: 11 }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>
      
      {/* Exchange rate info - only show for US stocks */}
      {shouldConvertToINR && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-3">
          {getExchangeRateInfo()}
        </div>
      )}
    </div>
  );
};

export default PredictionChart;
