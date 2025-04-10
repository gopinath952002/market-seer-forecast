
import React from 'react';
import { format, parseISO } from 'date-fns';
import { StockPrediction } from '@/utils/mockData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Legend 
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';

interface PredictionChartProps {
  prediction: StockPrediction;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ prediction }) => {
  const combinedData = [
    ...prediction.historicalData.map(item => ({
      date: item.date,
      actual: item.price,
      predicted: null
    })),
    ...prediction.predictionData.map(item => ({
      date: item.date,
      actual: item.actual,
      predicted: item.predicted
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Find where predictions start (for reference line)
  const predictionStartIdx = combinedData.findIndex(item => item.predicted !== null);
  const predictionStartDate = predictionStartIdx !== -1 ? combinedData[predictionStartIdx].date : null;

  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };

  const formatYAxis = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  // Chart configuration for colors
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
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 h-[400px]">
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
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fontSize: 12, fill: '#888' }}
            domain={['auto', 'auto']}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value, name) => {
                  return [`$${Number(value).toFixed(2)}`, name === 'actual' ? 'Historical' : 'Prediction'];
                }}
                labelFormatter={(label) => format(parseISO(String(label)), 'MMM dd, yyyy')}
              />
            } 
          />
          <Legend />
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
