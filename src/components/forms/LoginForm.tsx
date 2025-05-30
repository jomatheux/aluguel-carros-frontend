import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthService from '../../services/auth.service';
import { LoginCredentials } from '../../types';
import { toast } from 'react-hot-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Loading from '../ui/Loading';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    senha: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.senha) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const response = await AuthService.login(formData);

      if (response && response.user) {
        login(response.accessToken || '', response.user);
        toast.success('Login successful!');
        // Redirect based on role
        if (response.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/cars');
        }
      } else {
        // Show error message
        toast.error(response.message || 'Login failed');
        
        // Set field errors if available
        if (response.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(response.errors).forEach(([key, messages]) => {
            fieldErrors[key] = messages[0];
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email field */}
      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.email ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="your@email.com"
          />
        </div>
        {errors.email && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.password ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.password}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loading size="small" color="white" /> : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;