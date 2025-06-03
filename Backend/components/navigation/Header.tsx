import React, { useState } from 'react';
import { Bell, Search, HelpCircle, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuthStore();
  
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Search */}
          <div className="flex-1 flex items-center ml-4 md:ml-0">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search customers, campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center ml-4 md:ml-6">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <HelpCircle className="h-6 w-6" aria-hidden="true" />
            </button>
            
            {/* Notifications */}
            <button className="ml-3 p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="ml-3 flex items-center">
                  {user?.imageUrl ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.imageUrl}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                  <button
                    onClick={logout}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;