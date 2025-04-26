import axios from 'axios';

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
      email,
      password,
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Login failed';
    throw new Error(message);
  }
};

export const register = async (email: string, password: string): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/register`, {
      email,
      password,
    });
    console.log('Register API response:', response.data);
    return response.data; // Backend returns { id, email, role }
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'Registration failed';
    console.error('Register API error:', error);
    throw new Error(message);
  }
};