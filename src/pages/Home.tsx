import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Premium Car Rental Made Easy
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8">
                  Experience the freedom of the open road with our premium fleet of vehicles.
                  Book your perfect ride in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/cars')}
                    className="bg-white text-primary-700 hover:bg-neutral-100 btn"
                  >
                    Browse Cars
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-primary-800 border border-white text-white hover:bg-primary-900 btn"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://static.ndmais.com.br/2024/09/carros-luxuosos-em-sc-1.jpg" 
                  alt="Luxury car" 
                  className="rounded-lg shadow-2x1 ml-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose S.O.L.I.DEZ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-3 rounded-full mb-4">
                  <Car className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Vehicles</h3>
                <p className="text-neutral-600">
                  Our fleet consists of only the finest, well-maintained vehicles to ensure your comfort and safety.
                </p>
              </div>
              
              <div className="bg-neutral-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast & Easy Booking</h3>
                <p className="text-neutral-600">
                  Book your perfect car in minutes with our streamlined rental process. No hidden fees or complications.
                </p>
              </div>
              
              <div className="bg-neutral-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center bg-primary-100 text-primary-600 p-3 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
                <p className="text-neutral-600">
                  All our rentals include comprehensive insurance coverage and 24/7 roadside assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-primary-500 text-white h-12 w-12 rounded-full text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-neutral-600">
                  Sign up with your details and driver's license information.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-primary-500 text-white h-12 w-12 rounded-full text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Cars</h3>
                <p className="text-neutral-600">
                  Explore our wide range of available vehicles.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-primary-500 text-white h-12 w-12 rounded-full text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
                <p className="text-neutral-600">
                  Select your dates and complete the secure payment process.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-primary-500 text-white h-12 w-12 rounded-full text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
                <p className="text-neutral-600">
                  Pick up your car and enjoy your journey with confidence.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/register')}
                className="btn-primary"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-700 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust S.O.L.I.DEZ for their car rental needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/cars')}
                className="bg-white text-primary-700 hover:bg-neutral-100 btn"
              >
                <Car className="h-5 w-5 mr-2" />
                Browse Cars
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-primary-800 border border-white text-white hover:bg-primary-900 btn"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Sign Up Now
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;