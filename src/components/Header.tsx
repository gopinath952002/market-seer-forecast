
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Header: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
      navigate('/auth');
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-finance-blue dark:bg-finance-teal rounded-md p-2">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-finance-blue dark:text-finance-teal">Market Seer</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stock Price Prediction with AI</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="#" 
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link 
            to="#" 
            className="text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal"
          >
            Documentation
          </Link>
          
          {session ? (
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
