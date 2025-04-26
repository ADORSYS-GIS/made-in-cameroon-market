
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Countdown from '@/components/ui/countdown';

// Define schema for form validation
const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, { 
    message: 'Please enter a valid phone number' 
  }),
  password: z.string().min(8, { 
    message: 'Password must be at least 8 characters long' 
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const VendorRegisterForm = () => {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpRequestTime, setOtpRequestTime] = useState(0);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
  });

  // Simulation of requesting OTP
  const handleRequestOtp = async (formData: RegisterFormValues) => {
    setIsRequestingOtp(true);
    try {
      // This would be a tRPC call in a real app
      // await trpc.vendor.requestVendorOtp.mutate({ phone: formData.phone });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Sent",
        description: `We've sent an OTP to ${formData.phone}. It will expire in 2 minutes.`,
      });
      
      setStep('otp');
      setOtpRequestTime(Date.now());
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Simulation of verifying OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "OTP must be 6 digits",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would be a tRPC call in a real app
      // await trpc.vendor.verifyVendorOtp.mutate({ 
      //   phone: getValues('phone'), 
      //   otp: otp 
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
      // Redirect to profile setup
      navigate('/vendor/profile');
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = async () => {
    await handleRequestOtp(getValues());
  };

  // Watch for form values to enable offline caching
  const watchedValues = watch();

  React.useEffect(() => {
    // Save form data to local storage in case of connectivity drops
    const saveFormData = () => {
      try {
        localStorage.setItem('vendorFormData', JSON.stringify(watchedValues));
      } catch (e) {
        console.error('Error saving form data to localStorage', e);
      }
    };

    saveFormData();
  }, [watchedValues]);

  React.useEffect(() => {
    // Try to load saved form data when component mounts
    try {
      const savedData = localStorage.getItem('vendorFormData');
      if (savedData) {
        // We would use this with reset() in a full implementation
        // const parsedData = JSON.parse(savedData);
        // reset(parsedData);
      }
    } catch (e) {
      console.error('Error loading form data from localStorage', e);
    }
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-header">Register as a Vendor</h2>

      {step === 'register' ? (
        <form onSubmit={handleSubmit(handleRequestOtp)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              {...register('name')} 
              className={errors.name ? 'border-destructive' : ''} 
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              {...register('email')} 
              className={errors.email ? 'border-destructive' : ''} 
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="+237 6XX XXX XXX" 
              {...register('phone')} 
              className={errors.phone ? 'border-destructive' : ''} 
            />
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')} 
              className={errors.password ? 'border-destructive' : ''} 
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              {...register('confirmPassword')} 
              className={errors.confirmPassword ? 'border-destructive' : ''} 
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isRequestingOtp}
          >
            {isRequestingOtp ? 'Sending OTP...' : 'Continue'}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <a href="/vendor/login" className="text-cameroon-blue font-semibold hover:underline">
              Login
            </a>
          </p>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-center mb-4">
            We've sent a verification code to your phone. Please enter it below.
          </p>

          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input 
              id="otp" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              placeholder="Enter 6-digit code" 
              className="text-center text-lg letter-spacing-wider" 
              maxLength={6}
            />
          </div>

          <Button 
            onClick={handleVerifyOtp} 
            className="w-full"
          >
            Verify & Complete Registration
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?
            </p>
            <Button 
              variant="link" 
              onClick={handleResendOtp} 
              disabled={Date.now() - otpRequestTime < 60000} 
              className="p-0 h-auto text-cameroon-blue"
            >
              Resend Code
              {Date.now() - otpRequestTime < 60000 && (
                <> in <Countdown seconds={60 - Math.floor((Date.now() - otpRequestTime) / 1000)} onComplete={() => {}} /></>
              )}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setStep('register')}
          >
            Back to Registration
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorRegisterForm;
