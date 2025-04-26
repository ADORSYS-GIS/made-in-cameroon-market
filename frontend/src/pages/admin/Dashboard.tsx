
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';

const Dashboard = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cameroon-blue">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Vendors</CardTitle>
              <CardDescription>Total registered vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">24</div>
              <div className="text-sm text-green-600 mt-1">
                <span className="font-medium">+5</span> this week
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>Vendors awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">15</div>
              <a href="/admin/vendor-approvals" className="text-sm text-cameroon-blue hover:underline mt-1 inline-block">
                Review now
              </a>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Products</CardTitle>
              <CardDescription>Total products listed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">126</div>
              <div className="text-sm text-green-600 mt-1">
                <span className="font-medium">+18</span> this week
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Total marketplace revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cameroon-blue">26,450 XAF</div>
              <div className="text-sm text-green-600 mt-1">
                <span className="font-medium">+5.2%</span> this month
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-cameroon-blue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    New vendor registration - <span className="text-cameroon-blue">Cameroon Crafts</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Today, 09:23 AM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Vendor approved - <span className="text-cameroon-blue">Bamenda Weavers</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 4:56 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Document verification needed - <span className="text-cameroon-blue">Douala Fresh Foods</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 2:30 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Vendor rejected - <span className="text-cameroon-blue">Fake Products Ltd</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Apr 24, 5:12 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default Dashboard;
