import { create } from 'zustand';
import { Segment } from './segmentStore';

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  segmentName: string;
  message: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  audienceSize: number;
  stats: {
    sent: number;
    failed: number;
    deliveryRate: number;
  };
  createdAt: string;
  sentAt?: string;
}

export interface CommunicationLog {
  id: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
}

interface CampaignState {
  campaigns: Campaign[];
  communicationLogs: CommunicationLog[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  fetchCampaignById: (id: string) => Promise<Campaign | undefined>;
  fetchCommunicationLogs: (campaignId: string) => Promise<CommunicationLog[]>;
  createCampaign: (campaign: { 
    name: string; 
    segmentId: string; 
    segmentName: string;
    message: string;
    audienceSize: number;
  }) => Promise<Campaign>;
  simulateDelivery: (campaignId: string) => Promise<void>;
}

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: 'camp001',
    name: 'Summer Sale Promotion',
    segmentId: 'seg001',
    segmentName: 'High Value Customers',
    message: 'Hi {{name}}, enjoy an exclusive 20% discount on your next purchase!',
    status: 'sent',
    audienceSize: 215,
    stats: {
      sent: 198,
      failed: 17,
      deliveryRate: 92.1,
    },
    createdAt: '2023-01-20',
    sentAt: '2023-01-20',
  },
  {
    id: 'camp002',
    name: 'Win-back Inactive Users',
    segmentId: 'seg002',
    segmentName: 'Inactive Customers',
    message: 'Hi {{name}}, we miss you! Come back and get 15% off your next order.',
    status: 'sent',
    audienceSize: 187,
    stats: {
      sent: 162,
      failed: 25,
      deliveryRate: 86.6,
    },
    createdAt: '2023-02-05',
    sentAt: '2023-02-05',
  },
  {
    id: 'camp003',
    name: 'New Customer Welcome',
    segmentId: 'seg003',
    segmentName: 'New Customers with Low Engagement',
    message: 'Welcome aboard, {{name}}! Here\'s a special 10% discount on your first purchase.',
    status: 'draft',
    audienceSize: 43,
    stats: {
      sent: 0,
      failed: 0,
      deliveryRate: 0,
    },
    createdAt: '2023-02-10',
  }
];

// Mock communication logs
const generateMockLogs = (campaignId: string): CommunicationLog[] => {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign || campaign.status === 'draft') return [];
  
  const logs: CommunicationLog[] = [];
  const customerNames = [
    'Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Meera Joshi', 
    'Vikram Singh', 'Neha Kumar', 'Raj Malhotra', 'Ananya Desai'
  ];
  
  // Generate sent logs (90%)
  const sentCount = Math.floor(campaign.audienceSize * 0.9);
  for (let i = 0; i < sentCount; i++) {
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    logs.push({
      id: `log-${campaignId}-${i}`,
      campaignId,
      customerId: `cust${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      message: campaign.message.replace('{{name}}', name.split(' ')[0]),
      status: 'sent',
      sentAt: campaign.sentAt,
      deliveredAt: campaign.sentAt
    });
  }
  
  // Generate failed logs (10%)
  const failedCount = campaign.audienceSize - sentCount;
  for (let i = 0; i < failedCount; i++) {
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    logs.push({
      id: `log-${campaignId}-fail-${i}`,
      campaignId,
      customerId: `cust${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      message: campaign.message.replace('{{name}}', name.split(' ')[0]),
      status: 'failed',
      sentAt: campaign.sentAt,
      errorMessage: 'User contact information invalid or unreachable'
    });
  }
  
  return logs;
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  communicationLogs: [],
  loading: false,
  error: null,
  
  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ campaigns: mockCampaigns, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch campaigns', loading: false });
    }
  },
  
  fetchCampaignById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload campaigns if they're not loaded yet
      if (get().campaigns.length === 0) {
        await get().fetchCampaigns();
      }
      
      const campaign = get().campaigns.find(c => c.id === id);
      set({ loading: false });
      return campaign;
    } catch (error) {
      set({ error: 'Failed to fetch campaign', loading: false });
      return undefined;
    }
  },
  
  fetchCommunicationLogs: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const logs = generateMockLogs(campaignId);
      set({ communicationLogs: logs, loading: false });
      return logs;
    } catch (error) {
      set({ error: 'Failed to fetch communication logs', loading: false });
      return [];
    }
  },
  
  createCampaign: async (campaignData) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newCampaign: Campaign = {
        ...campaignData,
        id: `camp${Math.floor(Math.random() * 10000)}`,
        status: 'draft',
        stats: {
          sent: 0,
          failed: 0,
          deliveryRate: 0,
        },
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({
        campaigns: [...state.campaigns, newCampaign],
        loading: false,
      }));
      
      return newCampaign;
    } catch (error) {
      set({ error: 'Failed to create campaign', loading: false });
      throw error;
    }
  },
  
  simulateDelivery: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call to trigger the campaign
      // Simulating API delay and processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      set(state => {
        const campaigns = state.campaigns.map(campaign => {
          if (campaign.id === campaignId) {
            // Calculate roughly 90% success rate
            const sent = Math.floor(campaign.audienceSize * 0.9);
            const failed = campaign.audienceSize - sent;
            
            return {
              ...campaign,
              status: 'sent',
              sentAt: new Date().toISOString(),
              stats: {
                sent,
                failed,
                deliveryRate: (sent / campaign.audienceSize) * 100,
              }
            };
          }
          return campaign;
        });
        
        return { campaigns, loading: false };
      });
      
      // Generate and store communication logs for this campaign
      const logs = generateMockLogs(campaignId);
      set({ communicationLogs: logs });
    } catch (error) {
      set({ error: 'Failed to deliver campaign', loading: false });
    }
  },
}));