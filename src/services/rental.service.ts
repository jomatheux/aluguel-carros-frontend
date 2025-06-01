import api from './api';
import { Rental, CreateRentalData, RentalStatusUpdate } from '../types';
import { AxiosResponse } from 'axios';


export const RentalService = {
  async createRental(data: CreateRentalData): Promise<AxiosResponse> {
    try {
      const response = await api.post<AxiosResponse>('/rentals', data);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getUserRentals(): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>('/rentals/user');
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getAllRentals(): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>('/rentals');
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getRentalById(id: string): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>(`/rentals/${id}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async updateRentalStatus(id: string, statusUpdate: RentalStatusUpdate): Promise<AxiosResponse> {
    try {
      const response = await api.patch<AxiosResponse>(`/rentals/${id}/status`, statusUpdate);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async cancelRental(id: string): Promise<AxiosResponse> {
    try {
      const response = await api.patch<AxiosResponse>(`/rentals/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getRentalsByStatus(status: string): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>(`/rentals/status/${status}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  }
};

export default RentalService;