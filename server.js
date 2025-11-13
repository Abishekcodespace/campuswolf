const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// --- MOCK DATA (from original app) ---
const Role = { STUDENT: 'student', SHOPKEEPER: 'shopkeeper', DELIVERY: 'delivery', ADMIN: 'admin' };
const OrderStatus = {
  PENDING_SHOP_CONFIRMATION: 'Waiting for Shop Confirmation',
  REJECTED_BY_SHOP: 'Rejected by Shop',
  CONFIRMED_WAITING_FOR_DELIVERY: 'Confirmed, Awaiting Delivery Partner',
  PICKING_UP: 'Delivery Partner Assigned',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED_BY_STUDENT: 'Cancelled by Student'
};

let users = [
  { id: 'student1', name: 'Alice', email: 'alice@campus.edu', mobile: '9876543210', role: Role.STUDENT, hostel: 'Emerald Hostel' },
  { id: 'shopkeeper1', name: 'Bob\'s Eatery Owner', email: 'bob@shop.com', mobile: '9876543211', role: Role.SHOPKEEPER },
  { id: 'delivery1', name: 'Charlie', email: 'charlie@delivery.com', mobile: '9876543212', role: Role.DELIVERY },
  { id: 'admin1', name: 'Admin User', email: 'admin@campuswolf.com', mobile: '9876543213', role: Role.ADMIN },
  { id: 'student2', name: 'David', email: 'david@campus.edu', mobile: '9876543214', role: Role.STUDENT, hostel: 'Sapphire Hostel' },
  { id: 'shopkeeper2', name: 'Campus Needs Owner', email: 'needs@shop.com', mobile: '9876543215', role: Role.SHOPKEEPER },
];
let shops = [
  { id: 'shop1', ownerId: 'shopkeeper1', name: 'Bob\'s Eatery', categories: ['Food & Beverages'], imageUrl: 'https://picsum.photos/seed/shop1/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr1/300/300' },
  { id: 'shop2', ownerId: 'shopkeeper2', name: 'Campus Needs', categories: ['Stationery & Supplies', 'Groceries'], imageUrl: 'https://picsum.photos/seed/shop2/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr2/300/300' },
  { id: 'shop3', ownerId: 'shopkeeper1', name: 'Late Night Snacks', categories: ['Snacks', 'Food & Beverages'], imageUrl: 'https://picsum.photos/seed/shop3/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr3/300/300' },
];
let products = [
  { id: 'prod1', shopId: 'shop1', name: 'Chicken Biryani', description: 'Spicy and flavorful chicken biryani.', price: 150, imageUrl: 'https://picsum.photos/seed/prod1/200/200' },
  { id: 'prod2', shopId: 'shop1', name: 'Veggie Pizza', description: 'A delicious pizza topped with fresh vegetables.', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/200/200' },
  { id: 'prod3', shopId: 'shop2', name: 'Notebook Pack', description: 'Set of 5 high-quality notebooks.', price: 100, imageUrl: 'https://picsum.photos/seed/prod3/200/200' },
  { id: 'prod4', shopId: 'shop2', name: 'Pen Set', description: 'Blue and black ballpoint pens.', price: 50, imageUrl: 'https://picsum.photos/seed/prod4/200/200' },
  { id: 'prod5', shopId: 'shop3', name: 'Chips & Dip', description: 'A classic combo for late night cravings.', price: 80, imageUrl: 'https://picsum.photos/seed/prod5/200/200' },
];
let orders = [
  { id: 'order1', studentId: 'student1', shopId: 'shop1', deliveryBoyId: 'delivery1', items: [{ productId: 'prod1', name: 'Chicken Biryani', quantity: 1, price: 150 }], status: OrderStatus.DELIVERED, totalPrice: 170, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), studentName: 'Alice', shopName: 'Bob\'s Eatery', deliveryBoyName: 'Charlie', paymentVerified: true },
  { id: 'order2', studentId: 'student2', shopId: 'shop2', items: [ { productId: 'prod3', name: 'Notebook Pack', quantity: 2, price: 100 }, { productId: 'prod4', name: 'Pen Set', quantity: 1, price: 50 } ], status: OrderStatus.PENDING_SHOP_CONFIRMATION, createdAt: new Date().toISOString(), studentName: 'David', shopName: 'Campus Needs' }
];

