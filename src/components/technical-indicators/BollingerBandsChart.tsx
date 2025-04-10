
import React from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface BollingerItem {
  date: string;
  price?: number;
  actual?: number | null;
  predicted?: number;
  upperBand: number;
  lowerBand: number;
  middleBand: number;
}

interface BollingerBandsChartProps {
  bollingerData: BollingerItem[];
}

const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ bollingerData }) => {
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM dd');
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

  return (
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
  );
};

export default BollingerBandsChart;
