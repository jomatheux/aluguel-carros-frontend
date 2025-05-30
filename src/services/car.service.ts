import api from './api';
import { Car, CreateCarData, ApiResponse } from '../types';

export const CarService = {
  async getAvailableCars(): Promise<ApiResponse<Car[]>> {
    try {
      const response = await api.get<ApiResponse<Car[]>>('/carros/available');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available cars',
      };
    }
  },

  async getAllCars(): Promise<ApiResponse<Car[]>> {
    try {
      const response = await api.get<ApiResponse<Car[]>>('/carros');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch all cars',
      };
    }
  },

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    try {
      const response = await api.get<ApiResponse<Car>>(`/carros/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch car details',
      };
    }
  },

  async createCar(data: CreateCarData): Promise<ApiResponse<Car>> {
    try {
      const response = await api.post<ApiResponse<Car>>('/carros', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create car',
        errors: error.response?.data?.errors,
      };
    }
  },

  async updateCar(id: string, data: Partial<CreateCarData>): Promise<ApiResponse<Car>> {
    try {
      const response = await api.put<ApiResponse<Car>>(`/cars/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update car',
        errors: error.response?.data?.errors,
      };
    }
  },

  async deleteCar(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/cars/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete car',
      };
    }
  },

  async updateCarStatus(id: string, status: 'available' | 'unavailable'): Promise<ApiResponse<Car>> {
    try {
      const response = await api.patch<ApiResponse<Car>>(`/cars/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update car status',
      };
    }
  }
};

export default CarService;