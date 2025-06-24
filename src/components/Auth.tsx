import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ForgotPassword from './ForgotPassword';
import { FcGoogle } from 'react-icons/fc';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthProps {
  onSuccess?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password';

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const { login, signup, loading, error, isDemoMode, customUser, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [authView, setAuthView] = useState<AuthView>('login');

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      onSuccess?.();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password, data.name);
      onSuccess?.();
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthView(value as AuthView);
  };

  const handleForgotPassword = () => {
    setAuthView('forgot-password');
  };

  const handleBackToLogin = () => {
    setAuthView('login');
    setActiveTab('login');
  };

  // Show forgot password view
  if (authView === 'forgot-password') {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to TaskPilot</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
          {isDemoMode && (
            <Alert className="mt-4 animate-fade-in">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Demo mode: No Firebase credentials configured. Authentication is simulated.
              </AlertDescription>
            </Alert>
          )}
          {customUser && (
            <Alert className="mt-4 animate-fade-in">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Welcome back, {customUser.username}! 
                {customUser.role === 'admin' && ' (Admin)'}
                {!customUser.is_verified && ' (Email not verified)'}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="transition-all duration-200 hover:scale-[1.02]">Login</TabsTrigger>
              <TabsTrigger value="signup" className="transition-all duration-200 hover:scale-[1.02]">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mt-4 animate-fade-in" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...loginForm.register('email')}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...loginForm.register('password')}
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-[1.02]"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full aurora-outline-btn aurora-glow bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-border shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-muted" />
                <span className="mx-2 text-xs text-muted-foreground">or</span>
                <div className="flex-grow border-t border-muted" />
              </div>
              <Button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all"
                onClick={async () => { await signInWithGoogle(); onSuccess?.(); }}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  typeof FcGoogle !== 'undefined' ? <FcGoogle className="w-5 h-5" /> : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.09 30.74 0 24 0 14.82 0 6.71 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.13 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.64c-1.13-3.36-1.13-6.98 0-10.34l-7.98-6.2C.89 16.09 0 19.94 0 24c0 4.06.89 7.91 2.69 11.9l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.74 0 12.68-2.22 16.98-6.05l-7.19-5.6c-2.01 1.35-4.6 2.15-7.79 2.15-6.38 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.71 42.94 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                  )
                )}
                Continue with Google
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...signupForm.register('name')}
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...signupForm.register('email')}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...signupForm.register('password')}
                    />
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      {...signupForm.register('confirmPassword')}
                    />
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full aurora-outline-btn aurora-glow bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-border shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
