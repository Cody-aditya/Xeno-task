import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { useCustomerStore } from '../stores/customerStore';
import { useOrderStore } from '../stores/orderStore';
import { useCampaignStore } from '../stores/campaignStore';

const AnalyticsPage = () => {
  const { customers } = useCustomerStore();
  const { orders } = useOrderStore();
  const { campaigns } = useCampaignStore();
  const [timeframe, setTimeframe] = useState('30d');
  
  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const customerRetentionRate = 85; // Mock value, would be calculated from actual data
  
  // Mock data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 45000, 35000, 50000, 49000, 60000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };
  
  const customerGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Customers',
        data: [50, 65, 45, 70, 85, 90],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your business performance and customer engagement
          </p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="input"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-md bg-primary-100 text-primary-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="flex items-center text-success-600 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                12.5%
              </span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm text-gray-500">vs previous {timeframe}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-md bg-secondary-100 text-secondary-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="flex items-center text-error-600 text-sm">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                3.2%
              </span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">Avg Order Value</h3>
            <p className="text-2xl font-semibold text-gray-900">₹{avgOrderValue.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm text-gray-500">vs previous {timeframe}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-md bg-accent-100 text-accent-600">
                <Users className="h-6 w-6" />
              </div>
              <span className="flex items-center text-success-600 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                8.1%
              </span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">Customer Retention</h3>
            <p className="text-2xl font-semibold text-gray-900">{customerRetentionRate}%</p>
            <p className="mt-1 text-sm text-gray-500">vs previous {timeframe}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-md bg-success-100 text-success-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="flex items-center text-success-600 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                15.3%
              </span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">Campaign Performance</h3>
            <p className="text-2xl font-semibold text-gray-900">92.5%</p>
            <p className="mt-1 text-sm text-gray-500">Average delivery rate</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
          </div>
          <div className="card-body p-4">
            <Line 
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value.toLocaleString('en-IN')}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Customer Growth</h2>
          </div>
          <div className="card-body p-4">
            <Bar
              data={customerGrowthData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Customer Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Customer Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Customer Lifetime Value</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">₹12,450</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-success-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  5.3%
                </span>
                <span className="ml-2 text-gray-500">vs last month</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Repeat Purchase Rate</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">45.8%</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-success-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  2.1%
                </span>
                <span className="ml-2 text-gray-500">vs last month</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Average Time Between Orders</h3>
              <p className="mt-2 text-2xl font-semibold text-gray-900">32 days</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-error-600 flex items-center">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  1.8%
                </span>
                <span className="ml-2 text-gray-500">vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;