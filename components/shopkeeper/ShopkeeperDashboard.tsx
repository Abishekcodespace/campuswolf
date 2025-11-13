
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../shared/Header';
import { Spinner } from '../shared/Spinner';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { ORDER_STATUS_CLASSES } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';

const OrderRequestCard: React.FC<{order: Order, onConfirm: (orderId: string, price: number) => void, onReject: (orderId: string) => void}> = ({ order, onConfirm, onReject }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleConfirm = () => {
        if(totalPrice > 0) {
            onConfirm(order.id, totalPrice);
            setIsConfirming(false);
        }
    }
    
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Order from {order.studentName}</h3>
                    <p className="text-sm text-gray-400">Order ID: {order.id}</p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status]}`}>
                    {order.status}
                </div>
            </div>
            <ul className="text-gray-300 list-disc list-inside mb-4">
                {order.items.map(item => <li key={item.productId}>{item.name} x {item.quantity}</li>)}
            </ul>

            {order.status === OrderStatus.PENDING_SHOP_CONFIRMATION && (
                <div className="flex space-x-4">
                    <Button onClick={() => setIsConfirming(true)} variant="primary">Confirm Order</Button>
                    <Button onClick={() => onReject(order.id)} variant="danger">Reject</Button>
                </div>
            )}

            <Modal isOpen={isConfirming} onClose={() => setIsConfirming(false)} title="Confirm Order & Set Price">
                <div className="space-y-4">
                    <p className="text-gray-400">Please enter the final price for this order, including any delivery charges.</p>
                    <Input 
                        label="Total Price (₹)"
                        type="number"
                        value={totalPrice}
                        onChange={(e) => setTotalPrice(Number(e.target.value))}
                        placeholder="e.g., 250"
                    />
                    <Button onClick={handleConfirm} className="w-full">Confirm & Send to Delivery</Button>
                </div>
            </Modal>
        </div>
    );
}

const ShopkeeperDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    try {
        const fetchedOrders = await api.getShopkeeperOrders(user.id);
        setOrders(fetchedOrders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        addNotification('Failed to fetch orders', 'error');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll for updates
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleConfirmOrder = async (orderId: string, price: number) => {
    try {
        await api.confirmOrder(orderId, price);
        addNotification('Order confirmed!', 'success');
        fetchOrders(); // Refresh list
    } catch(error) {
        addNotification('Failed to confirm order', 'error');
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
        await api.rejectOrder(orderId);
        addNotification('Order rejected.', 'info');
        fetchOrders(); // Refresh list
    } catch(error) {
        addNotification('Failed to reject order', 'error');
    }
  }

  return (
    <div>
      <Header title="Shopkeeper" />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">Incoming Orders</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No new orders at the moment.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
                <OrderRequestCard key={order.id} order={order} onConfirm={handleConfirmOrder} onReject={handleRejectOrder}/>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopkeeperDashboard;
