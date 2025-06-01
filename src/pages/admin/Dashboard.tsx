import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import { Car, Rental } from '../../types';
import { CarService } from '../../services/car.service';
import { RentalService } from '../../services/rental.service';
import { toast } from 'react-hot-toast';
import { Car as CarIcon, Users, ClipboardCheck, DollarSign, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cars and rentals in parallel
        const [carsResponse, rentalsResponse] = await Promise.all([
          CarService.getAllCars(),
          RentalService.getAllRentals()
        ]);

        if (carsResponse && carsResponse.data) {
          setCars(carsResponse.data);
        } else {
          toast.error('Failed to load cars data');
        }

        if (rentalsResponse && rentalsResponse.data) {
          setRentals(rentalsResponse.data);
        } else {
          toast.error('Failed to load rentals data');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalCars = cars.length;
  const availableCars = cars.filter(car => car.status === 'DISPONIVEL').length;
  const activeRentals = rentals.filter(rental => rental.status === 'active').length;
  const pendingRentals = rentals.filter(rental => rental.status === 'pending').length;
  const completedRentals = rentals.filter(rental => rental.status === 'completed').length;
  
  // Calculate total revenue from completed rentals
  const totalRevenue = rentals
    .filter(rental => rental.status === 'completed')
    .reduce((total, rental) => total + rental.totalAmount, 0);

  // Get recent rentals (last 5)
  const recentRentals = [...rentals]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Admin Dashboard</h1>
          
          {loading ? (
            <Loading text="Loading dashboard data..." />
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Cars */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-full p-3 mr-4">
                      <CarIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Total Cars</p>
                      <h3 className="text-2xl font-bold">{totalCars}</h3>
                      <p className="text-xs text-neutral-500">
                        {availableCars} available
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/cars')}
                    className="mt-4 w-full text-center text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    View all cars
                  </button>
                </div>

                {/* Active Rentals */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Active Rentals</p>
                      <h3 className="text-2xl font-bold">{activeRentals}</h3>
                      <p className="text-xs text-neutral-500">
                        {pendingRentals} pending approval
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/rentals')}
                    className="mt-4 w-full text-center text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    Manage rentals
                  </button>
                </div>

                {/* Completed Rentals */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-3 mr-4">
                      <ClipboardCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Completed Rentals</p>
                      <h3 className="text-2xl font-bold">{completedRentals}</h3>
                      <p className="text-xs text-neutral-500">
                        All time
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/rentals')}
                    className="mt-4 w-full text-center text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    View history
                  </button>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-secondary-100 rounded-full p-3 mr-4">
                      <DollarSign className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Total Revenue</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
                      <p className="text-xs text-neutral-500">
                        From completed rentals
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/payments')}
                    className="mt-4 w-full text-center text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    View payments
                  </button>
                </div>
              </div>

              {/* Recent Rentals */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Rentals</h2>
                  <button 
                    onClick={() => navigate('/admin/rentals')}
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    View all
                  </button>
                </div>
                
                {recentRentals.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">No rentals to display</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Car
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {recentRentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-neutral-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary-600" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-neutral-900">
                                    {rental.user.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-neutral-900">
                                {rental.car.marca} {rental.car.modelo}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {rental.car.placa}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-neutral-900">
                                {formatDate(rental.startDate)}
                              </div>
                              <div className="text-xs text-neutral-500">
                                to {formatDate(rental.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(rental.totalAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                rental.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : rental.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : rental.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Car Management</h3>
                  <p className="text-neutral-600 mb-4">
                    Add new cars to the fleet, update information, or manage vehicle status.
                  </p>
                  <button 
                    onClick={() => navigate('/admin/cars')}
                    className="btn-primary w-full"
                  >
                    Manage Cars
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Rental Management</h3>
                  <p className="text-neutral-600 mb-4">
                    Review, approve, or update the status of customer rental requests.
                  </p>
                  <button 
                    onClick={() => navigate('/admin/rentals')}
                    className="btn-primary w-full"
                  >
                    Manage Rentals
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Overview</h3>
                  <p className="text-neutral-600 mb-4">
                    View rental payment history, revenue statistics, and financial reports.
                  </p>
                  <button 
                    onClick={() => navigate('/admin/payments')}
                    className="btn-primary w-full"
                  >
                    View Payments
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;