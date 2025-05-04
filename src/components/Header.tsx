
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-finance-blue dark:text-finance-teal">MarketSeer</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-finance-blue dark:text-finance-teal' : 'text-gray-600 dark:text-gray-300'} hover:text-finance-blue dark:hover:text-finance-teal transition-colors`}
            >
              Predictions
            </Link>
            <Link 
              to="/forecasts" 
              className={`text-sm font-medium ${location.pathname === '/forecasts' ? 'text-finance-blue dark:text-finance-teal' : 'text-gray-600 dark:text-gray-300'} hover:text-finance-blue dark:hover:text-finance-teal transition-colors`}
            >
              Forecasts
            </Link>
            <Link 
              to="/python-demo" 
              className={`text-sm font-medium ${location.pathname === '/python-demo' ? 'text-finance-blue dark:text-finance-teal' : 'text-gray-600 dark:text-gray-300'} hover:text-finance-blue dark:hover:text-finance-teal transition-colors`}
            >
              Python Demo
            </Link>
            <Link 
              to="/disclaimer" 
              className={`text-sm font-medium ${location.pathname === '/disclaimer' ? 'text-finance-blue dark:text-finance-teal' : 'text-gray-600 dark:text-gray-300'} hover:text-finance-blue dark:hover:text-finance-teal transition-colors`}
            >
              Disclaimer
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {session ? (
              <>
                <Button
                  variant="default"
                  size={isMobile ? "icon" : "default"}
                  onClick={() => navigate('/dashboard')}
                  className="bg-finance-blue hover:bg-finance-blue/90 dark:bg-finance-teal dark:hover:bg-finance-teal/90"
                >
                  {isMobile ? <User className="h-5 w-5" /> : "Dashboard"}
                </Button>
                <Button
                  variant="outline"
                  size={isMobile ? "icon" : "default"}
                  onClick={handleLogout}
                >
                  {isMobile ? <LogOut className="h-5 w-5" /> : "Log out"}
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size={isMobile ? "icon" : "default"}
                onClick={() => navigate('/auth')}
                className="bg-finance-blue hover:bg-finance-blue/90 dark:bg-finance-teal dark:hover:bg-finance-teal/90"
              >
                {isMobile ? <LogIn className="h-5 w-5" /> : "Log in"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
