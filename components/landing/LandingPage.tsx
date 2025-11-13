
import React from 'react';
import { Button } from '../shared/Button';
import { APP_NAME } from '../../constants';
import { MotorcycleIcon, PackageIcon, StoreIcon } from '../shared/icons';
import useOperatingHours from '../../hooks/useOperatingHours';

interface LandingPageProps {
  onLoginClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-center backdrop-blur-lg">
        <div className="flex justify-center items-center mb-4 text-sky-400">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const { isOpen, message } = useOperatingHours();
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
      
      <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter">{APP_NAME}</h1>
        <Button onClick={onLoginClick}>Login / Sign Up</Button>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-6 pt-24 pb-32 text-center">
          <div 
            className={`inline-block text-sm px-4 py-1 rounded-full mb-4 ${isOpen ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
          >
            {message}
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Your Campus Cravings, Delivered.
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
            From late-night snacks to essential supplies, {APP_NAME} connects you to local shops outside campus, delivered right to your hostel.
          </p>
          <Button onClick={onLoginClick} className="px-10 py-4 text-lg">
            Start Ordering
          </Button>
        </section>

        <section className="container mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<StoreIcon className="w-10 h-10" />}
                    title="All Your Local Favorites"
                    description="Browse a wide variety of shops and items, all in one place."
                />
                <FeatureCard 
                    icon={<PackageIcon className="w-10 h-10" />}
                    title="Simple & Transparent"
                    description="Place orders easily and get price quotes directly from the shopkeeper."
                />
                <FeatureCard 
                    icon={<MotorcycleIcon className="w-10 h-10" />}
                    title="Fast & Reliable Delivery"
                    description="Track your order in real-time as our delivery partners bring it to you."
                />
            </div>
        </section>
      </main>
      <footer className="relative z-10 text-center py-8 border-t border-gray-800 text-gray-500">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
