import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { APP_NAME } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, setView } = useAuth();
  const { addNotification } = useNotification();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        addNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    setIsLoading(true);
    try {
      await register(name, email, password, Role.STUDENT, mobile);
      addNotification('Registration successful! Welcome.', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addNotification(`Registration failed: ${errorMessage}`, 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 bg-grid-gray-700/[0.2]">
      <div className="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Create a Student Account</h1>
        <p className="text-center text-gray-400 mb-8">Join {APP_NAME} to start ordering!</p>
        
        <form onSubmit={handleRegister}>
          <div className="space-y-6">
            <Input 
              label="Full Name"
              id="name"
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g., Alice" 
              required 
            />
            <Input 
              label="Email"
              id="email"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g., alice@campus.edu" 
              required 
            />
             <Input 
              label="Mobile Number"
              id="mobile"
              type="tel" 
              value={mobile} 
              onChange={e => setMobile(e.target.value)} 
              placeholder="e.g., 9876543210"
              required 
            />
            <Input 
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign Up
            </Button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <button onClick={() => setView('login')} type="button" className="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none">
                Login here
            </button>
        </p>
      </div>
    </div>
  );
};

export default Register;