
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("Logged out successfully");
      setSession(null);
      navigate('/auth');
    } catch (error: any) {
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-finance-blue dark:bg-finance-teal rounded-md p-2">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-finance-blue dark:text-finance-teal">Market Seer</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stock Price Prediction with AI</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-4 text-sm">
          {session ? (
            <>
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
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="#" 
                className="text-gray-700 dark:text-gray-300 hover:text-finance-blue dark:hover:text-finance-teal"
              >
                Documentation
              </Link>
              <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
