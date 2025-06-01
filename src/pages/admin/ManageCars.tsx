import React, { useState, useEffect } from 'react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import CarCard from '../../components/cars/CarCard';
import CarForm from '../../components/admin/CarForm';
import Loading from '../../components/ui/Loading';
import { Car, CreateCarData } from '../../types';
import { CarService } from '../../services/car.service';
import { toast } from 'react-hot-toast';
import { PlusCircle, Search, Car as CarIcon } from 'lucide-react';

const ManageCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
        car.placa.toLowerCase().includes(query) ||
        car.ano.toString().includes(query) ||
        car.status.toLowerCase().includes(query)
    );
    setFilteredCars(filtered);
  }, [searchQuery, cars]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await CarService.getAllCars();
      if (response && Array.isArray(response)) {
        setCars(response || []);
        setFilteredCars(response);
      } else {
        toast.error('Failed to load cars');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setEditingCar(undefined);
    setShowForm(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleDeleteCar = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      const response = await CarService.deleteCar(id);
      console.log('Delete response:', response);
      if (response) {
        setCars((prevCars) => prevCars.filter((car) => car.id !== id));
        toast.success('Car deleted successfully');
      } else {
        toast.error('Failed to delete car');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleSubmit = async (data: CreateCarData) => {
    setSubmitting(true);
    try {
      if (editingCar) {
        // Update existing car
        const response = await CarService.updateCar(editingCar.id, data);
        console.log('Update response:', response);
        if (response) {
          setCars((prevCars) =>
            prevCars.map((car) =>
              car.id === editingCar.id ? response.data : car
            )
          );
          toast.success('Car updated successfully');
          setShowForm(false);
        } else {
          toast.error('Failed to update car');
        }
      } else {
        // Add new car
        const response = await CarService.createCar(data);
        if (response) {
          setCars((prevCars) => [...prevCars, response.data!]);
          toast.success('Car added successfully');
          setShowForm(false);
        } else {
          toast.error('Failed to add car');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCar(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Manage Cars</h1>
              <p className="text-neutral-500">Add, edit, or remove cars from the fleet</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
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
              
              <button
                onClick={handleAddCar}
                className="btn-primary flex items-center justify-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Car
              </button>
            </div>
          </div>
          
          {showForm && (
            <div className="mb-8">
              <CarForm
                car={editingCar}
                onSubmit={handleSubmit}
                onCancel={cancelForm}
                isSubmitting={submitting}
              />
            </div>
          )}
          
          {loading ? (
            <Loading text="Loading cars..." />
          ) : filteredCars.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CarIcon className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No cars found</h3>
              <p className="text-neutral-500 mb-4">
                {searchQuery
                  ? `No cars matching "${searchQuery}" were found.`
                  : 'There are no cars in the system yet.'}
              </p>
              {!searchQuery && (
                <button onClick={handleAddCar} className="btn-primary">
                  Add Your First Car
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isAdmin={true}
                  onEdit={() => handleEditCar(car)}
                  onDelete={() => handleDeleteCar(car.id)}
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

export default ManageCars;