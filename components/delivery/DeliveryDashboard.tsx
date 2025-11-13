
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../../types';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../shared/Header';
import { Spinner } from '../shared/Spinner';
import { Button } from '../shared/Button';
import { ORDER_STATUS_CLASSES } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';

const DeliveryCard: React.FC<{
    order: Order, 
    onAccept: (orderId: string) => void, 
    onUpdateStatus: (orderId: string, status: OrderStatus, paymentVerified?: boolean) => void,
    isMyOrder: boolean
}> = ({ order, onAccept, onUpdateStatus, isMyOrder }) => {
    const [paymentVerified, setPaymentVerified] = useState(order.paymentVerified || false);

    const handleUpdate = (status: OrderStatus) => {
        onUpdateStatus(order.id, status, paymentVerified);
    }
    
    const renderAction = () => {
        if (!isMyOrder) {
            return <Button onClick={() => onAccept(order.id)}>Accept Delivery</Button>;
        }
        switch (order.status) {
            case OrderStatus.PICKING_UP:
                return <Button onClick={() => handleUpdate(OrderStatus.OUT_FOR_DELIVERY)}>Mark as Picked Up</Button>;
            case OrderStatus.OUT_FOR_DELIVERY:
                return (
                    <div className="flex flex-col items-end gap-3">
                         <label className="flex items-center text-sm text-gray-300 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={paymentVerified}
                                onChange={(e) => setPaymentVerified(e.target.checked)}
                                className="w-4 h-4 mr-2 bg-gray-700 border-gray-600 rounded text-sky-500 focus:ring-sky-500"
                            />
                            Payment Screenshot Verified
                        </label>
                        <Button onClick={() => handleUpdate(OrderStatus.DELIVERED)} disabled={!paymentVerified}>Mark as Delivered</Button>
                    </div>
                );
            case OrderStatus.DELIVERED:
                return <p className="text-green-400 font-semibold">Completed</p>;
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Order for {order.studentName}</h3>
                    <p className="text-sm text-gray-400">From: {order.shopName}</p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status]}`}>
                    {order.status}
                </div>
            </div>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-white">Total: ₹{order.totalPrice}</p>
                {renderAction()}
            </div>
        </div>
    );
};


const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [view, setView] = useState<'available' | 'my_deliveries'>('available');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
        let fetchedOrders;
        if(view === 'available') {
            fetchedOrders = await api.getAvailableOrders();
        } else {
            fetchedOrders = await api.getDeliveryBoyOrders(user.id);
        }
        setOrders(fetchedOrders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        addNotification('Failed to fetch orders', 'error');
    } finally {
        setLoading(false);
    }
  }, [user, view, addNotification]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleAccept = async (orderId: string) => {
    if (!user) return;
    try {
        await api.acceptDelivery(orderId, user.id);
        addNotification('Delivery accepted!', 'success');
        fetchOrders();
    } catch (error) {
        addNotification('Failed to accept delivery', 'error');
    }
  };
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus, paymentVerified?: boolean) => {
    try {
        await api.updateOrderStatus(orderId, status, paymentVerified);
        addNotification('Order status updated!', 'success');
        fetchOrders();
    } catch(error) {
        addNotification('Failed to update status', 'error');
    }
  };

  return (
    <div>
      <Header title="Delivery Partner" />
      <nav className="bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2">
              <button onClick={() => setView('available')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'available' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                  Available for Pickup
              </button>
              <button onClick={() => setView('my_deliveries')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'my_deliveries' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                  My Deliveries
              </button>
          </div>
      </nav>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">
            {view === 'available' ? 'Available Orders' : 'My Active Deliveries'}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders available right now.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
                <DeliveryCard 
                    key={order.id} 
                    order={order} 
                    onAccept={handleAccept} 
                    onUpdateStatus={handleUpdateStatus}
                    isMyOrder={view === 'my_deliveries'}
                />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboard;
