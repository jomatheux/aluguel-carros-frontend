import React, { useState, useEffect } from 'react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import PaymentCard from '../../components/admin/PaymentCard';
import RentalFilter from '../../components/admin/RentalFilter';
import Loading from '../../components/ui/Loading';
import { Rental } from '../../types';
import { RentalService } from '../../services/rental.service';
import { toast } from 'react-hot-toast';
import { DollarSign, CreditCard } from 'lucide-react';

const PaymentsOverview: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    filterRentals();
  }, [statusFilter, rentals]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await RentalService.getAllRentals();
      if (response.success && response.data) {
        // Sort rentals by date (newest first)
        const sortedRentals = response.data.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setRentals(sortedRentals);
        setFilteredRentals(sortedRentals);
      } else {
        toast.error('Failed to load payment data');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterRentals = () => {
    if (statusFilter === 'all') {
      setFilteredRentals(rentals);
      return;
    }

    const filtered = rentals.filter((rental) => rental.status === statusFilter);
    setFilteredRentals(filtered);
  };

  // Calculate total amounts
  const totalAmount = filteredRentals.reduce((sum, rental) => sum + rental.totalAmount, 0);
  
  // Calculate status-specific amounts
  const paidAmount = filteredRentals
    .filter(r => ['active', 'completed'].includes(r.status))
    .reduce((sum, rental) => sum + rental.totalAmount, 0);
  
  const pendingAmount = filteredRentals
    .filter(r => r.status === 'pending')
    .reduce((sum, rental) => sum + rental.totalAmount, 0);
  
  const cancelledAmount = filteredRentals
    .filter(r => r.status === 'cancelled')
    .reduce((sum, rental) => sum + rental.totalAmount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Payments Overview</h1>
            <p className="text-neutral-500">Track and manage all rental payments</p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Total Value</p>
                  <h3 className="text-xl font-bold">{formatCurrency(totalAmount)}</h3>
                  <p className="text-xs text-neutral-500">
                    All rentals
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Paid</p>
                  <h3 className="text-xl font-bold">{formatCurrency(paidAmount)}</h3>
                  <p className="text-xs text-neutral-500">
                    Active + Completed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3 mr-4">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Pending</p>
                  <h3 className="text-xl font-bold">{formatCurrency(pendingAmount)}</h3>
                  <p className="text-xs text-neutral-500">
                    Awaiting approval
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3 mr-4">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Cancelled</p>
                  <h3 className="text-xl font-bold">{formatCurrency(cancelledAmount)}</h3>
                  <p className="text-xs text-neutral-500">
                    Lost revenue
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <RentalFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          {loading ? (
            <Loading text="Loading payment data..." />
          ) : filteredRentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No payments found</h3>
              <p className="text-neutral-500">
                {statusFilter !== 'all'
                  ? `No payments with status "${statusFilter}" were found.`
                  : 'There are no payments in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRentals.map((rental) => (
                <PaymentCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentsOverview;