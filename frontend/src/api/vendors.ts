import axios from 'axios';

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  idDocumentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const getPendingVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors/pending`);
    console.log('getPendingVendors response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Failed to fetch vendors';
    console.error('getPendingVendors error:', error);
    throw new Error(message);
  }
};

export const getVendorDetails = async (id: string): Promise<Vendor> => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors/${id}`);
    return response.data;
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Failed to fetch vendor details';
    throw new Error(message);
  }
};

export const updateVendorStatus = async (
  id: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<void> => {
  try {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/vendors/${id}`, { status, reason });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Failed to update vendor status';
    throw new Error(message);
  }
};