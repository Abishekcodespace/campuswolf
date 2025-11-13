
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { APP_NAME } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Dummy password field
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const { login, setView } = useAuth();
  const { addNotification } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      addNotification('Successfully logged in!', 'success');
    } catch (error) {
      addNotification('Invalid credentials. Please check your details or create an account.', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: Role.STUDENT, label: 'Student' },
    { value: Role.SHOPKEEPER, label: 'Shopkeeper' },
    { value: Role.DELIVERY, label: 'Delivery Partner' },
    { value: Role.ADMIN, label: 'Admin' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 bg-grid-gray-700/[0.2]">
      <div className="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-lg">
        <button onClick={() => setView('landing')} className="text-sm text-gray-400 hover:text-white mb-6">
            &larr; Back to Home
        </button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">{APP_NAME} Login</h1>
        <p className="text-center text-gray-400 mb-8">Welcome! Select your role to continue.</p>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-6">
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
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                      role === option.value ? 'bg-sky-500 border-sky-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Login
            </Button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => setView('register')} type="button" className="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none">
                Create a new one
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
