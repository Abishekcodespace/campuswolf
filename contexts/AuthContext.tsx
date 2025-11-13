import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import * as api from '../services/api';

type AuthView = 'landing' | 'login' | 'register';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  view: AuthView;
  setView: (view: AuthView) => void;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role, mobile: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AuthView>('landing');

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to check auth status", error);
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string, role: Role) => {
    const { user: loggedInUser, token } = await api.login(email, password, role);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
    setUser(loggedInUser);
  };
  
  const register = async (name: string, email: string, password: string, role: Role, mobile: string) => {
    const { user: registeredUser, token } = await api.register(name, email, password, role, mobile);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    localStorage.setItem('token', token);
    setUser(registeredUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setView('landing');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
    view,
    setView
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};