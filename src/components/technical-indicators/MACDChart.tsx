
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Bar, Legend } from 'recharts';
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
  );
};

export default MACDChart;
