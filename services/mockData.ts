import { User, Role, Shop, Product, Order, OrderStatus } from '../types';

export const initialUsers: User[] = [
  { id: 'student1', name: 'Alice', email: 'alice@campus.edu', mobile: '9876543210', role: Role.STUDENT, hostel: 'Emerald Hostel' },
  { id: 'shopkeeper1', name: 'Bob\'s Eatery', email: 'bob@shop.com', mobile: '9876543211', role: Role.SHOPKEEPER },
  { id: 'delivery1', name: 'Charlie', email: 'charlie@delivery.com', mobile: '9876543212', role: Role.DELIVERY },
  { id: 'admin1', name: 'Admin User', email: 'admin@campuswolf.com', mobile: '9876543213', role: Role.ADMIN },
  { id: 'student2', name: 'David', email: 'david@campus.edu', mobile: '9876543214', role: Role.STUDENT, hostel: 'Sapphire Hostel' },
  { id: 'shopkeeper2', name: 'Campus Needs', email: 'needs@shop.com', mobile: '9876543215', role: Role.SHOPKEEPER },
];

export const initialShops: Shop[] = [
  { id: 'shop1', ownerId: 'shopkeeper1', name: 'Bob\'s Eatery', categories: ['Food & Beverages'], imageUrl: 'https://picsum.photos/seed/shop1/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr1/300/300' },
  { id: 'shop2', ownerId: 'shopkeeper2', name: 'Campus Needs', categories: ['Stationery & Supplies', 'Groceries'], imageUrl: 'https://picsum.photos/seed/shop2/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr2/300/300' },
  { id: 'shop3', ownerId: 'shopkeeper1', name: 'Late Night Snacks', categories: ['Snacks', 'Food & Beverages'], imageUrl: 'https://picsum.photos/seed/shop3/400/300', qrCodeUrl: 'https://picsum.photos/seed/qr3/300/300' },
];

export const initialProducts: Product[] = [
  { id: 'prod1', shopId: 'shop1', name: 'Chicken Biryani', description: 'Spicy and flavorful chicken biryani.', price: 150, imageUrl: 'https://picsum.photos/seed/prod1/200/200' },
  { id: 'prod2', shopId: 'shop1', name: 'Veggie Pizza', description: 'A delicious pizza topped with fresh vegetables.', price: 250, imageUrl: 'https://picsum.photos/seed/prod2/200/200' },
  { id: 'prod3', shopId: 'shop2', name: 'Notebook Pack', description: 'Set of 5 high-quality notebooks.', price: 100, imageUrl: 'https://picsum.photos/seed/prod3/200/200' },
  { id: 'prod4', shopId: 'shop2', name: 'Pen Set', description: 'Blue and black ballpoint pens.', price: 50, imageUrl: 'https://picsum.photos/seed/prod4/200/200' },
  { id: 'prod5', shopId: 'shop3', name: 'Chips & Dip', description: 'A classic combo for late night cravings.', price: 80, imageUrl: 'https://picsum.photos/seed/prod5/200/200' },
];

export const initialOrders: Order[] = [
  {
    id: 'order1',
    studentId: 'student1',
    shopId: 'shop1',
    deliveryBoyId: 'delivery1',
    items: [{ productId: 'prod1', name: 'Chicken Biryani', quantity: 1, price: 150 }],
    status: OrderStatus.DELIVERED,
    totalPrice: 170, // including delivery
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    studentName: 'Alice',
    shopName: 'Bob\'s Eatery',
    deliveryBoyName: 'Charlie',
    paymentVerified: true
  },
  {
    id: 'order2',
    studentId: 'student2',
    shopId: 'shop2',
    items: [
        { productId: 'prod3', name: 'Notebook Pack', quantity: 2, price: 100 },
        { productId: 'prod4', name: 'Pen Set', quantity: 1, price: 50 }
    ],
    status: OrderStatus.PENDING_SHOP_CONFIRMATION,
    createdAt: new Date().toISOString(),
    studentName: 'David',
    shopName: 'Campus Needs'
  }
];