import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import RentCarForm from '../../components/forms/RentCarForm';

const RentCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="text-center text-red-500">Invalid Car ID</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="mb-6">
            <Link to="/cars" className="inline-flex items-center text-primary-600 hover:text-primary-700">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to available cars
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Rent this Car</h1>

          <RentCarForm carId={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RentCar;
