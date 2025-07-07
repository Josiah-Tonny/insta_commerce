import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/auth/AuthLayout';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to reset the password
      console.log('Reset password for email:', email);
      console.log('With token:', token);
      console.log('New password:', data.password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setIsSuccess(true);
      
      toast({
        title: 'Password updated',
        description: 'Your password has been reset successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="Your password has been reset successfully."
        footerText="Back to"
        footerLink="/login"
        footerLinkText="Sign in"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Password updated</h3>
            <p className="text-sm text-gray-500">
              You can now sign in with your new password.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!token || !email) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="The password reset link is invalid or has expired."
        footerText="Back to"
        footerLink="/forgot-password"
        footerLinkText="Request a new link"
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Please request a new password reset link to continue.
            </p>
          </div>
          <Button
            onClick={() => navigate('/forgot-password')}
            className="w-full"
          >
            Request New Link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={`Enter a new password for ${email}`}
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>At least 8 characters</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>At least 1 number or special character</span>
          </div>
        </div>
        
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <Link
          to="/login"
          className="flex items-center justify-center font-medium text-pink-600 hover:text-pink-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
