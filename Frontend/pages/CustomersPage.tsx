import React, { useEffect, useState } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { useOrderStore } from '../stores/orderStore';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CustomersPage = () => {
  const { customers, loading, fetchCustomers } = useCustomerStore();
  const { orders, fetchOrders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, [fetchCustomers, fetchOrders]);
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };
  
  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        
        <div className="flex space-x-2">
          <button className="btn-outline flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-1 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spend
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        {customer.phone && <div className="text-xs text-gray-500">{customer.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-success-100 text-success-800' :
                      customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-primary-100 text-primary-800'
                    }`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{customer.totalSpend.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-500">{customer.visitCount} visits</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastOrderDate ? (
                      formatDistanceToNow(new Date(customer.lastOrderDate), { addSuffix: true })
                    ) : (
                      'Never'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                      className="text-primary-600 hover:text-primary-900 flex items-center ml-auto"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedCustomer === customer.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Customer detail panel */}
      {selectedCustomer && (
        <div className="mt-6 card animate-slide-in">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">
              Customer Details
            </h2>
          </div>
          <div className="card-body">
            {(() => {
              const customer = customers.find(c => c.id === selectedCustomer);
              if (!customer) return null;
              
              const customerOrders = getCustomerOrders(customer.id);
              
              return (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-xl">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-gray-900">{customer.name}</h3>
                      <p className="text-gray-500">{customer.email} {customer.phone && `• ${customer.phone}`}</p>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'active' ? 'bg-success-100 text-success-800' :
                          customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-primary-100 text-primary-800'
                        }`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="text-sm text-gray-500">
                          Customer since {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Total Spend</h4>
                      <p className="text-2xl font-semibold text-gray-900">₹{customer.totalSpend.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Visit Count</h4>
                      <p className="text-2xl font-semibold text-gray-900">{customer.visitCount}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Last Order</h4>
                      <p className="text-2xl font-semibold text-gray-900">
                        {customer.lastOrderDate ? formatDistanceToNow(new Date(customer.lastOrderDate), { addSuffix: true }) : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Order History</h4>
                    {customerOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {customerOrders.map(order => (
                              <tr key={order.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {order.id}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  ₹{order.totalAmount.toLocaleString('en-IN')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'completed' ? 'bg-success-100 text-success-800' :
                                    order.status === 'processing' ? 'bg-warning-100 text-warning-800' :
                                    'bg-error-100 text-error-800'
                                  }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No order history available.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;