import axios from 'axios';

export interface Dispute {
  id: string;
  vendorId: string;
  buyerId: string;
  orderId: string;
  status: 'open' | 'resolved' | 'escalated';
  messages: { sender: string; content: string; timestamp: string }[];
}

export const getDisputes = async (status?: string): Promise<Dispute[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/disputes`, {
    params: { status },
  });
  return response.data;
};

export const getDisputeDetails = async (id: string): Promise<Dispute> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/disputes/${id}`);
  return response.data;
};

export const sendDisputeMessage = async (id: string, content: string): Promise<void> => {
  await axios.post(`${import.meta.env.VITE_API_URL}/admin/disputes/${id}/message`, { content });
};

export const resolveDispute = async (id: string, resolution: string): Promise<void> => {
  await axios.patch(`${import.meta.env.VITE_API_URL}/admin/disputes/${id}`, { resolution });
};