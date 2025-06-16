import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { resetPassword, loading, error, isDemoMode } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast({
        title: "✅ Reset email sent!",
        description: "Check your inbox and follow the instructions to set a new password.",
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast({
          title: "⚠️ Hmm... we couldn't find that email.",
          description: "Double-check and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send reset email. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 animate-fade-in">
              <CheckCircle className="h-10 w-10 text-green-500 transition-transform duration-200 hover:scale-105" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="animate-fade-in">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                If you don't see the email, check your spam folder or try again.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="w-full transition-all duration-200 hover:scale-[1.02] animate-fade-in"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">🔐 Forgot your password?</CardTitle>
          <CardDescription className="text-center">
            No worries — it happens!<br />
            Enter your email address and we'll send you a secure link to reset your password.
          </CardDescription>
          {isDemoMode && (
            <Alert className="mt-4 animate-fade-in">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Demo mode: Password reset is simulated. In production, this would send a real email.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="📧 Enter your registered email"
                  className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive animate-fade-in">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full transition-all duration-200 hover:scale-[1.02]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  🔁 Send Reset Link
                </>
              )}
            </Button>

            <Button 
              type="button" 
              onClick={onBack} 
              variant="outline" 
              className="w-full transition-all duration-200 hover:scale-[1.02]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword; 