
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DisclaimerAlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
}

const DisclaimerAlert: React.FC<DisclaimerAlertProps> = ({ 
  variant = 'default',
  className 
}) => {
  return (
    <Alert variant={variant} className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">WARNING</AlertTitle>
      <AlertDescription>
        <p className="mt-1">
          Predictions are probabilistic and not financial advice. Markets are volatile—trade at your own risk.
        </p>
        <Link 
          to="/disclaimer" 
          className="flex items-center gap-1 text-sm underline mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Learn More <ExternalLink className="h-3 w-3" />
        </Link>
      </AlertDescription>
    </Alert>
  );
};

export default DisclaimerAlert;
