import { User, Role, Shop, Product, Order, OrderStatus, CartItem } from '../types';
import { initialUsers, initialShops, initialProducts, initialOrders } from './mockData';

const SIMULATED_DELAY = 500;

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key “${key}”:`, error);
  }
};

let users: User[] = getFromStorage<User[]>('users', initialUsers);
let shops: Shop[] = getFromStorage<Shop[]>('shops', initialShops);
let products: Product[] = getFromStorage<Product[]>('products', initialProducts);
let orders: Order[] = getFromStorage<Order[]>('orders', initialOrders);

const persistData = () => {
  saveToStorage('users', users);
  saveToStorage('shops', shops);
  saveToStorage('products', products);
  saveToStorage('orders', orders);
}

// ---- Auth ----
export const login = (email: string, password: string, role: Role): Promise<{ user: User, token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.role === role);
      // In a real app, you'd verify the password hash
      if (user) {
        const token = `dummy-jwt-token-for-${user.id}`;
        resolve({ user, token });
      } else {
        reject(new Error('Invalid credentials or role'));
      }
    }, SIMULATED_DELAY);
  });
};

export const register = (name: string, email: string, password: string, role: Role, mobile: string): Promise<{ user: User, token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return reject(new Error('A user with this email already exists.'));
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        mobile,
        role,
      };
      // For student, add a default hostel
      if (role === Role.STUDENT) {
        newUser.hostel = 'New Hostel';
      }

      users.push(newUser);
      persistData();

      // Automatically log the user in after registration
      const token = `dummy-jwt-token-for-${newUser.id}`;
      resolve({ user: newUser, token });
    }, SIMULATED_DELAY);
  });
};

// ---- Student ----
export const getShops = (): Promise<Shop[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(shops), SIMULATED_DELAY);
  });
};

export const getShopDetails = (shopId: string): Promise<{shop: Shop, products: Product[]}> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shop = shops.find(s => s.id === shopId);
      const shopProducts = products.filter(p => p.shopId === shopId);
      if(shop) {
        resolve({ shop, products: shopProducts });
      } else {
        reject(new Error('Shop not found'));
      }
    }, SIMULATED_DELAY);
  });
};

export const placeOrder = (studentId: string, shopId: string, items: CartItem[]): Promise<Order> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const now = new Date();
        if(now.getHours() < 16 || now.getHours() >= 23) {
            return reject(new Error('Orders can only be placed between 4 PM and 11 PM.'));
        }
        const student = users.find(u => u.id === studentId);
        const shop = shops.find(s => s.id === shopId);
        if(!student || !shop) return reject(new Error('Invalid student or shop'));
        
        const newOrder: Order = {
            id: `order_${Date.now()}`,
            studentId,
            shopId,
            items,
            status: OrderStatus.PENDING_SHOP_CONFIRMATION,
            createdAt: new Date().toISOString(),
            studentName: student.name,
            shopName: shop.name
        };
        orders.unshift(newOrder);
        persistData();
        resolve(newOrder);
      }, SIMULATED_DELAY);
    });
};

export const getStudentOrders = (studentId: string): Promise<Order[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(orders.filter(o => o.studentId === studentId));
        }, SIMULATED_DELAY);
    });
};

// ---- Shopkeeper ----
export const getShopkeeperOrders = (ownerId: string): Promise<Order[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const ownerShops = shops.filter(s => s.ownerId === ownerId);
            const shopIds = ownerShops.map(s => s.id);
            resolve(orders.filter(o => shopIds.includes(o.shopId)));
        }, SIMULATED_DELAY);
    });
}

export const confirmOrder = (orderId: string, totalPrice: number): Promise<Order> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if(orderIndex > -1) {
                orders[orderIndex].status = OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY;
                orders[orderIndex].totalPrice = totalPrice;
                persistData();
                resolve(orders[orderIndex]);
            } else {
                reject(new Error('Order not found'));
            }
        }, SIMULATED_DELAY);
    });
};

export const rejectOrder = (orderId: string): Promise<Order> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if(orderIndex > -1) {
                orders[orderIndex].status = OrderStatus.REJECTED_BY_SHOP;
                persistData();
                resolve(orders[orderIndex]);
            } else {
                reject(new Error('Order not found'));
            }
        }, SIMULATED_DELAY);
    });
};

// ---- Delivery ----
export const getAvailableOrders = (): Promise<Order[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(orders.filter(o => o.status === OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY));
        }, SIMULATED_DELAY);
    });
};

export const getDeliveryBoyOrders = (deliveryBoyId: string): Promise<Order[]> => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(orders.filter(o => o.deliveryBoyId === deliveryBoyId));
        }, SIMULATED_DELAY);
    });
}

export const acceptDelivery = (orderId: string, deliveryBoyId: string): Promise<Order> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orderIndex = orders.findIndex(o => o.id === orderId && o.status === OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY);
            const deliveryBoy = users.find(u => u.id === deliveryBoyId);
            if(orderIndex > -1 && deliveryBoy) {
                orders[orderIndex].status = OrderStatus.PICKING_UP;
                orders[orderIndex].deliveryBoyId = deliveryBoyId;
                orders[orderIndex].deliveryBoyName = deliveryBoy.name;
                persistData();
                resolve(orders[orderIndex]);
            } else {
                reject(new Error('Order not found or already accepted'));
            }
        }, SIMULATED_DELAY);
    });
}

export const updateOrderStatus = (orderId: string, newStatus: OrderStatus, paymentVerified?: boolean): Promise<Order> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if(orderIndex > -1) {
                orders[orderIndex].status = newStatus;
                if(paymentVerified !== undefined) {
                    orders[orderIndex].paymentVerified = paymentVerified;
                }
                persistData();
                resolve(orders[orderIndex]);
            } else {
                reject(new Error('Order not found'));
            }
        }, SIMULATED_DELAY);
    });
};

// --- Admin ---
export const getAllOrders = (): Promise<Order[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(orders), SIMULATED_DELAY);
  });
};

export const getAllUsers = (): Promise<User[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(users), SIMULATED_DELAY);
  });
};

export const adminCreateUser = (name: string, email: string, password: string, role: Role.SHOPKEEPER | Role.DELIVERY, mobile: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return reject(new Error('A user with this email already exists.'));
        }
        
        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          mobile,
          role,
        };
  
        users.push(newUser);
        persistData();
  
        resolve(newUser);
      }, SIMULATED_DELAY);
    });
  };