import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, CreateRentalData } from '../../types';
import { CarService } from '../../services/car.service';
import { RentalService } from '../../services/rental.service';
import { Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loading from '../ui/Loading';
import { AxiosResponse } from 'axios';

interface RentCarFormProps {
  carId: string;
}

const RentCarForm: React.FC<RentCarFormProps> = ({ carId }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<{
    dataInicio: string;
    dataFim: string;
    formaPagamento: 'CARTAO' | 'PIX';
  }>({
    dataInicio: '',
    dataFim: '',
    formaPagamento: 'CARTAO',  // valor padrão
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const navigate = useNavigate();

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const response = await CarService.getCarById(carId);

        if (response) {
          setCar((response.data));
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          setFormData({
            dataInicio: formattedToday,
            dataFim: tomorrow.toISOString().split('T')[0],
            formaPagamento: 'CARTAO',
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

  useEffect(() => {
    if (car && formData.dataInicio && formData.dataFim) {
      const start = new Date(formData.dataInicio);
      const end = new Date(formData.dataFim);

      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setTotalPrice(Number(car.precoPorDia) * diffDays);

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
  }, [car, formData.dataInicio, formData.dataFim, errors.dates]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Start date is required';
    }

    if (!formData.dataFim) {
      newErrors.dataFim = 'End date is required';
    }

    if (new Date(formData.dataInicio) > new Date(formData.dataFim)) {
      newErrors.dates = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get userId from localStorage (or replace with your auth logic)
    const userString = localStorage.getItem('user');
    let userId: string | undefined;
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        userId = userObj?.id;
      } catch (e) {
        userId = undefined;
      }
    }

    if (!userId) {
      toast.error('User not found. Please log in again.');
      setSubmitting(false);
      return;
    }

    // Submit rental
    setSubmitting(true);
    try {
        const rentalData: CreateRentalData = {
          usuarioId: userId,
          carroId: carId,
          dataInicio: new Date(formData.dataInicio).toISOString(),
          dataFim: new Date(formData.dataFim).toISOString(),
          formaPagamento: formData.formaPagamento,
        };


      const response = await RentalService.createRental(rentalData);

      if (response) {
        toast.success('Car rental successful!');
        navigate('/rentals');
      } else {
        toast.error('Failed to rent car');

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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Rental Details</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataInicio" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                className={`form-input ${errors.dataInicio || errors.dates ? 'border-accent-500 focus:ring-accent-500' : ''}`}
                value={formData.dataInicio}
                onChange={handleChange}
                min={formattedToday}
              />
              {errors.dataInicio && (
                <div className="form-error flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dataInicio}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="dataFim" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                className={`form-input ${errors.dataFim || errors.dates ? 'border-accent-500 focus:ring-accent-500' : ''}`}
                value={formData.dataFim}
                onChange={handleChange}
                min={formData.dataInicio || formattedToday}
              />
              {errors.dataFim && (
                <div className="form-error flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dataFim}
                </div>
              )}
            </div>
          </div>

          {errors.dates && (
            <div className="form-error flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dates}
            </div>
          )}

          <div>
            <label htmlFor="formaPagamento" className="form-label flex items-center">
              Forma de Pagamento
            </label>
            <select
              id="formaPagamento"
              name="formaPagamento"
              className="form-input"
              value={formData.formaPagamento}
              onChange={handleChange}
            >
              <option value="CREDITO">CARTAO</option>
              <option value="DINHEIRO">PIX</option>
            </select>
          </div>

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
                        (new Date(formData.dataFim).getTime() - new Date(formData.dataInicio).getTime()) /
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
