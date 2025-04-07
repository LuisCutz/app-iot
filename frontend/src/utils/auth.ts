import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000/auth';

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
  };
}

interface JWTPayload {
  sub: number;
  email: string;
  nombre: string;
  exp: number;
}

export const register = async (email: string, password: string, nombre: string): Promise<boolean> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/register`, {
      email,
      password,
      nombre
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userName', response.data.user.nombre);
      return true;
    }
    return false;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userName', response.data.user.nombre);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUserName = (): string => {
  return localStorage.getItem('userName') || '';
};

export const login = (token: string): void => {
  localStorage.setItem('token', token);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};