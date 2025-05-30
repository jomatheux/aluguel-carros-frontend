import React, { useState, useEffect } from 'react';
import { Car, CreateCarData } from '../../types'; // Assuming these types are defined
import { toast } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import Loading from '../ui/Loading'; // Assuming this path is correct

interface CarFormProps {
  car?: Car; // Car object for editing, optional
  onSubmit: (data: CreateCarData) => Promise<void>; // Submission handler
  onCancel: () => void; // Cancellation handler
  isSubmitting: boolean; // Flag to indicate submission process
}

// Assuming CreateCarData is defined like this in types.ts to match "number string"
// export interface CreateCarData {
//   modelo: string;
//   marca: string;
//   ano: number;
//   placa: string;
//   precoPorDia: string; // Key change: must be a string for "number string"
//   imagem: string;
// }
// And Car might be:
// export interface Car extends CreateCarData {
//   id: string;
//   // precoPorDia might come as number or string from API, hence String() conversion
// }


const CarForm: React.FC<CarFormProps> = ({ 
  car, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState<CreateCarData>({
    modelo: '',
    marca: '',
    ano: new Date().getFullYear(), // Stays as number in state
    placa: '',
    precoPorDia: '', // Initialized as string, will remain string
    imagem: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If a car object is provided (editing mode), populate the form
    if (car) {
      setFormData({
        modelo: car.modelo,
        marca: car.marca,
        ano: car.ano, // ano is a number
        placa: car.placa,
        precoPorDia: String(car.precoPorDia ?? ''), // Ensure precoPorDia is a string
        imagem: car.imagem,
      });
    }
  }, [car]); // Rerun effect if car prop changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'ano') {
      // 'ano' should be stored as a number
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0, // Default to 0 or handle NaN appropriately
      }));
    } else {
      // For 'precoPorDia' and other text-based inputs, store the value as a string.
      // The input type="number" for precoPorDia will provide 'value' as a string.
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear the error for the field being edited
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
    
    // Validate 'modelo'
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo is required';
    }
    
    // Validate 'marca'
    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca is required';
    }
    
    // Validate 'ano'
    if (!formData.ano) { // Checks for 0 or NaN if parseInt failed to a falsy value
      newErrors.ano = 'Ano is required';
    } else if (isNaN(formData.ano)) {
      newErrors.ano = 'Ano must be a valid number';
    } else if (formData.ano < 1900 || formData.ano > new Date().getFullYear() + 1) {
      newErrors.ano = 'Ano must be a valid year';
    }
    
    // Validate 'placa'
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa is required';
    } else if (formData.placa.length < 5) { // Example validation, adjust as needed
      newErrors.placa = 'Placa must be valid (e.g., at least 5 characters)';
    }
    
    // Validate 'precoPorDia'
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
    
    // Validate 'imagem' (Image URL)
    if (!formData.imagem.trim()) {
      newErrors.imagem = 'Image URL is required'; // Corrected error key
    } else if (!isValidUrl(formData.imagem)) {
      newErrors.imagem = 'Please enter a valid URL'; // Corrected error key
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Helper function to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    if (!validate()) return; // If validation fails, do not submit
    
    try {
      // formData.precoPorDia is now a string, matching "number string" requirement
      await onSubmit(formData); 
    } catch (error) {
      // Handle submission error (e.g., display a toast notification)
      toast.error('Failed to save car. Please check the details and try again.');
      console.error("Submission error:", error);
    }
  };

  // CSS classes like 'form-label', 'form-input', 'form-error', 'btn-primary', 'btn-outline'
  // are assumed to be defined globally or via a CSS framework like Tailwind CSS.

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-neutral-700">
        {car ? 'Edit Car' : 'Add New Car'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.marca ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            placeholder="Toyota"
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.modelo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            placeholder="Corolla"
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
            type="number" // HTML5 input type for better UX
            value={formData.ano} // Stored as number
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.ano ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            placeholder="2023"
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.placa ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            placeholder="ABC1D23"
          />
          {errors.placa && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.placa}
            </div>
          )}
        </div>

        {/* PrecoPorDia field */}
        <div className="md:col-span-2"> {/* Make price and image full width on medium screens if desired */}
          <label htmlFor="precoPorDia" className="block text-sm font-medium text-neutral-700 mb-1">
            Price per Day (e.g., 50.99)
          </label>
          <input
            id="precoPorDia"
            name="precoPorDia"
            type="number" // HTML5 input type for better UX (e.g. numeric keyboard on mobile)
                         // e.target.value will still be a string
            value={formData.precoPorDia} // Stored as string
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.precoPorDia ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            placeholder="50.00"
            min="0.01" // Minimum value for the input
            step="0.01" // Step for number input
          />
          {errors.precoPorDia && (
            <div className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.precoPorDia}
            </div>
          )}
        </div>
      </div>

      {/* Image URL field */}
      <div>
        <label htmlFor="imagem" className="block text-sm font-medium text-neutral-700 mb-1">
          Image URL
        </label>
        <input
          id="imagem"
          name="imagem"
          type="text"
          value={formData.imagem}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.imagem ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300'}`}
          placeholder="https://example.com/car-image.jpg"
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
        <div className="mt-2">
          <p className="text-sm text-neutral-500 mb-1">Image Preview:</p>
          <img
            src={formData.imagem}
            alt="Car preview"
            className="w-full max-w-sm h-40 object-cover rounded-md border border-neutral-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/E2E8F0/94A3B8?text=Invalid+Or+Missing+Image';
              // Optionally, keep or set an error if the preview fails but URL was initially valid
              // setErrors((prev) => ({
              //   ...prev,
              //   imagem: 'Image could not be loaded, please check the URL.',
              // }));
            }}
          />
        </div>
      )}

      {/* Form buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loading size="small" color="white" />
          ) : car ? (
            'Update Car'
          ) : (
            'Add Car'
          )}
        </button>
      </div>
    </form>
  );
};

export default CarForm;
