
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const profileSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  businessName: z.string().min(2, { message: 'Business name is required' }),
  bio: z.string().max(500, { message: 'Bio must be less than 500 characters' }).optional(),
  location: z.string().min(2, { message: 'Location is required' }),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, { 
    message: 'Please enter a valid phone number' 
  }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const VendorProfileForm = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      businessName: '',
      bio: '',
      location: '',
      phone: '',
      email: ''
    },
  });

  // Watch all form values for profile completion calculation
  const formValues = watch();

  // Calculate profile completion percentage
  useEffect(() => {
    let completedFields = 0;
    let totalFields = 0;
    
    // Count required fields
    for (const [key, value] of Object.entries(formValues)) {
      if (key === 'bio') continue; // Bio is optional
      
      totalFields++;
      if (value && value.toString().trim() !== '') {
        completedFields++;
      }
    }
    
    // Add profile image as a field
    totalFields++;
    if (profileImage) {
      completedFields++;
    }
    
    const percentage = Math.floor((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [formValues, profileImage]);

  // Simulate fetching profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // This would be a tRPC call in a real app
        // const profile = await trpc.vendor.getVendorProfile.query();
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockProfile = {
          name: 'John Doe',
          businessName: 'Cameroon Crafts',
          bio: 'I create handmade crafts using traditional Cameroonian techniques.',
          location: 'Douala, Cameroon',
          phone: '+237612345678',
          email: 'john@example.com',
          profileImage: 'https://i.pravatar.cc/300'
        };
        
        // Set the form values
        Object.entries(mockProfile).forEach(([key, value]) => {
          if (key !== 'profileImage') {
            setValue(key as keyof ProfileFormValues, value);
          }
        });
        
        // Set profile image
        setProfileImage(mockProfile.profileImage);
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [setValue, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      // This would be a tRPC call in a real app
      // await trpc.vendor.updateVendorProfile.mutate({ 
      //   ...data,
      //   profileImage
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 mb-4 border-b">
        <h2 className="text-2xl font-bold text-cameroon-blue">Your Profile</h2>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-sm text-gray-500 mr-2">Profile Completion:</span>
          <div className="w-36">
            <Progress value={completionPercentage} className="h-2" />
          </div>
          <span className="ml-2 text-sm font-medium">{completionPercentage}%</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cameroon-blue bg-gray-100 flex items-center justify-center">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-4xl text-gray-400">👤</span>
              )}
            </div>
            <label 
              htmlFor="profileImage" 
              className="absolute bottom-0 right-0 bg-cameroon-blue text-white p-2 rounded-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </label>
            <input 
              id="profileImage" 
              type="file" 
              accept="image/png, image/jpeg, image/jpg" 
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Upload a profile photo (Max 5MB, JPEG or PNG)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Label htmlFor="businessName">Business Name</Label>
            <Input 
              id="businessName" 
              {...register('businessName')} 
              className={errors.businessName ? 'border-destructive' : ''} 
            />
            {errors.businessName && <p className="form-error">{errors.businessName.message}</p>}
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
              {...register('phone')} 
              className={errors.phone ? 'border-destructive' : ''} 
            />
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="City, Country" 
              {...register('location')} 
              className={errors.location ? 'border-destructive' : ''} 
            />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about your business and products..." 
              {...register('bio')} 
              className={`h-32 ${errors.bio ? 'border-destructive' : ''}`} 
            />
            {errors.bio && <p className="form-error">{errors.bio.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {watch('bio')?.length || 0}/500 characters
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorProfileForm;
