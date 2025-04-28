
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth: React.FC = () => {
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
    
    // Check for redirect errors in URL
    const url = new URL(window.location.href);
    const errorDescription = url.searchParams.get('error_description');
    if (errorDescription) {
      setAuthError(decodeURIComponent(errorDescription));
    }
  }, [navigate]);

  if (resetPasswordMode) {
    return (
      <AuthLayout 
        title="Reset Password"
        description="Enter your email to receive a password reset link"
        error={authError}
      >
        <ResetPasswordForm 
          setError={setAuthError}
          onBack={() => setResetPasswordMode(false)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout error={authError}>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm 
            setError={setAuthError}
            onResetPassword={() => setResetPasswordMode(true)}
          />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm setError={setAuthError} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
