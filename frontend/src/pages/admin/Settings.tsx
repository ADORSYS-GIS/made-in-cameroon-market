
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cameroon-blue">Platform Settings</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input defaultValue="Made in Cameroon Marketplace" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input type="email" placeholder="admin@example.com" />
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-base font-medium">Commission Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <Input type="number" defaultValue="5" min="0" max="100" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-cameroon-blue hover:bg-cameroon-blue/90">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-base font-medium">Session Management</h3>
                <Button variant="outline" className="text-red-600 hover:text-red-600">
                  Revoke All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Settings;
