import React from 'react';
import { Rental } from '../../types';
import { Calendar, DollarSign, Clock, Car as CarIcon, Check, X } from 'lucide-react';

interface RentalCardProps {
  rental: Rental;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: 'pending' | 'active' | 'completed' | 'cancelled') => void;
}

const RentalCard: React.FC<RentalCardProps> = ({
  rental,
  isAdmin = false,
  onStatusChange
}) => {
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Imagem do carro */}
      <img
        src={rental.car.imagem || 'https://placehold.co/300x200?text=No+Image'}
        alt={`${rental.car.marca} ${rental.car.modelo}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/300x200?text=No+Image';
        }}
      />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{rental.car.marca} {rental.car.modelo}</h3>
            <p className="text-neutral-500 text-sm">Placa: {rental.car.placa}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary-500 mr-2" />
            <div>
              <div className="text-sm text-neutral-500">Rental Period</div>
              <div>{formatDate(rental.dataInicio)} - {formatDate(rental.dataFim)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
            <div>
              <div className="text-sm text-neutral-500">Total Amount</div>
              <div className="font-semibold">{formatCurrency(rental.totalAmount)}</div>
            </div>
          </div>
        </div>

        {/* Admin options */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-neutral-500 mr-2" />
                <span className="text-sm">
                  Rented by: <span className="font-medium">{rental.user.name}</span>
                </span>
              </div>
              <div className="flex space-x-2">
                {rental.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onStatusChange && onStatusChange(rental.id, 'active')}
                      className="btn-primary text-xs py-1 px-2 flex items-center"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusChange && onStatusChange(rental.id, 'cancelled')}
                      className="btn-accent text-xs py-1 px-2 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </button>
                  </>
                )}
                {rental.status === 'active' && (
                  <button
                    onClick={() => onStatusChange && onStatusChange(rental.id, 'completed')}
                    className="btn-secondary text-xs py-1 px-2 flex items-center"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalCard;