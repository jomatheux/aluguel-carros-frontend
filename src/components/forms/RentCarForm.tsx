import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, CreateRentalData } from '../../types';
import { CarService } from '../../services/car.service';
import { RentalService } from '../../services/rental.service';
import { Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loading from '../ui/Loading';

interface RentCarFormProps {
  carId: string;
}

const RentCarForm: React.FC<RentCarFormProps> = ({ carId }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  
  const navigate = useNavigate();

  // Format the current date as YYYY-MM-DD for min attribute of date inputs
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const response = await CarService.getCarById(carId);
        if (response) {
          setCar(response.data);
          
          // Set default dates (today and tomorrow)
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          setFormData({
            startDate: formattedToday,
            endDate: tomorrow.toISOString().split('T')[0],
          });
        } else {
          toast.error('Failed to load car details');
          navigate('/cars');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId, navigate, formattedToday]);

  // Calculate price when dates change
  useEffect(() => {
    if (car && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      // Check if dates are valid
      if (start <= end) {
        // Calculate days difference
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate total price
        setTotalPrice(Number(car.precoPorDia) * diffDays);
        
        // Clear date error if it exists
        if (errors.dates) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.dates;
            return newErrors;
          });
        }
      } else {
        setTotalPrice(null);
        setErrors((prev) => ({
          ...prev,
          dates: 'End date must be after start date',
        }));
      }
    }
  }, [car, formData.startDate, formData.endDate, errors.dates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dates = 'End date must be after start date';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit rental
    setSubmitting(true);
    try {
      const rentalData: CreateRentalData = {
        carId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };
      
      const response = await RentalService.createRental(rentalData);
      
      if (response) {
        toast.success('Car rental successful!');
        navigate('/rentals');
      } else {
        toast.error( 'Failed to rent car');
        
        // Set field errors if available
        if (response) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(response).forEach(([key, messages]) => {
            if (Array.isArray(messages) && typeof messages[0] === 'string') {
              fieldErrors[key] = messages[0];
            } else if (typeof messages === 'string') {
              fieldErrors[key] = messages;
            }
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <Loading text="Loading car details..." />;
  }

  if (!car) {
    return <div className="text-center text-red-500">Car not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Car info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <img 
              src={car.imagem || 'https://via.placeholder.com/300?text=No+Image'} 
              alt={`${car.marca} ${car.modelo}`}
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{car.marca} {car.modelo}</h2>
            <p className="text-neutral-500 mb-2">{car.ano} • Placa: {car.placa}</p>
            <div className="flex items-center text-primary-600">
              <DollarSign className="h-5 w-5 mr-1" />
              <span className="text-lg font-semibold">{formatCurrency(Number(car.precoPorDia))}</span>
              <span className="text-neutral-500 text-sm ml-1">per day</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rental form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Rental Details</h3>
        
        <div className="space-y-4">
          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`form-input ${errors.startDate || errors.dates ? 'border-accent-500 focus:ring-accent-500' : ''}`}
                value={formData.startDate}
                onChange={handleChange}
                min={formattedToday}
              />
              {errors.startDate && (
                <div className="form-error flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.startDate}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="endDate" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className={`form-input ${errors.endDate || errors.dates ? 'border-accent-500 focus:ring-accent-500' : ''}`}
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || formattedToday}
              />
              {errors.endDate && (
                <div className="form-error flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>
          
          {/* Date error message */}
          {errors.dates && (
            <div className="form-error flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dates}
            </div>
          )}
          
          {/* Rental summary */}
          <div className="bg-neutral-50 p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Rental Summary
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Daily Rate:</span>
                <span>{formatCurrency(Number(car.precoPorDia))}</span>
              </div>
              
              {totalPrice !== null && (
                <>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>
                      {Math.ceil(
                        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )} days
                    </span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-200">
                    <span>Total:</span>
                    <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={submitting || totalPrice === null}
            >
              {submitting ? (
                <Loading size="small" color="white" />
              ) : (
                <>Confirm Rental</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RentCarForm;