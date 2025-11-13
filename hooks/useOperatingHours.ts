
import { useState, useEffect } from 'react';

const useOperatingHours = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      const openHour = 16; // 4 PM
      const closeHour = 23; // 11 PM

      if (currentHour >= openHour && currentHour < closeHour) {
        setIsOpen(true);
        setMessage('We are open! Place your orders now.');
      } else {
        setIsOpen(false);
        setMessage('Service is closed. We are open daily from 4 PM to 11 PM.');
      }
    };

    checkHours();
    const interval = setInterval(checkHours, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { isOpen, message };
};

export default useOperatingHours;
