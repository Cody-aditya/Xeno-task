import { create } from 'zustand';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'completed' | 'processing' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: '1',
    customerName: 'Rahul Sharma',
    orderDate: '2023-01-15',
    totalAmount: 4500,
    status: 'completed',
    items: [
      { id: 'ITEM001', name: 'Premium Headphones', quantity: 1, price: 4500 }
    ]
  },
  {
    id: 'ORD002',
    customerId: '1',
    customerName: 'Rahul Sharma',
    orderDate: '2022-11-20',
    totalAmount: 11250,
    status: 'completed',
    items: [
      { id: 'ITEM002', name: 'Smartphone', quantity: 1, price: 9999 },
      { id: 'ITEM003', name: 'Phone Case', quantity: 1, price: 1251 }
    ]
  },
  {
    id: 'ORD003',
    customerId: '2',
    customerName: 'Priya Patel',
    orderDate: '2022-11-30',
    totalAmount: 4350,
    status: 'completed',
    items: [
      { id: 'ITEM004', name: 'Fitness Tracker', quantity: 1, price: 3500 },
      { id: 'ITEM005', name: 'Water Bottle', quantity: 1, price: 850 }
    ]
  },
  {
    id: 'ORD004',
    customerId: '3',
    customerName: 'Amit Verma',
    orderDate: '2023-02-01',
    totalAmount: 7800,
    status: 'completed',
    items: [
      { id: 'ITEM006', name: 'Wireless Earbuds', quantity: 1, price: 7800 }
    ]
  },
  {
    id: 'ORD005',
    customerId: '3',
    customerName: 'Amit Verma',
    orderDate: '2022-12-15',
    totalAmount: 14600,
    status: 'completed',
    items: [
      { id: 'ITEM007', name: 'Tablet', quantity: 1, price: 14600 }
    ]
  }
];

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ orders: mockOrders, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },
}));