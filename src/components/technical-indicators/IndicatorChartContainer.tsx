
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
    <div className="h-full">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {description}
      </div>
      {children}
    </div>
  );
};

export default IndicatorChartContainer;
