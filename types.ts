export enum Role {
  STUDENT = 'student',
  SHOPKEEPER = 'shopkeeper',
  DELIVERY = 'delivery',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: Role;
  hostel?: string;
}

export interface Shop {
  id: string;
  name:string;
  ownerId: string;
  categories: string[];
  imageUrl: string;
  qrCodeUrl: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price?: number; // Price can be optional, quoted by shopkeeper
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price?: number;
}

export enum OrderStatus {
  PENDING_SHOP_CONFIRMATION = 'Waiting for Shop Confirmation',
  REJECTED_BY_SHOP = 'Rejected by Shop',
  CONFIRMED_WAITING_FOR_DELIVERY = 'Confirmed, Awaiting Delivery Partner',
  PICKING_UP = 'Delivery Partner Assigned',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED_BY_STUDENT = 'Cancelled by Student'
}

export interface Order {
  id: string;
  studentId: string;
  shopId: string;
  deliveryBoyId?: string;
  items: CartItem[];
  status: OrderStatus;
  totalPrice?: number;
  createdAt: string;
  studentName: string;
  shopName: string;
  deliveryBoyName?: string;
  paymentVerified?: boolean;
}