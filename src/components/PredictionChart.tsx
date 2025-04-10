
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Legend, TooltipProps 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { StockPrediction } from '@/utils/mockData';

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

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const date = format(parseISO(dataPoint.date), 'MMM dd, yyyy');
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{date}</p>
          {dataPoint.actual !== null && dataPoint.actual !== undefined && (
            <p className="text-sm">
              <span className="font-medium text-blue-500 dark:text-blue-400">Actual:</span> 
              <span className="ml-1">${dataPoint.actual.toFixed(2)}</span>
            </p>
          )}
          {dataPoint.predicted !== null && dataPoint.predicted !== undefined && (
            <p className="text-sm">
              <span className="font-medium text-green-500 dark:text-green-400">Predicted:</span>
              <span className="ml-1">${dataPoint.predicted.toFixed(2)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
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
      
      <ResponsiveContainer width="100%" height="80%">
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
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            name="Historical"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#4DA1A9" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
            name="Prediction"
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
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
