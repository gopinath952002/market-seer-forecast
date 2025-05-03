
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthLayoutProps {
  title?: string;
  description?: string;
  error?: string | null;
  children: React.ReactNode;
}

const AuthLayout = ({ title = "Market Seer", description = "Sign in to track your stock predictions", error, children }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
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
