
import React from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface RSIChartProps {
  rsiData: Array<{
    date: string;
    rsi: number;
  }>;
}

const RSIChart: React.FC<RSIChartProps> = ({ rsiData }) => {
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
  };

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

  return (
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
  );
};

export default RSIChart;
