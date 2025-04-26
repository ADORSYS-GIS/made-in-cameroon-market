
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Vendor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  registrationDate: Date;
  documents: {
    idCard: string;
    businessLicense: string;
    taxCertificate?: string;
  };
}

const VendorApprovalDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const itemsPerPage = 10;

  // Simulate fetching pending vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // This would be a tRPC call in a real app
        // const result = await trpc.admin.getPendingVendors.query({ 
        //   page: currentPage,
        //   limit: itemsPerPage,
        //   search: searchQuery 
        // });
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate some mock vendors
        const mockVendors: Vendor[] = Array.from({ length: 15 }, (_, i) => ({
          id: `v${i+1}`,
          name: `Vendor Name ${i+1}`,
          businessName: `Business ${i+1}`,
          email: `vendor${i+1}@example.com`,
          phone: `+23761234${i.toString().padStart(4, '0')}`,
          registrationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          documents: {
            idCard: '#',
            businessLicense: '#',
            taxCertificate: i % 2 === 0 ? '#' : undefined
          }
        }));
        
        // Filter by search query if provided
        const filtered = searchQuery 
          ? mockVendors.filter(v => 
              v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : mockVendors;
          
        // Paginate results
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedVendors = filtered.slice(start, end);
        
        setPendingVendors(paginatedVendors);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } catch (error) {
        toast({
          title: "Failed to load vendors",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [currentPage, searchQuery, toast]);

  const handleApproveVendor = async (vendor: Vendor) => {
    try {
      // This would be a tRPC call in a real app
      // await trpc.admin.approveVendor.mutate({ vendorId: vendor.id });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove vendor from list
      setPendingVendors(prev => prev.filter(v => v.id !== vendor.id));
      
      toast({
        title: "Vendor Approved",
        description: `${vendor.businessName} has been approved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "There was an error approving this vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectVendor = async () => {
    if (!selectedVendor) return;
    
    try {
      // This would be a tRPC call in a real app
      // await trpc.admin.rejectVendor.mutate({ 
      //   vendorId: selectedVendor.id,
      //   reason: rejectionReason 
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove vendor from list
      setPendingVendors(prev => prev.filter(v => v.id !== selectedVendor.id));
      
      toast({
        title: "Vendor Rejected",
        description: `${selectedVendor.businessName} has been rejected.`,
      });
      
      // Close dialog and clear state
      setIsRejectionDialogOpen(false);
      setRejectionReason('');
      setSelectedVendor(null);
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting this vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openRejectionDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsRejectionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-cameroon-blue">Vendor Approval Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Review and approve vendor applications
          </p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors..."
              className="md:w-64"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <Card className="shadow-sm">
          <CardContent className="p-8 flex justify-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 bg-cameroon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-4 w-4 bg-cameroon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-4 w-4 bg-cameroon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </CardContent>
        </Card>
      ) : pendingVendors.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No pending vendor applications found</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.businessName}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{vendor.email}</div>
                          <div className="text-gray-500">{vendor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }).format(new Date(vendor.registrationDate))}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
                            <a href={vendor.documents.idCard} target="_blank" rel="noopener noreferrer">ID</a>
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
                            <a href={vendor.documents.businessLicense} target="_blank" rel="noopener noreferrer">License</a>
                          </Button>
                          {vendor.documents.taxCertificate && (
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
                              <a href={vendor.documents.taxCertificate} target="_blank" rel="noopener noreferrer">Tax</a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" className="h-8" onClick={() => handleApproveVendor(vendor)}>
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => openRejectionDialog(vendor)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {pendingVendors.length} of {totalPages * itemsPerPage} vendors
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this vendor application.
              The vendor will be notified of this reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea 
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this vendor is being rejected..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectVendor}
              disabled={!rejectionReason.trim()}
            >
              Reject Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorApprovalDashboard;
