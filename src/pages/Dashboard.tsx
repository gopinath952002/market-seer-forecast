
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch user predictions
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['userPredictions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return [];
      }
      
      const { data, error } = await supabase
        .from('stock_predictions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-t-finance-blue dark:border-t-finance-teal border-gray-200/50 dark:border-gray-700/50 animate-spin"></div>
            </div>
          </div>
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
                  {predictions.map((prediction) => (
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
                <p className="text-gray-500">No predictions yet. Start by making some predictions!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
