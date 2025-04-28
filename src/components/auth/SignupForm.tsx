
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FaGoogle } from 'react-icons/fa';

interface SignupFormProps {
  setError: (error: string | null) => void;
}

const SignupForm = ({ setError }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      if (error) throw error;
      toast.success("Account created successfully! Please check your email to verify.");
    } catch (error: any) {
      setError(error.message || "Signup failed");
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      
      if (error) throw error;
      toast.info("Redirecting to Google...");
    } catch (error: any) {
      setError(error.message || "Google authentication failed");
      toast.error(error.message || "Google authentication failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <Input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <Input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
      >
        <FaGoogle />
        <span>Sign up with Google</span>
      </Button>
    </form>
  );
};

export default SignupForm;
