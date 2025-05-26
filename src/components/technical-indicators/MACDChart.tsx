
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Bar, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MACDChartProps {
  macdData: Array<{
    date: string;
    macd: number;
    signal: number;
    histogram: number;
  }>;
}

const MACDChart: React.FC<MACDChartProps> = ({ macdData }) => {
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
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

  return (
    <div className="w-full h-full">
      <ChartContainer config={macdConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={macdData} 
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              width={60}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey="histogram" 
              fill="var(--color-histogram)" 
              name="Histogram"
              opacity={0.7}
            />
            <Line 
              type="monotone" 
              dataKey="macd" 
              stroke="var(--color-macd)" 
              strokeWidth={2}
              dot={false}
              name="MACD"
            />
            <Line 
              type="monotone" 
              dataKey="signal" 
              stroke="var(--color-signal)" 
              strokeWidth={2}
              dot={false}
              name="Signal"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MACDChart;
