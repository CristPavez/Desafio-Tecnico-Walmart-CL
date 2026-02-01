export interface Product {
  id: string; 
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  tags: string[]; 
  imageUrl: string;
}

export interface CartItem {
  sku: string;
  quantity: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  shippingAddress?: {
    street: string;
    city: string;
    zoneId: string;
  };
  paymentMethod?: string; 
}

export interface DeliveryWindow {
  id: string; 
  date: string;
  start: string;
  end: string;
  capacityTotal: number;
  capacityByZone: { [zoneId: string]: number };
  cost: number; 
}

export interface Zone {
  id: string; 
  name: string; 
  zipCode: string;
  active: boolean;
}

export interface CheckoutResponse {
  subtotal: number;
  discounts: Array<{
    type: string;
    description: string;
    amount: number;
  }>;
  totalDiscounts: number;
  total: number;
}
