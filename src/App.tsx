import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Loading from './components/ui/Loading';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client pages
import CarsList from './pages/client/CarsList';
import RentCar from './pages/client/RentCar';
import RentalHistory from './pages/client/RentalHistory';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageRentals from './pages/admin/ManageRentals';
import PaymentsOverview from './pages/admin/PaymentsOverview';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading application..." />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Client routes */}
      <Route element={<ProtectedRoute allowedRoles={['CLIENTE']} />}>
        <Route path="/cars" element={<CarsList />} />
        <Route path="/rent/:id" element={<RentCar />} />
        <Route path="/rentals" element={<RentalHistory />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/cars" element={<ManageCars />} />
        <Route path="/admin/rentals" element={<ManageRentals />} />
        <Route path="/admin/payments" element={<PaymentsOverview />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
};

export default App;