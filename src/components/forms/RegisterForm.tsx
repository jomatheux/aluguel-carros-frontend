import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthService from '../../services/auth.service';
import { RegisterData } from '../../types';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, FileText, AlertCircle } from 'lucide-react';
import Loading from '../ui/Loading';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    cnh: '',
    dataNascimento: '',
    role: 'CLIENTE', // Default to CLIENTE
    telefone: '', // Optional field
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      
      // Clear confirm password error when user types
      if (errors.confirmPassword) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error when user types
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // nome validation
    if (!formData.nome.trim()) {
      newErrors.nome = 'nome is required';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'nome must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.senha) {
      newErrors.password = 'Password is required';
    } else if (formData.senha.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.senha !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // CPF validation (simple format check)
    if (!formData.cpf) {
      newErrors.cpf = 'CPF is required';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/[.-]/g, ''))) {
      newErrors.cpf = 'CPF must be 11 digits';
    }
    
    // CNH validation (simple format check)
    if (!formData.cnh) {
      newErrors.cnh = 'CNH is required';
    } else if (!/^\d{9,11}$/.test(formData.cnh.replace(/[.-]/g, ''))) {
      newErrors.cnh = 'CNH must be 9-11 digits';
    }

    // Data de Nascimento validation
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de Nascimento is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const response = await AuthService.register(formData);
      
      if (response.success && response.data) {
        login(response.data.accessToken, response.data.user);
        toast.success('Registration successful!');
        
        // Redirect based on role
        if (response.data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/cars');
        }
      } else {
        // Show error message
        toast.error(response.message || 'Registration failed');
        
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* nome field */}
      <div>
        <label htmlFor="nome" className="form-label">
          Full nome
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.nome ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="John Doe"
          />
        </div>
        {errors.nome && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.nome}
          </div>
        )}
      </div>

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

      {/* Confirm Password field */}
      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.confirmPassword ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* CPF field */}
      <div>
        <label htmlFor="cpf" className="form-label">
          CPF
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.cpf ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="123.456.789-00"
          />
        </div>
        {errors.cpf && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.cpf}
          </div>
        )}
      </div>

      {/* CNH field */}
      <div>
        <label htmlFor="cnh" className="form-label">
          CNH (Driver's License)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="cnh"
            name="cnh"
            type="text"
            value={formData.cnh}
            onChange={handleChange}
            className={`form-input pl-10 ${errors.cnh ? 'border-accent-500 focus:ring-accent-500' : ''}`}
            placeholder="12345678900"
          />
        </div>
        {errors.cnh && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.cnh}
          </div>
        )}
      </div>

      {/* Role field */}
      <div>
        <label htmlFor="role" className="form-label">
          Account Type
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input"
        >
          <option value="CLIENTE">Client</option>
          <option value="ADMIN">Administrator</option>
        </select>
        {errors.role && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.role}
          </div>
        )}
      </div>

      {/* Data nascimento field */}
      <div>
        <label htmlFor="dataNascimento" className="form-label">
          Data de Nascimento
        </label>
        <input
          id="dataNascimento"
          name="dataNascimento"
          type="date"
          value={formData.dataNascimento}
          onChange={handleChange}
          className={`form-input ${errors.dataNascimento ? 'border-accent-500 focus:ring-accent-500' : ''}`}
        />
        {errors.dataNascimento && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.dataNascimento}
          </div>
        )}
      </div>

      {/* Telefone field */}
      <div>
        <label htmlFor="telefone" className="form-label">
          Telefone
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            value={formData.telefone || ''}
            onChange={handleChange}
            className={`form-input pl-10 ${
              errors.telefone ? 'border-accent-500 focus:ring-accent-500' : ''
            }`}
            placeholder="(ddd) 12345-6789"
          />
        </div>
        {errors.telefone && (
          <div className="form-error flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.telefone}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loading size="small" color="white" /> : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
