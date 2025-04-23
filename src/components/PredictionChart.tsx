
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

interface PredictionChartProps {
  prediction: StockPrediction;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ prediction }) => {
  // Add confidence intervals to prediction data
  const enhancedPredictionData = addConfidenceIntervals(prediction);
  
  const combinedData = [
    ...prediction.historicalData.map(item => ({
      date: item.date,
      actual: item.price,
      predicted: null,
      lowerBound: null,
      upperBound: null,
      isHistorical: true
    })),
    ...enhancedPredictionData.map(item => ({
      date: item.date,
      actual: item.actual,
      predicted: item.predicted,
      lowerBound: item.lowerBound,
      upperBound: item.upperBound,
      confidenceInterval: item.confidenceInterval,
      isPrediction: true
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const predictionStartIdx = combinedData.findIndex(item => item.predicted !== null);
  const predictionStartDate = predictionStartIdx !== -1 ? combinedData[predictionStartIdx].date : null;

  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };

  const formatYAxis = (value: number) => {
    return `$${value.toFixed(0)}`;
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 h-[400px] w-full max-w-3xl mx-auto mb-8">
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
            ${prediction.metadata.currentPrice.toFixed(2)}
          </p>
          <div className={`text-sm ${prediction.metadata.change >= 0 ? 'positive-value' : 'negative-value'}`}>
            {prediction.metadata.change >= 0 ? '+' : ''}
            {prediction.metadata.change.toFixed(2)} ({prediction.metadata.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <ChartContainer config={chartConfig} className="h-[80%]">
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
            label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value: any, name: any) => {
                  if (name === 'actual') return [`$${Number(value).toFixed(2)}`, 'Historical'];
                  if (name === 'predicted') {
                    const item = combinedData.find(item => item.date === name && item.predicted === value);
                    const confInterval = item?.confidenceInterval;
                    return [`$${Number(value).toFixed(2)} ± $${confInterval || '0.00'}`, 'Prediction'];
                  }
                  return [`$${Number(value).toFixed(2)}`, name];
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
  );
};

export default PredictionChart;
