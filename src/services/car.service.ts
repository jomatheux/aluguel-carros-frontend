import api from './api';
import { Car, CreateCarData } from '../types';
import { AxiosResponse } from 'axios';

export const CarService = {
  async getAvailableCars(): Promise<Car[]> {
    try {
      const response = await api.get('/carros/available');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching available cars');
    }
  },

  async getAllCars(): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>('/carros');
      return response;
    } catch (error: any) {
      return error;
    }
  },

  async getCarById(id: string): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>(`/carros/${id}`);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  async createCar(data: CreateCarData): Promise<AxiosResponse> {
    try {
      const response = await api.post<AxiosResponse>('/carros', data);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  async updateCar(id: string, data: Partial<CreateCarData>): Promise<AxiosResponse> {
    try {
      const response = await api.put<AxiosResponse>(`/carros/${id}`, data);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  async deleteCar(id: string): Promise<AxiosResponse<void>> {
    try {
      const response = await api.delete<AxiosResponse<void>>(`/carros/${id}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async updateCarStatus(id: string, status: 'available' | 'unavailable'): Promise<AxiosResponse> {
    try {
      const response = await api.patch<AxiosResponse>(`/carros/${id}/status`, { status });
      return response;
    } catch (error: any) {
      return error;
    }
  }
};

export default CarService;