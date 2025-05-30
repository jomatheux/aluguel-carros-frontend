import api from './api';
import { Rental, CreateRentalData, RentalStatusUpdate, ApiResponse } from '../types';

export const RentalService = {
  async createRental(data: CreateRentalData): Promise<ApiResponse<Rental>> {
    try {
      const response = await api.post<ApiResponse<Rental>>('/rentals', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create rental',
        errors: error.response?.data?.errors,
      };
    }
  },

  async getUserRentals(): Promise<ApiResponse<Rental[]>> {
    try {
      const response = await api.get<ApiResponse<Rental[]>>('/rentals/user');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user rentals',
      };
    }
  },

  async getAllRentals(): Promise<ApiResponse<Rental[]>> {
    try {
      const response = await api.get<ApiResponse<Rental[]>>('/rentals');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch all rentals',
      };
    }
  },

  async getRentalById(id: string): Promise<ApiResponse<Rental>> {
    try {
      const response = await api.get<ApiResponse<Rental>>(`/rentals/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch rental details',
      };
    }
  },

  async updateRentalStatus(id: string, statusUpdate: RentalStatusUpdate): Promise<ApiResponse<Rental>> {
    try {
      const response = await api.patch<ApiResponse<Rental>>(`/rentals/${id}/status`, statusUpdate);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update rental status',
      };
    }
  },

  async cancelRental(id: string): Promise<ApiResponse<Rental>> {
    try {
      const response = await api.patch<ApiResponse<Rental>>(`/rentals/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel rental',
      };
    }
  },

  async getRentalsByStatus(status: string): Promise<ApiResponse<Rental[]>> {
    try {
      const response = await api.get<ApiResponse<Rental[]>>(`/rentals/status/${status}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch rentals by status',
      };
    }
  }
};

export default RentalService;