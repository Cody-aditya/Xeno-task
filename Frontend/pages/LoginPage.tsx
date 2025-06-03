import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Mini CRM Platform</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your customer relationship management tools
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <GoogleLoginButton />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Information</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-2">This is a demo application. When you click "Sign in with Google":</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You'll be authenticated with Google OAuth</li>
                <li>You will access a demo account with sample data</li>
                <li>No actual data will be stored or processed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;