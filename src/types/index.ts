// User types
export interface User {
  id: string;
  nome: string;
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
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  status: 'ATIVA' | 'CANCELADO' | 'FINALIZADO' | 'PENDENTE' | 'all';
  carro: Car;
  usuarioId: string;
  usuario: User;
  pagamentoId: string;
}

export interface CreateRentalData {
  usuarioId: string; 
  carroId: string;
  dataInicio: string;
  dataFim: string;
  formaPagamento: string;
}

export interface RentalStatusUpdate {
  status: 'ATIVA' | 'CANCELADO' | 'FINALIZADO' | 'PENDENTE';
  carroId?: string; // Optional, used when updating status to 'CANCELADO'
}