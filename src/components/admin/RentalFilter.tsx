import React from 'react';
import { Filter } from 'lucide-react';

interface RentalFilterProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const RentalFilter: React.FC<RentalFilterProps> = ({
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center mr-4">
        <Filter className="h-5 w-5 text-neutral-500 mr-2" />
        <span className="text-neutral-700 font-medium">Filter by status:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === 'all'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onStatusFilterChange('PENDENTE')}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === 'PENDENTE'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onStatusFilterChange('ATIVA')}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === 'ATIVA'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onStatusFilterChange('CANCELADO')}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === 'CANCELADO'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          Cancelled
        </button>
        <button
          onClick={() => onStatusFilterChange('FINALIZADO')}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === 'FINALIZADO'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
          }`}
        >
          Finalizado
        </button>
      </div>
    </div>
  );
};

export default RentalFilter;