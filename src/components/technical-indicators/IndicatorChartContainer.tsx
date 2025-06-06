
import React, { ReactNode } from 'react';

interface IndicatorChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

const IndicatorChartContainer: React.FC<IndicatorChartContainerProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-blue-50/50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-100/50 dark:border-blue-800/50">
        {description}
      </div>
      <div className="flex-1 bg-white/50 dark:bg-gray-800/50 rounded-md p-4 min-h-0">
        {children}
      </div>
    </div>
  );
};

export default IndicatorChartContainer;
