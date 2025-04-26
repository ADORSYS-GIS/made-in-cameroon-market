
import React from 'react';
import VendorDashboardLayout from '@/components/layout/VendorDashboardLayout';
import DocumentUploadSection from '@/components/vendor/document/DocumentUploadSection';

const Documents = () => {
  return (
    <VendorDashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <DocumentUploadSection />
      </div>
    </VendorDashboardLayout>
  );
};

export default Documents;
