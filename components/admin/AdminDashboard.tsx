import React, { useState, useEffect, useCallback } from 'react';
import { Order, User, Role } from '../../types';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../shared/Header';
import { Spinner } from '../shared/Spinner';
import { ORDER_STATUS_CLASSES } from '../../constants';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { useNotification } from '../../contexts/NotificationContext';

type AdminView = 'dashboard' | 'orders' | 'users';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

const CreateUserForm: React.FC<{onSuccess: () => void, onClose: () => void}> = ({ onSuccess, onClose }) => {
    const { addNotification } = useNotification();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role.SHOPKEEPER | Role.DELIVERY>(Role.SHOPKEEPER);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.adminCreateUser(name, email, password, role, mobile);
            addNotification('User created successfully!', 'success');
            onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            addNotification(`Failed to create user: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Full Name" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Email" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Mobile Number" id="mobile-admin" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="e.g., 9876543210" required />
            <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRole(Role.SHOPKEEPER)} className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${role === Role.SHOPKEEPER ? 'bg-sky-500 border-sky-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-gray-500 text-gray-300'}`}>
                        Shopkeeper
                    </button>
                    <button type="button" onClick={() => setRole(Role.DELIVERY)} className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${role === Role.DELIVERY ? 'bg-sky-500 border-sky-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-gray-500 text-gray-300'}`}>
                        Delivery Partner
                    </button>
                </div>
            </div>
            <div className="flex justify-end space-x-3">
                 <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                 <Button type="submit" isLoading={isLoading}>Create User</Button>
            </div>
        </form>
    );
}

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [view, setView] = useState<AdminView>('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedOrders, fetchedUsers] = await Promise.all([
                api.getAllOrders(),
                api.getAllUsers()
            ]);
            setOrders(fetchedOrders);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleUserCreationSuccess = () => {
        setCreateUserModalOpen(false);
        fetchData();
    }

    const renderOrdersTable = () => (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Shop</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Partner</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.shopName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.deliveryBoyName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{order.totalPrice || '...'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ORDER_STATUS_CLASSES[order.status]}`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsersTable = () => (
         <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mobile</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{u.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{u.mobile || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-400 capitalize">{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Orders" value={orders.length} />
            <StatCard title="Total Users" value={users.length} />
            <StatCard title="Total Revenue" value={`₹${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)}`} />
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Spinner /></div>;
        }
        switch (view) {
            case 'dashboard':
                return (
                    <>
                        {renderDashboard()}
                        <h3 className="text-2xl font-bold tracking-tighter text-white mt-10 mb-6">Recent Orders</h3>
                        {renderOrdersTable()}
                    </>
                );
            case 'orders':
                 return (
                    <>
                        <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">Manage Orders</h2>
                        {renderOrdersTable()}
                    </>
                );
            case 'users':
                return (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold tracking-tighter text-white">Manage Users</h2>
                            <Button onClick={() => setCreateUserModalOpen(true)}>Create New User</Button>
                        </div>
                        {renderUsersTable()}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Header title="Admin" />
             <nav className="bg-gray-900 border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2">
                    <button onClick={() => setView('dashboard')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'dashboard' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                        Dashboard
                    </button>
                    <button onClick={() => setView('orders')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'orders' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                        Manage Orders
                    </button>
                    <button onClick={() => setView('users')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${view === 'users' ? 'border-sky-500 text-sky-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                        Manage Users
                    </button>
                </div>
            </nav>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
            <Modal isOpen={isCreateUserModalOpen} onClose={() => setCreateUserModalOpen(false)} title="Create New User">
                <CreateUserForm onSuccess={handleUserCreationSuccess} onClose={() => setCreateUserModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdminDashboard;