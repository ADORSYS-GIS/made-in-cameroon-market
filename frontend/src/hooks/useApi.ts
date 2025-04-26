import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useApi = <T>(apiCall: () => Promise<T>): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiCall, refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  return { data, loading, error, refresh };
};