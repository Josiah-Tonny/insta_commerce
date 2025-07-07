import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Check, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/auth/AuthLayout';

// Form schemas
const accountSchema = z.object({
  accountType: z.enum(['buyer', 'seller'], {
    required_error: 'Please select an account type',
  }),
});

const userInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const sellerInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(2, 'Business type is required'),
  instagramUsername: z.string().optional(),
});

const steps = [
  { id: 'account', title: 'Account Type' },
  { id: 'user', title: 'Personal Info' },
  { id: 'seller', title: 'Business Info' },
  { id: 'password', title: 'Create Password' },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form methods for each step
  const accountMethods = useForm({
    resolver: zodResolver(accountSchema),
  });
  
  const userInfoMethods = useForm({
    resolver: zodResolver(userInfoSchema),
  });
  
  const passwordMethods = useForm({
    resolver: zodResolver(passwordSchema),
  });
  
  const sellerInfoMethods = useForm({
    resolver: zodResolver(sellerInfoSchema),
  });
  
  const accountType = accountMethods.watch('accountType');
  
  const nextStep = () => {
    setCurrentStep((prev) => {
      // Skip seller info if not a seller
      if (prev === 1 && accountType === 'buyer') return prev + 2;
      return prev + 1;
    });
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => {
      // Skip back from password to user info if buyer
      if (prev === 3 && accountType === 'buyer') return prev - 2;
      return prev - 1;
    });
  };
  
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you would combine all form data and send to your API
      const accountData = accountMethods.getValues();
      const userData = userInfoMethods.getValues();
      const passwordData = passwordMethods.getValues();
      const sellerData = accountType === 'seller' ? sellerInfoMethods.getValues() : {};
      
      const registrationData = {
        ...accountData,
        ...userData,
        ...passwordData,
        ...sellerData,
        role: accountType,
      };
      
      console.log('Registration data:', registrationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store token and redirect
      localStorage.setItem('token', 'dummy_token');
      
      toast({
        title: 'Registration successful!',
        description: 'Your account has been created successfully.',
      });
      
      // Redirect based on account type
      navigate(accountType === 'seller' ? '/seller/dashboard' : '/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <form onSubmit={accountMethods.handleSubmit(nextStep)} className="space-y-6">
            <h3 className="text-lg font-medium">Create an account</h3>
            <p className="text-sm text-gray-500">
              Select the type of account you want to create
            </p>
            
            <RadioGroup 
              defaultValue="buyer" 
              className="grid gap-4 grid-cols-1 md:grid-cols-2"
              onValueChange={(value) => accountMethods.setValue('accountType', value)}
              {...accountMethods.register('accountType')}
            >
              <div>
                <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                <Label
                  htmlFor="buyer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mb-3 h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="font-medium">I'm a Buyer</span>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    I want to browse and purchase products
                  </p>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                <Label
                  htmlFor="seller"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mb-3 h-6 w-6"
                  >
                    <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                    <path d="m12 12 4 4 6-6" />
                    <path d="m16 5 3 3" />
                  </svg>
                  <span className="font-medium">I'm a Seller</span>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    I want to sell my products on the platform
                  </p>
                </Label>
              </div>
            </RadioGroup>
            
            {accountMethods.formState.errors.accountType && (
              <p className="text-sm text-red-500">
                {accountMethods.formState.errors.accountType.message}
              </p>
            )}
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Continue
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </form>
        );
        
      case 1:
        return (
          <form onSubmit={userInfoMethods.handleSubmit(nextStep)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="pl-10"
                  {...userInfoMethods.register('fullName')}
                />
              </div>
              {userInfoMethods.formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {userInfoMethods.formState.errors.fullName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...userInfoMethods.register('email')}
                />
              </div>
              {userInfoMethods.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {userInfoMethods.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...userInfoMethods.register('phone')}
              />
              {userInfoMethods.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {userInfoMethods.formState.errors.phone.message}
                </p>
              )}
            </div>
            
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="w-24"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="w-24">
                Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </form>
        );
        
      case 2:
        if (accountType === 'buyer') {
          // Skip to password step for buyers
          return passwordStep();
        }
        
        return (
          <form onSubmit={sellerInfoMethods.handleSubmit(nextStep)} className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>
            <p className="text-sm text-gray-500">
              Tell us about your business
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="My Awesome Shop"
                {...sellerInfoMethods.register('businessName')}
              />
              {sellerInfoMethods.formState.errors.businessName && (
                <p className="text-sm text-red-500">
                  {sellerInfoMethods.formState.errors.businessName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <select
                id="businessType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...sellerInfoMethods.register('businessType')}
              >
                <option value="">Select business type</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="beauty">Beauty & Cosmetics</option>
                <option value="jewelry">Jewelry & Accessories</option>
                <option value="home">Home & Living</option>
                <option value="art">Art & Collectibles</option>
                <option value="food">Food & Beverage</option>
                <option value="other">Other</option>
              </select>
              {sellerInfoMethods.formState.errors.businessType && (
                <p className="text-sm text-red-500">
                  {sellerInfoMethods.formState.errors.businessType.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                <Label htmlFor="instagramUsername">Instagram Username (optional)</Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">@</span>
                </div>
                <Input
                  id="instagramUsername"
                  placeholder="yourusername"
                  className="pl-6"
                  {...sellerInfoMethods.register('instagramUsername')}
                />
              </div>
              <p className="text-xs text-gray-500">
                Connect your Instagram to import products and grow your audience
              </p>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="w-24"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="w-24">
                Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </form>
        );
        
      case 3:
        return passwordStep();
        
      default:
        return null;
    }
  };
  
  const passwordStep = () => (
    <form onSubmit={passwordMethods.handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Create a password</h3>
      <p className="text-sm text-gray-500">
        Create a secure password for your account
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10"
            {...passwordMethods.register('password')}
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
        {passwordMethods.formState.errors.password && (
          <p className="text-sm text-red-500">
            {passwordMethods.formState.errors.password.message}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10"
            {...passwordMethods.register('confirmPassword')}
          />
        </div>
        {passwordMethods.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {passwordMethods.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="flex items-center text-sm text-gray-500">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>At least 1 number or special character</span>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-24"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" className="w-24" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Sign Up'
          )}
        </Button>
      </div>
    </form>
  );
  
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community today"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => {
              // Skip seller step for buyers
              if (accountType === 'buyer' && step.id === 'seller') return null;
              
              const isCurrent = index === currentStep || 
                (accountType === 'buyer' && currentStep >= 2 && index === steps.length - 1);
              const isComplete = index < currentStep || 
                (accountType === 'buyer' && index === 2 && currentStep > 2);
              
              return (
                <li key={step.id} className="relative flex-1">
                  {index < steps.length - 1 && (
                    <div className={`absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full ${isComplete ? 'bg-pink-600' : 'bg-gray-200'}`} />
                  )}
                  <div className="group flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isComplete 
                        ? 'bg-pink-600 text-white' 
                        : isCurrent 
                          ? 'border-2 border-pink-600 bg-white' 
                          : 'border-2 border-gray-300 bg-white'
                    }`}>
                      {isComplete ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isCurrent ? 'text-pink-600' : 'text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </span>
                    <span className={`mt-2 text-xs font-medium ${
                      isCurrent || isComplete ? 'text-pink-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      
      {renderStep()}
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>By signing up, you agree to our <a href="#" className="text-pink-600 hover:underline">Terms of Service</a> and <a href="#" className="text-pink-600 hover:underline">Privacy Policy</a>.</p>
      </div>
    </AuthLayout>
  );
}
