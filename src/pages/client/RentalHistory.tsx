import React, { useState, useEffect } from 'react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import RentalCard from '../../components/rentals/RentalCard';
import Loading from '../../components/ui/Loading';
import { Rental } from '../../types';
import { RentalService } from '../../services/rental.service';
import { toast } from 'react-hot-toast';
import { ClipboardList, AlertTriangle } from 'lucide-react';

const RentalHistory: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const rentals = await RentalService.getUserRentals();
        console.log('Rentals recebidos:', rentals);

        if (Array.isArray(rentals)) {
          const sortedRentals = rentals.sort((a: Rental, b: Rental) =>
            new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
          );
          setRentals(sortedRentals);
        } else {
          toast.error('Failed to load rental history: dados inválidos');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);


  const handleCancelRental = async (id: string, carId: string) => {
    try {
      const response = await RentalService.cancelRental(id, carId);
      if (response) {
        setRentals((prevRentals) =>
          prevRentals.map((rental) =>
            rental.id === id ? { ...rental, status: 'CANCELADO' } : rental
          )
        );
        toast.success('Rental CANCELADO successfully');
      } else {
        toast.error('Failed to cancel rental');
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Rental History</h1>
            <p className="text-neutral-500">View and manage your current and past rentals</p>
          </div>

          {loading ? (
            <Loading text="Loading your rentals..." />
          ) : rentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No rentals found</h3>
              <p className="text-neutral-500 mb-4">
                You haven't rented any cars yet. Start by browsing our available vehicles.
              </p>
              <a href="/cars" className="btn-primary">
                Browse Available Cars
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ATIVA rentals section */}
              {rentals.some(rental => ['PENDENTE', 'ATIVA'].includes(rental.status)) && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">ATIVA Rentals</h2>
                  <div className="space-y-4">
                    {rentals
                      .filter(rental => ['PENDENTE', 'ATIVA'].includes(rental.status))
                      .map(rental => (
                        <div key={rental.id} className="relative">
                          {rental.status === 'ATIVA' && (
                            <div className="absolute right-4 top-4 z-10">
                              <button
                                onClick={() => handleCancelRental(rental.id, rental.carro.id)}
                                className="flex items-center text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Cancel
                              </button>
                            </div>
                          )}
                          <RentalCard rental={rental} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Past rentals section */}
              {rentals.some(rental => ['FINALIZADO', 'CANCELADO'].includes(rental.status)) && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Past Rentals</h2>
                  <div className="space-y-4">
                    {rentals
                      .filter(rental => ['FINALIZADO', 'CANCELADO'].includes(rental.status))
                      .map(rental => (
                        <RentalCard key={rental.id} rental={rental} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RentalHistory;