
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../constants';
import { LogoutIcon, UserIcon } from './icons';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tighter">
              <span className="text-sky-400">{APP_NAME}</span> {title && `/ ${title}`}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-right">
              <UserIcon className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-white transition-colors">
              <LogoutIcon className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
