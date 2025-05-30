import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../types';
import { Calendar, DollarSign } from 'lucide-react';

interface CarCardProps {
  car: Car;
  isAdmin?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleRentClick = () => {
    navigate(`/rent/${car.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="card group">
      {/* Car imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.imagem || 'https://via.placeholder.com/400x200?text=No+Imagem'}
          alt={`${car.marca} ${car.modelo}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            car.status === 'DISPONIVEL' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {car.status === 'DISPONIVEL' ? 'DISPONIVEL' : 'INDISPONIVEL'}
          </span>
        </div>
      </div>

      {/* Car details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{car.marca} {car.modelo}</h3>
        <p className="text-neutral-500 text-sm mb-3">{car.ano} • placa: {car.placa}</p>
        
        <div className="flex items-center text-primary-600 mb-4">
          <DollarSign className="h-5 w-5 mr-1" />
          <span className="font-semibold">{formatPrice(Number(car.precoPorDia))}</span>
          <span className="text-neutral-500 text-sm ml-1">per day</span>
        </div>

        {/* Admin buttons or rent button */}
        {isAdmin ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(car)}
              className="btn-outline flex-1 text-sm py-1.5"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(car.id)}
              className="btn-accent flex-1 text-sm py-1.5"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleRentClick}
            disabled={car.status !== 'DISPONIVEL'}
            className={`w-full btn-primary flex items-center justify-center ${
              car.status !== 'DISPONIVEL' && 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Rent Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCard;