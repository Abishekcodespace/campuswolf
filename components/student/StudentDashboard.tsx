
import React, { useState } from 'react';
import { Header } from '../shared/Header';
import ShopList from './ShopList';
import ShopMenu from './ShopMenu';
import OrderTracker from './OrderTracker';
import { CartItem } from '../../types';
import { ShoppingCartIcon, PackageIcon } from '../shared/icons';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import useOperatingHours from '../../hooks/useOperatingHours';

type StudentView = 'shops' | 'menu' | 'tracking';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const { isOpen, message } = useOperatingHours();
    const [view, setView] = useState<StudentView>('shops');
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    const handleSelectShop = (shopId: string) => {
        setSelectedShopId(shopId);
        setView('menu');
    };
    
    const addToCart = (item: CartItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.productId === item.productId);
            if (existingItem) {
                return prevCart.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        addNotification(`${item.name} added to cart!`, 'info');
    };

    const placeOrder = async () => {
        if (!user || !selectedShopId || cart.length === 0) return;
        
        try {
            await api.placeOrder(user.id, selectedShopId, cart);
            addNotification('Order placed successfully!', 'success');
            setCart([]);
            setView('tracking');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            addNotification(`Order failed: ${errorMessage}`, 'error');
        }
    };

    const renderView = () => {
        switch (view) {
            case 'shops':
                return <ShopList onSelectShop={handleSelectShop} />;
            case 'menu':
                if (selectedShopId) {
                    return <ShopMenu shopId={selectedShopId} addToCart={addToCart} />;
                }
                return <ShopList onSelectShop={handleSelectShop} />; // Fallback
            case 'tracking':
                return <OrderTracker />;
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Student" />
            
            {!isOpen && (
                <div className="bg-red-900 text-center py-2 text-white font-semibold">
                    {message}
                </div>
            )}
            
            <nav className="bg-gray-900 border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button onClick={() => setView('shops')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'shops' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            Browse Shops
                        </button>
                        <button onClick={() => setView('tracking')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'tracking' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            My Orders
                        </button>
                    </div>
                    {cart.length > 0 && (
                        <div className="flex items-center space-x-2 text-sky-400">
                            <ShoppingCartIcon className="w-5 h-5"/>
                            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                {renderView()}
            </main>

            {cart.length > 0 && view === 'menu' && (
                <footer className="sticky bottom-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <p className="text-lg font-semibold">Ready to order?</p>
                        <button 
                            onClick={placeOrder}
                            disabled={!isOpen}
                            className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Place Order ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default StudentDashboard;
