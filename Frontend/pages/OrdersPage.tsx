import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../stores/orderStore';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OrdersPage = () => {
  const { orders, loading, fetchOrders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        
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
                placeholder="Search orders..."
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
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
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
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                      <div className="text-xs">
                        {formatDistanceToNow(new Date(order.orderDate), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-success-100 text-success-800' :
                        order.status === 'processing' ? 'bg-warning-100 text-warning-800' :
                        'bg-error-100 text-error-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span>{order.items.length}</span>
                        <button className="ml-2 text-gray-500">
                          {selectedOrder === order.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded order details */}
                  {selectedOrder === order.id && (
                    <tr className="animate-fade-in">
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="text-sm">
                          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                            <thead className="bg-gray-100">
                              <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Item
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Price
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Quantity
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {order.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    ₹{item.price.toLocaleString('en-IN')}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <th scope="row" colSpan={3} className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                                  Total
                                </th>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ₹{order.totalAmount.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your search criteria.
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

export default OrdersPage;