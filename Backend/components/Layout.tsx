import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import Header from './navigation/Header';
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;