import api from './api';
import { LoginCredentials, RegisterData } from '../types';
import { AxiosResponse } from 'axios';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AxiosResponse> {
    try {
      const response = await api.post<AxiosResponse>('/auth/signin', credentials);

      if (response.data) {
        if (response.data.data?.accessToken) {
          localStorage.setItem('token', response.data.data?.accessToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.data?.user));
      }

      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async register(data: RegisterData): Promise<AxiosResponse> {
    try {
      const response = await api.post<AxiosResponse>('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;