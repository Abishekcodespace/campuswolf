
import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
    }, 4700);
    return () => clearTimeout(timer);
  }, [onClose]);

  const theme = {
    success: {
      bg: 'bg-green-500/10 border-green-500/50',
      icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
      text: 'text-green-300'
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/50',
      icon: <XCircleIcon className="w-6 h-6 text-red-400" />,
      text: 'text-red-300'
    },
    info: {
      bg: 'bg-sky-500/10 border-sky-500/50',
      icon: <InfoIcon className="w-6 h-6 text-sky-400" />,
      text: 'text-sky-300'
    },
  };

  const currentTheme = theme[type];

  return (
    <div className={`flex items-center p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm w-full transition-all duration-300 ${currentTheme.bg} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className="flex-shrink-0">{currentTheme.icon}</div>
      <div className={`ml-3 text-sm font-medium ${currentTheme.text}`}>{message}</div>
      <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-gray-300">
        <span className="sr-only">Dismiss</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Toast;
