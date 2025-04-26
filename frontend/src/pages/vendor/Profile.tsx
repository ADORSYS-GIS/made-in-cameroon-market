
import React from 'react';
import VendorDashboardLayout from '@/components/layout/VendorDashboardLayout';
import VendorProfileForm from '@/components/vendor/profile/VendorProfileForm';

const Profile = () => {
  return (
    <VendorDashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <VendorProfileForm />
      </div>
    </VendorDashboardLayout>
  );
};

export default Profile;
