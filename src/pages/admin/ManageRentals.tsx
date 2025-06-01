import React, { useState, useEffect } from 'react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import RentalCard from '../../components/rentals/RentalCard';
import RentalFilter from '../../components/admin/RentalFilter';
import Loading from '../../components/ui/Loading';
import { Rental } from '../../types';
import { RentalService } from '../../services/rental.service';
import { toast } from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';

const ManageRentals: React.FC = () => {
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
      if (response && response.data) {
        // Sort rentals by date (newest first)
        const sortedRentals = response.data.sort((a: Rental, b: Rental) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setRentals(sortedRentals);
        setFilteredRentals(sortedRentals);
      } else {
        toast.error('Failed to load rentals');
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

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'active' | 'completed' | 'cancelled') => {
    try {
      const response = await RentalService.updateRentalStatus(id, { status: newStatus });
      if (response) {
        // Update the rental in the state
        setRentals((prevRentals) =>
          prevRentals.map((rental) =>
            rental.id === id ? { ...rental, status: newStatus } : rental
          )
        );
        toast.success(`Rental status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update rental status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Manage Rentals</h1>
            <p className="text-neutral-500">View and manage all car rentals</p>
          </div>
          
          <RentalFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          {loading ? (
            <Loading text="Loading rentals..." />
          ) : filteredRentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No rentals found</h3>
              <p className="text-neutral-500">
                {statusFilter !== 'all'
                  ? `No rentals with status "${statusFilter}" were found.`
                  : 'There are no rentals in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRentals.map((rental) => (
                <RentalCard
                  key={rental.id}
                  rental={rental}
                  isAdmin={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageRentals;