
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ReferenceArea } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info } from 'lucide-react';

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
  const [activeZoom, setActiveZoom] = useState<{start: string; end: string} | null>(null);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  
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

  const handleMouseDown = (e: any) => {
    if (!e || !e.activeLabel) return;
    setStartIndex(e.activeTooltipIndex);
  };

  const handleMouseMove = (e: any) => {
    if (!startIndex || !e || !e.activeLabel) return;
  };

  const handleMouseUp = (e: any) => {
    if (!startIndex || !e || !e.activeLabel) return;
    
    const endIndex = e.activeTooltipIndex;
    
    if (Math.abs(endIndex - startIndex) > 2) {
      const start = bollingerData[Math.min(startIndex, endIndex)].date;
      const end = bollingerData[Math.max(startIndex, endIndex)].date;
      
      setActiveZoom({ start, end });
    }
    
    setStartIndex(null);
  };

  const resetZoom = () => {
    setActiveZoom(null);
  };

  // Get the domain for the chart based on zoom status
  const getXDomain = () => {
    if (activeZoom) {
      return [activeZoom.start, activeZoom.end];
    }
    return undefined; // Let the chart decide
  };

  return (
    <div className="relative h-[85%]">
      {activeZoom && (
        <button 
          onClick={resetZoom}
          className="absolute top-0 right-0 z-10 text-sm text-blue-600 hover:text-blue-800 bg-white/80 dark:bg-gray-800/80 dark:text-blue-400 rounded px-2 py-1 flex items-center"
        >
          <Info className="w-3 h-3 mr-1" />
          Reset Zoom
        </button>
      )}
      
      <ChartContainer config={bollingerConfig} className="h-full">
        <LineChart 
          data={bollingerData} 
          margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            domain={getXDomain()}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['dataMin - 10', 'dataMax + 10']}
            label={{ value: 'Price', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value: any, name: any) => {
                  return [`$${Number(value).toFixed(2)}`, name];
                }}
                labelFormatter={(label) => {
                  return `${format(parseISO(String(label)), 'MMM dd, yyyy')}`;
                }}
              />
            } 
          />
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
          
          {startIndex !== null && (
            <ReferenceArea 
              x1={bollingerData[startIndex].date}
              x2={bollingerData[startIndex].date} 
              strokeOpacity={0.3}
              fill="#8884d8"
              fillOpacity={0.1}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default BollingerBandsChart;
