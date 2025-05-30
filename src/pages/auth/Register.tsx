import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Lock } from 'lucide-react';
import RegisterForm from '../../components/forms/RegisterForm';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-2xl px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-500 p-6 flex items-center justify-center">
              <div className="text-white text-center">
                <UserPlus className="h-12 w-12 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-primary-100">Join S.O.L.I.DEZ and start renting premium vehicles</p>
              </div>
            </div>
            
            <div className="p-6">
              <RegisterForm />
              
              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-neutral-500 text-sm">
              <Lock className="h-4 w-4 mr-1" />
              <span>Your information is securely encrypted</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;