import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import CarCard from '../../components/cars/CarCard';
import Loading from '../../components/ui/Loading';
import { Car } from '../../types';
import { CarService } from '../../services/car.service';
import { toast } from 'react-hot-toast';

const CarsList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await CarService.getAllCars();
        console.log('Fetched cars:', response);
        if (response && Array.isArray(response)) {
          setCars(response || []);
          setFilteredCars(response || []);
        } else {
          toast.error('Failed to load available cars');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCars(cars);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = cars.filter(
      (car) =>
        car.marca.toLowerCase().includes(query) ||
        car.modelo.toLowerCase().includes(query) ||
        car.ano.toString().includes(query)
    );
    setFilteredCars(filtered);
  }, [searchQuery, cars]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Available Cars</h1>
              <p className="text-neutral-500">Browse our collection of premium vehicles</p>
            </div>
            
            <div className="mt-4 md:mt-0 relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search cars..."
                className="form-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <Loading text="Loading available cars..." />
          ) : filteredCars.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No cars available</h3>
              <p className="text-neutral-500">
                {searchQuery
                  ? `No cars matching "${searchQuery}" were found.`
                  : 'There are no cars available for rent at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarsList;