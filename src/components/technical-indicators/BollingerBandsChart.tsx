
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceArea, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info } from 'lucide-react';
import { convertUsdToInr, formatINR, formatINRShort, isIndianStock } from '@/utils/currencyUtils';

interface BollingerItem {
  date: string;
  price?: number;
  actual?: number | null;
  predicted?: number;
  upperBand: number;
  lowerBand: number;
  middleBand: number;
  ticker?: string;
}

interface BollingerBandsChartProps {
  bollingerData: BollingerItem[];
}

const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ bollingerData }) => {
  const [activeZoom, setActiveZoom] = useState<{start: string; end: string} | null>(null);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  
  // Check if this is an Indian stock - if so, don't convert prices
  const ticker = bollingerData.length > 0 ? bollingerData[0].ticker : '';
  const shouldConvertToINR = ticker ? !isIndianStock(ticker) : true;
  
  // Convert all price data to INR only if it's a US stock
  const convertedData = bollingerData.map(item => ({
    ...item,
    price: item.price ? (shouldConvertToINR ? convertUsdToInr(item.price) : item.price) : undefined,
    actual: item.actual ? (shouldConvertToINR ? convertUsdToInr(item.actual) : item.actual) : item.actual,
    predicted: item.predicted ? (shouldConvertToINR ? convertUsdToInr(item.predicted) : item.predicted) : undefined,
    upperBand: shouldConvertToINR ? convertUsdToInr(item.upperBand) : item.upperBand,
    lowerBand: shouldConvertToINR ? convertUsdToInr(item.lowerBand) : item.lowerBand,
    middleBand: shouldConvertToINR ? convertUsdToInr(item.middleBand) : item.middleBand
  }));
  
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
      const start = convertedData[Math.min(startIndex, endIndex)].date;
      const end = convertedData[Math.max(startIndex, endIndex)].date;
      
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
    <div className="relative w-full h-full">
      {activeZoom && (
        <button 
          onClick={resetZoom}
          className="absolute top-2 right-2 z-10 text-sm text-blue-600 hover:text-blue-800 bg-white/80 dark:bg-gray-800/80 dark:text-blue-400 rounded px-2 py-1 flex items-center shadow-sm"
        >
          <Info className="w-3 h-3 mr-1" />
          Reset Zoom
        </button>
      )}
      
      <ChartContainer config={bollingerConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={convertedData} 
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
              domain={getXDomain()}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatINRShort}
              domain={['dataMin - 10', 'dataMax + 10']}
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
              width={60}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value: any, name: any) => {
                    return [formatINR(Number(value)), name];
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
              name="Upper Band"
            />
            <Line 
              type="monotone" 
              dataKey="lowerBand" 
              stroke="var(--color-lowerBand)" 
              strokeWidth={2}
              dot={false}
              name="Lower Band"
            />
            <Line 
              type="monotone" 
              dataKey="middleBand" 
              stroke="var(--color-middleBand)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Middle Band"
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="var(--color-price)" 
              strokeWidth={3}
              name="Price"
              dot={{ fill: "var(--color-price)", strokeWidth: 2, r: 2 }}
            />
            
            {startIndex !== null && (
              <ReferenceArea 
                x1={convertedData[startIndex].date}
                x2={convertedData[startIndex].date} 
                strokeOpacity={0.3}
                fill="#8884d8"
                fillOpacity={0.1}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default BollingerBandsChart;
