
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Role } from './types';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import ShopkeeperDashboard from './components/shopkeeper/ShopkeeperDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LandingPage from './components/landing/LandingPage';
import { Spinner } from './components/shared/Spinner';

const App: React.FC = () => {
  const { user, isAuthenticated, loading, view, setView } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  const renderDashboard = () => {
    if (!user) return <Login />;
    switch (user.role) {
      case Role.STUDENT:
        return <StudentDashboard />;
      case Role.SHOPKEEPER:
        return <ShopkeeperDashboard />;
      case Role.DELIVERY:
        return <DeliveryDashboard />;
      case Role.ADMIN:
        return <AdminDashboard />;
      default:
        return <Login />;
    }
  };

  if (!isAuthenticated) {
    if (view === 'login') {
      return <Login />;
    }
    if (view === 'register') {
      return <Register />;
    }
    return <LandingPage onLoginClick={() => setView('login')} />;
  }
  
  return (
    <div className="bg-black text-gray-100 min-h-screen">
      {renderDashboard()}
    </div>
  );
};

export default App;
