
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../shared/Spinner';
import { ORDER_STATUS_CLASSES } from '../../constants';
import { Modal } from '../shared/Modal';

const OrderCard: React.FC<{ order: Order, onShowQr: (qrCodeUrl: string) => void }> = ({ order, onShowQr }) => {
    const [shopQrCodeUrl, setShopQrCodeUrl] = useState('');

    useEffect(() => {
        const fetchShopQr = async () => {
            try {
                const { shop } = await api.getShopDetails(order.shopId);
                setShopQrCodeUrl(shop.qrCodeUrl);
            } catch (error) {
                console.error("Could not fetch shop details", error);
            }
        };
        fetchShopQr();
    }, [order.shopId]);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{order.shopName}</h3>
                    <p className="text-sm text-gray-400">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-400">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status]}`}>
                    {order.status}
                </div>
            </div>
            <div className="mb-4">
                <ul className="text-sm text-gray-300 list-disc list-inside">
                    {order.items.map(item => <li key={item.productId}>{item.name} x {item.quantity}</li>)}
                </ul>
            </div>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                <div>
                    <p className="text-gray-400 text-sm">Total Price</p>
                    <p className="text-2xl font-bold text-white">{order.totalPrice ? `₹${order.totalPrice}` : 'Awaiting confirmation'}</p>
                </div>
                 {order.status !== OrderStatus.PENDING_SHOP_CONFIRMATION && order.status !== OrderStatus.REJECTED_BY_SHOP && shopQrCodeUrl && (
                     <button onClick={() => onShowQr(shopQrCodeUrl)} className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
                         Pay with QR
                     </button>
                 )}
            </div>
             {order.deliveryBoyName && (
                <div className="border-t border-gray-800 mt-4 pt-4 text-sm">
                    <p className="text-gray-400">Delivery Partner: <span className="font-semibold text-white">{order.deliveryBoyName}</span></p>
                </div>
            )}
        </div>
    );
};

const OrderTracker: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await api.getStudentOrders(user.id);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll for updates every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  const handleShowQr = (qrCodeUrl: string) => {
    setCurrentQrCode(qrCodeUrl);
    setQrModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-10">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onShowQr={handleShowQr}/>
          ))}
        </div>
      )}
      <Modal isOpen={isQrModalOpen} onClose={() => setQrModalOpen(false)} title="Scan to Pay Shop">
          <div className="p-4 flex flex-col items-center">
            <img src={currentQrCode} alt="Shop QR Code" className="w-64 h-64 rounded-lg mb-4"/>
            <p className="text-gray-400 text-center">Scan this QR code with your payment app. The delivery partner will verify the payment screenshot upon arrival.</p>
          </div>
      </Modal>
    </div>
  );
};

export default OrderTracker;
