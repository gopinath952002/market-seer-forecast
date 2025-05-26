
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthLayoutProps {
  title?: string;
  description?: string;
  error?: string | null;
  children: React.ReactNode;
}

const AuthLayout = ({ title = "Market Seer", description = "Your AI-Powered Stock Prediction Platform", error, children }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card effect3d={true} className="w-full max-w-md shadow-lg border-blue-100 dark:border-blue-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-finance-blue dark:text-finance-teal">{title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
