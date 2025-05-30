import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Lock } from 'lucide-react';
import LoginForm from '../../components/forms/LoginForm';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-500 p-6 flex items-center justify-center">
              <div className="text-white text-center">
                <Car className="h-12 w-12 mx-auto mb-2" />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-primary-100">Log in to your S.O.L.I.DEZ account</p>
              </div>
            </div>
            
            <div className="p-6">
              <LoginForm />
              
              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Register now
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

export default Login;