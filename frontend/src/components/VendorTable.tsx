import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

interface Vendor {
  id: string;
  name: string;
  phone: string;
  idDocumentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface VendorTableProps {
  vendors: Vendor[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onApprove, onReject }) => {
  // Ensure vendors is an array; fallback to empty array if not
  const vendorList = Array.isArray(vendors) ? vendors : [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Document</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendorList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No vendors found
              </TableCell>
            </TableRow>
          ) : (
            vendorList.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <a href={vendor.idDocumentUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </TableCell>
                <TableCell>{vendor.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => onApprove(vendor.id)}
                    disabled={vendor.status !== 'pending'}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onReject(vendor.id)}
                    disabled={vendor.status !== 'pending'}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VendorTable;