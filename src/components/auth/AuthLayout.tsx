
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
          
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Make sure Google authentication is configured properly in both Supabase and Google Cloud Console.
            </AlertDescription>
          </Alert>
          
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
