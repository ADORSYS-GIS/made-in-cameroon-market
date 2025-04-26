import axios from 'axios';

export interface SystemMetrics {
  uptime: number;
  latency: number;
  errorRate: number;
}

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/metrics`);
  return response.data;
};