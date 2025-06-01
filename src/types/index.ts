// User types
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cnh: string;
  role: 'ADMIN' | 'CLIENTE';
  telefone?: string;
  dataNascimento: string; // YYYY-MM-DD
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnh: string;
  dataNascimento: string; // YYYY-MM-DD
  role: 'ADMIN' | 'CLIENTE';
  telefone?: string; // Optional field
}

// Car types
export interface Car {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  placa: string;
  precoPorDia: string;
  imagem: string;
  status: 'DISPONIVEL' | 'LOCADO' | 'MANUTENCAO';
}

export interface CreateCarData {
  modelo: string;
  marca: string;
  ano: number;
  placa: string;
  precoPorDia: string;
  imagem: string;
  status: 'DISPONIVEL' | 'LOCADO' | 'MANUTENCAO';
}

// Rental types
export interface Rental {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  car: Car;
  user: User;
}

export interface CreateRentalData {
  carId: string;
  startDate: string;
  endDate: string;
}

export interface RentalStatusUpdate {
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}