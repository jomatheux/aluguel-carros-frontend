import React, { useState, useEffect } from 'react';
import { Car, CreateCarData } from '../../types'; // Assuming these types are defined
import { toast } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import Loading from '../ui/Loading'; // Assuming this path is correct

// Define CarroStatus enum (ideally, this comes from your types.ts)
export enum CarroStatus {
  DISPONIVEL = 'DISPONIVEL',
  LOCADO = 'LOCADO',
  MANUTENCAO = 'MANUTENCAO',
}

// Assuming CreateCarData is updated in types.ts:
// export interface CreateCarData {
//   modelo: string;
//   marca: string;
//   ano: number;
//   placa: string;
//   precoPorDia: string;
//   imagem: string;
//   status: CarroStatus; // Added status
// }
// And Car might be:
// export interface Car extends CreateCarData {
//   id: string;
//   status: CarroStatus; // Added status
// }


interface CarFormProps {
  car?: Car; // Car object for editing, optional
  onSubmit: (data: CreateCarData) => Promise<void>; // Submission handler
  onCancel: () => void; // Cancellation handler
  isSubmitting: boolean; // Flag to indicate submission process
}

const CarForm: React.FC<CarFormProps> = ({ 
  car, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState<CreateCarData>({
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(),
    placa: '',
    precoPorDia: '',
    imagem: '',
    status: CarroStatus.DISPONIVEL, // Initialize status
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (car) {
      setFormData({
        modelo: car.modelo,
        marca: car.marca,
        ano: car.ano,
        placa: car.placa,
        precoPorDia: String(car.precoPorDia ?? ''),
        imagem: car.imagem,
        status: car.status || CarroStatus.DISPONIVEL, // Populate status
      });
    } else {
      // Reset to default for new car form
      setFormData({
        modelo: '',
        marca: '',
        ano: new Date().getFullYear(),
        placa: '',
        precoPorDia: '',
        imagem: '',
        status: CarroStatus.DISPONIVEL,
      });
    }
  }, [car]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'ano') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0, 
      }));
    } else if (name === 'status') {
      setFormData((prev) => ({
        ...prev,
        [name]: value as CarroStatus, // Cast value to CarroStatus
      }));
    }
     else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo is required';
    }
    
    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca is required';
    }
    
    if (!formData.ano) { 
      newErrors.ano = 'Ano is required';
    } else if (isNaN(formData.ano)) {
      newErrors.ano = 'Ano must be a valid number';
    } else if (formData.ano < 1900 || formData.ano > new Date().getFullYear() + 1) {
      newErrors.ano = 'Ano must be a valid year';
    }
    
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa is required';
    } else if (formData.placa.length < 5) { 
      newErrors.placa = 'Placa must be valid (e.g., at least 5 characters)';
    }
    
    if (!formData.precoPorDia.trim()) {
      newErrors.precoPorDia = 'Price per day is required';
    } else {
      const priceValue = parseFloat(formData.precoPorDia);
      if (isNaN(priceValue)) {
        newErrors.precoPorDia = 'Price per day must be a valid number format (e.g., 50.99)';
      } else if (priceValue <= 0) {
        newErrors.precoPorDia = 'Price must be greater than 0';
      }
    }
    
    if (!formData.imagem.trim()) {
      newErrors.imagem = 'Image URL is required';
    } else if (!isValidUrl(formData.imagem)) {
      newErrors.imagem = 'Please enter a valid URL';
    }

    // Validate 'status'
    if (!formData.status || !Object.values(CarroStatus).includes(formData.status as CarroStatus)) {
      newErrors.status = 'Status is required and must be a valid option.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!validate()) return; 
    
    try {
      await onSubmit(formData); 
    } catch (error) {
      toast.error('Failed to save car. Please check the details and try again.');
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-xl">
      <h3 className="text-2xl font-semibold mb-6 text-neutral-800 border-b pb-3">
        {car ? 'Edit Car' : 'Add New Car'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Marca field */}
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-neutral-700 mb-1">
            Marca
          </label>
          <input
            id="marca"
            name="marca"
            type="text"
            value={formData.marca}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.marca ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
            placeholder="Ex: Toyota"
          />
          {errors.marca && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.marca}
            </div>
          )}
        </div>

        {/* Modelo field */}
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-neutral-700 mb-1">
            Modelo
          </label>
          <input
            id="modelo"
            name="modelo"
            type="text"
            value={formData.modelo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.modelo ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
            placeholder="Ex: Corolla"
          />
          {errors.modelo && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.modelo}
            </div>
          )}
        </div>

        {/* Ano field */}
        <div>
          <label htmlFor="ano" className="block text-sm font-medium text-neutral-700 mb-1">
            Ano
          </label>
          <input
            id="ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.ano ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
            placeholder="Ex: 2023"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.ano && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.ano}
            </div>
          )}
        </div>

        {/* Placa field */}
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-neutral-700 mb-1">
            Placa
          </label>
          <input
            id="placa"
            name="placa"
            type="text"
            value={formData.placa}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.placa ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
            placeholder="Ex: ABC1D23"
          />
          {errors.placa && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.placa}
            </div>
          )}
        </div>

        {/* PrecoPorDia field */}
        <div>
          <label htmlFor="precoPorDia" className="block text-sm font-medium text-neutral-700 mb-1">
            Preço por Dia (R$)
          </label>
          <input
            id="precoPorDia"
            name="precoPorDia"
            type="number"
            value={formData.precoPorDia}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.precoPorDia ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
            placeholder="Ex: 50.00"
            min="0.01"
            step="0.01"
          />
          {errors.precoPorDia && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.precoPorDia}
            </div>
          )}
        </div>

        {/* Status field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.status ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
          >
            {Object.values(CarroStatus).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue.charAt(0) + statusValue.slice(1).toLowerCase()} 
              </option>
            ))}
          </select>
          {errors.status && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.status}
            </div>
          )}
        </div>
      </div>

      {/* Image URL field */}
      <div className="pt-2"> {/* Added some top padding */}
        <label htmlFor="imagem" className="block text-sm font-medium text-neutral-700 mb-1">
          URL da Imagem
        </label>
        <input
          id="imagem"
          name="imagem"
          type="text"
          value={formData.imagem}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.imagem ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'}`}
          placeholder="https://example.com/imagem-do-carro.jpg"
        />
        {errors.imagem && (
          <div className="text-red-600 text-xs mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.imagem}
          </div>
        )}
      </div>

      {/* Image preview */}
      {formData.imagem && isValidUrl(formData.imagem) && (
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-1">Preview da Imagem:</p>
          <img
            src={formData.imagem}
            alt="Pré-visualização do carro"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-neutral-300 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x300/E2E8F0/94A3B8?text=Imagem+Inv%C3%A1lida+ou+N%C3%A3o+Encontrada';
            }}
          />
        </div>
      )}

      {/* Form buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-neutral-400 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-60 transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition-colors flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loading size="small" color="white" />
          ) : car ? (
            'Atualizar Carro'
          ) : (
            'Adicionar Carro'
          )}
        </button>
      </div>
    </form>
  );
};

export default CarForm;
