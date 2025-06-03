import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Target, 
  Send, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useCustomerStore } from '../stores/customerStore';
import { useOrderStore } from '../stores/orderStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useSegmentStore } from '../stores/segmentStore';

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { customers, fetchCustomers } = useCustomerStore();
  const { orders, fetchOrders } = useOrderStore();
  const { campaigns, fetchCampaigns } = useCampaignStore();
  const { segments, fetchSegments } = useSegmentStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCustomers(),
        fetchOrders(),
        fetchCampaigns(),
        fetchSegments()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchCustomers, fetchOrders, fetchCampaigns, fetchSegments]);
  
  // Calculate metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = orders.length ? (totalRevenue / orders.length) : 0;
  
  // Campaign metrics
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
  const avgDeliveryRate = sentCampaigns ? 
    campaigns.filter(c => c.status === 'sent')
      .reduce((sum, c) => sum + c.stats.deliveryRate, 0) / sentCampaigns
    : 0;
  
  // Recent campaigns for chart data
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Chart data for campaign performance
  const campaignChartData = {
    labels: recentCampaigns.map(c => c.name),
    datasets: [
      {
        label: 'Delivery Rate (%)',
        data: recentCampaigns.map(c => c.stats.deliveryRate),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Customer segment distribution
  const segmentDistributionData = {
    labels: ['High Value', 'Regular', 'Inactive', 'New'],
    datasets: [
      {
        data: [25, 40, 20, 15], // Mock distribution percentages
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', // Purple for high value
          'rgba(14, 165, 233, 0.8)', // Blue for regular
          'rgba(249, 115, 22, 0.8)', // Orange for inactive
          'rgba(16, 185, 129, 0.8)', // Green for new
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => navigate('/segments/create')}
          className="btn-primary flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Create Campaign</span>
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-primary-100 text-primary-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
              <p className="text-sm text-gray-500">{Math.round((activeCustomers / totalCustomers) * 100)}% active</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-secondary-100 text-secondary-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
              <p className="text-2xl font-semibold text-gray-900">₹{avgOrderValue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-500">From {orders.length} orders</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-accent-100 text-accent-600">
              <Target className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Audience Segments</h3>
              <p className="text-2xl font-semibold text-gray-900">{segments.length}</p>
              <p className="text-sm text-gray-500">Ready for campaigns</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-success-100 text-success-600">
              <Send className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Campaign Delivery</h3>
              <p className="text-2xl font-semibold text-gray-900">{avgDeliveryRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Average delivery rate</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Campaign Performance</h2>
          </div>
          <div className="card-body p-4">
            <Bar 
              data={campaignChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Delivery Rate (%)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Customer Segments</h2>
          </div>
          <div className="card-body flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut 
                data={segmentDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Campaigns */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Campaigns</h2>
          <button
            onClick={() => navigate('/campaigns')}
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            View all
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.segmentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      campaign.status === 'sent' ? 'badge-success' : 
                      campaign.status === 'sending' ? 'badge-warning' : 
                      campaign.status === 'failed' ? 'badge-error' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.audienceSize.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.stats.deliveryRate.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No campaigns yet. Create your first campaign to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;