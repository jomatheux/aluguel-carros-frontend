import api from './api';
import { CreateRentalData, RentalStatusUpdate, Rental } from '../types';
import { AxiosResponse } from 'axios';


export const RentalService = {
  async createRental(data: CreateRentalData): Promise<AxiosResponse> {
    try {
      const response = await api.post<AxiosResponse>('/alugueis', data);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getUserRentals(): Promise<Rental[]> {
  const response = await api.get('/alugueis/user');
  return response.data.map((rental: any) => ({
    ...rental,
    valorTotal: Number(rental.valorTotal) // Conversão crucial
  }));
},


  async getAllRentals(): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>('/alugueis');
      return response;
    } catch (error: any) {
      return error;
    }
  },

  async getRentalById(id: string): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>(`/alugueis/${id}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async updateRentalStatus(id: string, statusUpdate: RentalStatusUpdate): Promise<AxiosResponse> {
    try {
      const response = await api.patch<AxiosResponse>(`/alugueis/${id}/status`, statusUpdate);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async cancelRental(id: string): Promise<AxiosResponse> {
    try {
      const response = await api.patch<AxiosResponse>(`/alugueis/${id}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getRentalsByStatus(status: string): Promise<AxiosResponse> {
    try {
      const response = await api.get<AxiosResponse>(`/alugueis/status/${status}`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  }
};

export default RentalService;