// --- API ROUTES ---

// Auth
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
        const token = `dummy-jwt-token-for-${user.id}`;
        res.json({ user, token });
    } else {
        res.status(401).json({ message: 'Invalid credentials or role' });
    }
});

app.post('/api/register', (req, res) => {
    const { name, email, password, role, mobile } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    const newUser = { id: `user_${Date.now()}`, name, email, mobile, role: role || Role.STUDENT };
    if (newUser.role === Role.STUDENT) newUser.hostel = 'New Hostel';
    users.push(newUser);
    const token = `dummy-jwt-token-for-${newUser.id}`;
    res.status(201).json({ user: newUser, token });
});

// Student
app.get('/api/shops', (req, res) => res.json(shops));

app.get('/api/shops/:id', (req, res) => {
    const shop = shops.find(s => s.id === req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const shopProducts = products.filter(p => p.shopId === req.params.id);
    res.json({ shop, products: shopProducts });
});

app.post('/api/orders', (req, res) => {
    const { studentId, shopId, items } = req.body;
    const now = new Date();
    if (now.getHours() < 16 || now.getHours() >= 23) {
        return res.status(400).json({ message: 'Orders can only be placed between 4 PM and 11 PM.' });
    }
    const student = users.find(u => u.id === studentId);
    const shop = shops.find(s => s.id === shopId);
    if (!student || !shop) return res.status(400).json({ message: 'Invalid student or shop' });
    
    const newOrder = {
        id: `order_${Date.now()}`,
        studentId, shopId, items,
        status: OrderStatus.PENDING_SHOP_CONFIRMATION,
        createdAt: new Date().toISOString(),
        studentName: student.name,
        shopName: shop.name
    };
    orders.unshift(newOrder);
    res.status(201).json(newOrder);
});

app.get('/api/student/orders/:studentId', (req, res) => {
    res.json(orders.filter(o => o.studentId === req.params.studentId));
});

// Shopkeeper
app.get('/api/shopkeeper/orders/:ownerId', (req, res) => {
    const ownerShops = shops.filter(s => s.ownerId === req.params.ownerId);
    const shopIds = ownerShops.map(s => s.id);
    res.json(orders.filter(o => shopIds.includes(o.shopId)));
});

app.put('/api/orders/:id/confirm', (req, res) => {
    const { totalPrice } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY;
    order.totalPrice = totalPrice;
    res.json(order);
});

app.put('/api/orders/:id/reject', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = OrderStatus.REJECTED_BY_SHOP;
    res.json(order);
});

// Delivery
app.get('/api/delivery/available', (req, res) => {
    res.json(orders.filter(o => o.status === OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY));
});

app.get('/api/delivery/my-orders/:deliveryBoyId', (req, res) => {
    res.json(orders.filter(o => o.deliveryBoyId === req.params.deliveryBoyId));
});

app.put('/api/orders/:id/accept', (req, res) => {
    const { deliveryBoyId } = req.body;
    const order = orders.find(o => o.id === req.params.id && o.status === OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY);
    const deliveryBoy = users.find(u => u.id === deliveryBoyId);
    if (!order || !deliveryBoy) return res.status(404).json({ message: 'Order not found or already accepted' });
    
    order.status = OrderStatus.PICKING_UP;
    order.deliveryBoyId = deliveryBoyId;
    order.deliveryBoyName = deliveryBoy.name;
    res.json(order);
});

app.put('/api/orders/:id/status', (req, res) => {
    const { status, paymentVerified } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    if (paymentVerified !== undefined) {
        order.paymentVerified = paymentVerified;
    }
    res.json(order);
});

// Admin
app.get('/api/admin/orders', (req, res) => res.json(orders));
app.get('/api/admin/users', (req, res) => res.json(users));
app.post('/api/admin/users', (req, res) => {
    const { name, email, password, role, mobile } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    const newUser = { id: `user_${Date.now()}`, name, email, mobile, role };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
