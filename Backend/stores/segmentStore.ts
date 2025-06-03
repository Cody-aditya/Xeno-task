import { create } from 'zustand';
import { useCustomerStore, Customer } from './customerStore';

export interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string | number;
}

export interface RuleGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: (Rule | RuleGroup)[];
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  ruleGroup: RuleGroup;
  createdAt: string;
  createdBy: string;
  lastModified: string;
}

interface SegmentState {
  segments: Segment[];
  loading: boolean;
  error: string | null;
  fetchSegments: () => Promise<void>;
  createSegment: (segment: Omit<Segment, 'id' | 'createdAt' | 'lastModified'>) => Promise<Segment>;
  previewSegment: (ruleGroup: RuleGroup) => Promise<{ count: number, sampleCustomers: Customer[] }>;
}

// Mock data for demonstration
const mockSegments: Segment[] = [
  {
    id: 'seg001',
    name: 'High Value Customers',
    description: 'Customers who have spent more than ₹10,000',
    ruleGroup: {
      id: 'group1',
      combinator: 'and',
      rules: [
        {
          id: 'rule1',
          field: 'totalSpend',
          operator: 'greaterThan',
          value: 10000
        }
      ]
    },
    createdAt: '2023-01-10',
    createdBy: 'Demo User',
    lastModified: '2023-01-10'
  },
  {
    id: 'seg002',
    name: 'Inactive Customers',
    description: 'Customers who have not made a purchase in the last 90 days',
    ruleGroup: {
      id: 'group2',
      combinator: 'and',
      rules: [
        {
          id: 'rule2',
          field: 'status',
          operator: 'equals',
          value: 'inactive'
        }
      ]
    },
    createdAt: '2023-01-15',
    createdBy: 'Demo User',
    lastModified: '2023-01-20'
  },
  {
    id: 'seg003',
    name: 'New Customers with Low Engagement',
    description: 'New customers with less than 3 visits',
    ruleGroup: {
      id: 'group3',
      combinator: 'and',
      rules: [
        {
          id: 'rule3',
          field: 'tags',
          operator: 'contains',
          value: 'new'
        },
        {
          id: 'rule4',
          field: 'visitCount',
          operator: 'lessThan',
          value: 3
        }
      ]
    },
    createdAt: '2023-02-01',
    createdBy: 'Demo User',
    lastModified: '2023-02-01'
  }
];

// Helper function to evaluate a rule against a customer
const evaluateRule = (rule: Rule, customer: Customer): boolean => {
  const field = rule.field as keyof Customer;
  const customerValue = customer[field];
  
  switch (rule.operator) {
    case 'equals':
      return customerValue === rule.value;
    case 'notEquals':
      return customerValue !== rule.value;
    case 'contains':
      if (Array.isArray(customerValue)) {
        return customerValue.includes(rule.value as string);
      }
      return String(customerValue).includes(String(rule.value));
    case 'greaterThan':
      return Number(customerValue) > Number(rule.value);
    case 'lessThan':
      return Number(customerValue) < Number(rule.value);
    default:
      return false;
  }
};

// Helper function to evaluate a rule group against a customer
const evaluateRuleGroup = (ruleGroup: RuleGroup, customer: Customer): boolean => {
  const results = ruleGroup.rules.map(ruleOrGroup => {
    if ('combinator' in ruleOrGroup) {
      return evaluateRuleGroup(ruleOrGroup, customer);
    }
    return evaluateRule(ruleOrGroup, customer);
  });
  
  return ruleGroup.combinator === 'and'
    ? results.every(result => result)
    : results.some(result => result);
};

export const useSegmentStore = create<SegmentState>((set, get) => ({
  segments: [],
  loading: false,
  error: null,
  
  fetchSegments: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ segments: mockSegments, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch segments', loading: false });
    }
  },
  
  createSegment: async (segmentData) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSegment: Segment = {
        ...segmentData,
        id: `seg${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      
      set(state => ({
        segments: [...state.segments, newSegment],
        loading: false,
      }));
      
      return newSegment;
    } catch (error) {
      set({ error: 'Failed to create segment', loading: false });
      throw error;
    }
  },
  
  previewSegment: async (ruleGroup) => {
    // Get customers from customer store
    const customers = useCustomerStore.getState().customers;
    
    // If no customers, fetch them first
    if (customers.length === 0) {
      await useCustomerStore.getState().fetchCustomers();
    }
    
    // Re-get customers after fetch
    const updatedCustomers = useCustomerStore.getState().customers;
    
    // Filter customers based on rule group
    const matchingCustomers = updatedCustomers.filter(customer => 
      evaluateRuleGroup(ruleGroup, customer)
    );
    
    // Return count and sample of matching customers
    return {
      count: matchingCustomers.length,
      sampleCustomers: matchingCustomers.slice(0, 5)
    };
  }
}));