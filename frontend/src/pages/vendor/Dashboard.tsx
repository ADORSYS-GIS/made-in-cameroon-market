
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VendorDashboardLayout from '@/components/layout/VendorDashboardLayout';

const Dashboard = () => {
  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cameroon-blue">Vendor Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Products</CardTitle>
              <CardDescription>Total products in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">0</div>
              <p className="text-sm text-gray-500 mt-1">Add your first product to start selling</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Orders</CardTitle>
              <CardDescription>Total orders received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">0</div>
              <p className="text-sm text-gray-500 mt-1">No orders yet</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Total earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">0 XAF</div>
              <p className="text-sm text-gray-500 mt-1">Add products to start earning</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account Status</CardTitle>
            <CardDescription>Current status of your vendor account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M19 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-yellow-700 font-medium">Pending Verification</h3>
              </div>
              <p className="mt-2 text-sm text-yellow-600">
                Your account is currently under review. This process usually takes 1-2 business days.
                Please ensure you have uploaded all required documents for verification.
              </p>
              <div className="mt-4">
                <a href="/vendor/documents" className="text-cameroon-blue hover:underline text-sm font-medium">
                  Go to Document Verification
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Getting Started</CardTitle>
            <CardDescription>Steps to set up your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cameroon-blue text-white flex items-center justify-center text-sm">
                  1
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium">Complete your profile</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Add your business details, logo, and contact information
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cameroon-blue text-white flex items-center justify-center text-sm">
                  2
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium">Upload verification documents</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Submit required documentation to verify your business
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm">
                  3
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-500">Add your products</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Create your product listings with photos and descriptions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm">
                  4
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-500">Set up payment methods</h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Connect MTN Mobile Money or Orange Money to receive payments
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorDashboardLayout>
  );
};

export default Dashboard;
