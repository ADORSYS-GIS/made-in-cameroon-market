import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import VendorTable from '../components/VendorTable';
import { getPendingVendors, updateVendorStatus } from '../api/vendors';

interface Vendor {
  id: string;
  name: string;
  phone: string;
  idDocumentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getPendingVendors();
        console.log('Fetched vendors:', data); // Debug log
        setVendors(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vendors';
        console.error('Fetch vendors error:', errorMessage);
        setError(errorMessage);
        setVendors([]); // Ensure vendors is an array on error
      }
    };
    fetchVendors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateVendorStatus(id, 'approved');
      setVendors(vendors.map((v) => (v.id === id ? { ...v, status: 'approved' } : v)));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to approve vendor');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateVendorStatus(id, 'rejected');
      setVendors(vendors.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v)));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to reject vendor');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          Vendor Management
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <VendorTable vendors={vendors} onApprove={handleApprove} onReject={handleReject} />
      </Box>
    </Container>
  );
};

export default Vendors;