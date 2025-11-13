
import { OrderStatus } from './types';

export const APP_NAME = "Campuswolf";

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
    [OrderStatus.PENDING_SHOP_CONFIRMATION]: 'bg-yellow-500/10 text-yellow-400',
    [OrderStatus.REJECTED_BY_SHOP]: 'bg-red-500/10 text-red-400',
    [OrderStatus.CONFIRMED_WAITING_FOR_DELIVERY]: 'bg-cyan-500/10 text-cyan-400',
    [OrderStatus.PICKING_UP]: 'bg-blue-500/10 text-blue-400',
    [OrderStatus.OUT_FOR_DELIVERY]: 'bg-indigo-500/10 text-indigo-400',
    [OrderStatus.DELIVERED]: 'bg-green-500/10 text-green-400',
    [OrderStatus.CANCELLED_BY_STUDENT]: 'bg-gray-500/10 text-gray-400',
};
