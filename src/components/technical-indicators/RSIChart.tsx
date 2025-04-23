
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ReferenceArea } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info } from 'lucide-react';

interface RSIChartProps {
  rsiData: Array<{
    date: string;
    rsi: number;
  }>;
}

const RSIChart: React.FC<RSIChartProps> = ({ rsiData }) => {
  const [activeZoom, setActiveZoom] = useState<{start: string; end: string} | null>(null);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  
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
      const start = rsiData[Math.min(startIndex, endIndex)].date;
      const end = rsiData[Math.max(startIndex, endIndex)].date;
      
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
      
      <ChartContainer config={rsiConfig} className="h-full">
        <LineChart 
          data={rsiData} 
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
            label={{ value: 'Date (Historical → Prediction)', position: 'insideBottom', offset: -15, fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'RSI Value', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value: any) => {
                  return [`${Number(value).toFixed(2)}`, 'RSI'];
                }}
                labelFormatter={(label) => {
                  return `${format(parseISO(String(label)), 'MMM dd, yyyy')}`;
                }}
              />
            } 
          />
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
          
          {startIndex !== null && (
            <ReferenceArea 
              x1={rsiData[startIndex].date}
              x2={rsiData[startIndex].date} 
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

export default RSIChart;
