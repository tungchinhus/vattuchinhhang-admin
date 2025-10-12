export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export interface OrderFormData {
  buyerId: string;
  sellerId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
}

// Status display names
export const ORDER_STATUS_DISPLAY_NAMES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ xử lý',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.SHIPPED]: 'Đã giao hàng',
  [OrderStatus.COMPLETED]: 'Hoàn thành',
  [OrderStatus.CANCELED]: 'Đã hủy'
};
