import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Car, LogOut, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userDetails = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-primary-500">S.O.L.I.DEZ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-neutral-700 hover:text-primary-500 transition-colors">
                  Home
                </Link>
                
                {isAdmin() ? (
                  <>
                    <Link to="/admin/cars" className="text-neutral-700 hover:text-primary-500 transition-colors">
                      Manage Cars
                    </Link>
                    <Link to="/admin/rentals" className="text-neutral-700 hover:text-primary-500 transition-colors">
                      Manage Rentals
                    </Link>
                    <Link to="/admin/payments" className="text-neutral-700 hover:text-primary-500 transition-colors">
                      Payments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/cars" className="text-neutral-700 hover:text-primary-500 transition-colors">
                      Available Cars
                    </Link>
                    <Link to="/rentals" className="text-neutral-700 hover:text-primary-500 transition-colors">
                      My Rentals
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3">
                  <span className="text-neutral-700">
                    Hi, { userDetails?.nome }
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-accent-500 hover:text-accent-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-neutral-700 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-neutral-700 hover:text-primary-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-4 py-3 border-t border-neutral-200 md:hidden">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/" 
                    className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  {isAdmin() ? (
                    <>
                      <Link 
                        to="/admin/cars" 
                        className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manage Cars
                      </Link>
                      <Link 
                        to="/admin/rentals" 
                        className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manage Rentals
                      </Link>
                      <Link 
                        to="/admin/payments" 
                        className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Payments
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/cars" 
                        className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Available Cars
                      </Link>
                      <Link 
                        to="/rentals" 
                        className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Rentals
                      </Link>
                    </>
                  )}
                  
                  <div className="flex items-center space-x-2 py-2 border-t border-neutral-200 mt-2">
                    <UserIcon className="h-5 w-5 text-neutral-500" />
                    <span className="text-neutral-700">
                      {user?.name}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-accent-500 hover:text-accent-600 py-2"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-neutral-700 hover:text-primary-500 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;