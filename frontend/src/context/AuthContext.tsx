import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { login, register, LoginResponse, RegisterResponse } from '../api/auth';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<RegisterResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  register: async () => ({ id: 0, email: '', role: '' }),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const loginHandler = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await login(email, password);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
    }
  };

  const registerHandler = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response: RegisterResponse = await register(email, password);
      console.log('Register handler response:', response);
      return response;
    } catch (error) {
      console.error('Register handler error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login: loginHandler, register: registerHandler, logout }}>
      {children}
    </AuthContext.Provider>
  );
};