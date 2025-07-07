import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/auth/AuthLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call to send the reset password email
      console.log('Reset password request for:', data.email);
      
      // Show success state
      setResetSent(true);
      
      toast({
        title: 'Reset email sent',
        description: 'Check your email for a link to reset your password.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link to your email address."
        footerText="Back to"
        footerLink="/login"
        footerLinkText="Sign in"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Password reset email sent</h3>
            <p className="text-sm text-gray-500">
              We've sent a password reset link to your email address. The link will expire in 1 hour.
            </p>
          </div>
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <p>Didn't receive an email?</p>
            <button
              onClick={() => setResetSent(false)}
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              Click to resend
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send reset link'
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
