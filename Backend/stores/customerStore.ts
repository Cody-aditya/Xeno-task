import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpend: number;
  lastOrderDate: string;
  visitCount: number;
  tags: string[];
  status: 'active' | 'inactive' | 'new';
  createdAt: string;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    totalSpend: 15750,
    lastOrderDate: '2023-01-15',
    visitCount: 8,
    tags: ['premium', 'loyal'],
    status: 'active',
    createdAt: '2022-06-12',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    totalSpend: 4350,
    lastOrderDate: '2022-11-30',
    visitCount: 3,
    tags: ['new'],
    status: 'active',
    createdAt: '2022-10-05',
  },
  {
    id: '3',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    totalSpend: 22400,
    lastOrderDate: '2023-02-01',
    visitCount: 12,
    tags: ['premium', 'high-value'],
    status: 'active',
    createdAt: '2021-08-17',
  },
  {
    id: '4',
    name: 'Meera Joshi',
    email: 'meera.j@example.com',
    phone: '+91 76543 21098',
    totalSpend: 8200,
    lastOrderDate: '2022-08-28',
    visitCount: 5,
    tags: ['regular'],
    status: 'inactive',
    createdAt: '2022-02-25',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    totalSpend: 1200,
    lastOrderDate: '2022-12-10',
    visitCount: 2,
    tags: ['new'],
    status: 'active',
    createdAt: '2022-11-02',
  },
];

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  error: null,
  
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ customers: mockCustomers, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch customers', loading: false });
    }
  },
}));