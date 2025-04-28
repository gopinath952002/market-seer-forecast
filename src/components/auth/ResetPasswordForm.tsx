
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  setError: (error: string | null) => void;
  onBack: () => void;
}

const ResetPasswordForm = ({ setError, onBack }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      toast.success("Password reset email sent. Please check your inbox.");
      onBack();
    } catch (error: any) {
      setError(error.message || "Failed to send reset email");
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <Input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
