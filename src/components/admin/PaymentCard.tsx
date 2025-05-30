import React from 'react';
import { Rental } from '../../types';
import { DollarSign, Calendar, User, CreditCard } from 'lucide-react';

interface PaymentCardProps {
  rental: Rental;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ rental }) => {
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

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
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

  // Map rental status to payment status
  const getPaymentStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Paid';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center mb-1">
              <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-semibold">Payment #{rental.id.slice(0, 8)}</h3>
            </div>
            <p className="text-neutral-500 text-sm">
              For {rental.car.marca} {rental.car.modelo} ({rental.car.placa})
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(rental.status)}`}>
            {getPaymentStatus(rental.status)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start">
            <User className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
            <div>
              <div className="text-sm text-neutral-500">Customer</div>
              <div>{rental.user.name}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
            <div>
              <div className="text-sm text-neutral-500">Rental Period</div>
              <div>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
            <div>
              <div className="text-sm text-neutral-500">Amount</div>
              <div className="font-semibold">{formatCurrency(rental.totalAmount)}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">
              Transaction ID: <span className="font-mono">{rental.id}</span>
            </span>
            <span className="text-sm text-neutral-500">
              {formatDate(rental.startDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;