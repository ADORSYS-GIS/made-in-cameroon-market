
import React from 'react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import VendorApprovalDashboard from '@/components/admin/VendorApprovalDashboard';

const VendorApprovals = () => {
  return (
    <AdminDashboardLayout>
      <VendorApprovalDashboard />
    </AdminDashboardLayout>
  );
};

export default VendorApprovals;
