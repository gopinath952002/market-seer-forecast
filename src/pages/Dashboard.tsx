
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to view your dashboard");
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Fetch user predictions with proper error handling
  const { data: predictions, isLoading, error } = useQuery({
    queryKey: ['userPredictions'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("User is not authenticated");
        }
        
        const { data, error } = await supabase
          .from('stock_predictions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          console.log("No predictions found for this user");
        }
        
        return data || [];
      } catch (error: any) {
        console.error("Error fetching predictions:", error.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Stock Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Error Loading Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There was a problem loading your predictions. Please try again later.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Stock Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            {predictions && predictions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead>Initial Price</TableHead>
                    <TableHead>Predicted At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.map((prediction: any) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">{prediction.ticker}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {prediction.predicted_direction === 'up' ? (
                            <ArrowUp className="text-finance-green" />
                          ) : (
                            <ArrowDown className="text-finance-red" />
                          )}
                          {prediction.predicted_direction}
                        </div>
                      </TableCell>
                      <TableCell>${prediction.initial_price}</TableCell>
                      <TableCell>
                        {new Date(prediction.predicted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {prediction.notified ? (
                          <span className="text-finance-green">Completed</span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No predictions yet. Start by making some predictions!</p>
                <Button onClick={() => navigate('/')}>Make Your First Prediction</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
