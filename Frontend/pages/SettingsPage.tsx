import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  Lock,
  Mail,
  MessageSquare,
  Globe,
  CreditCard,
  Save,
  Check
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <div className="card">
            <div className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock className="h-5 w-5 mr-2" />
                Security
              </button>
              
              <button
                onClick={() => setActiveTab('communications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'communications'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Communications
              </button>
              
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'billing'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Billing
              </button>
            </div>
          </div>
        </nav>
        
        {/* Settings Content */}
        <div className="flex-1">
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-semibold">
                        DU
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="btn-outline">Change Photo</button>
                      <p className="mt-1 text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="input mt-1"
                        defaultValue="Demo User"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="input mt-1"
                        defaultValue="demo@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        className="input mt-1"
                        defaultValue="Administrator"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive email updates about your account activity
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing_emails"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="marketing_emails" className="font-medium text-gray-700">
                          Marketing Emails
                        </label>
                        <p className="text-sm text-gray-500">
                          Receive emails about new features and updates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                </div>
                <div className="card-body space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                    <div className="mt-2 flex items-center">
                      <button className="btn-primary">Enable 2FA</button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Connected Accounts</h3>
                    <div className="mt-2">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <span className="ml-3 text-sm text-gray-700">Google Account</span>
                        </div>
                        <span className="badge badge-success">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'communications' && (
              <div>
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Communication Settings</h2>
                </div>
                <div className="card-body space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Email Templates</h3>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Welcome Email</p>
                          <p className="text-sm text-gray-500">Sent to new customers</p>
                        </div>
                        <button className="btn-outline">Edit</button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Confirmation</p>
                          <p className="text-sm text-gray-500">Sent after purchase</p>
                        </div>
                        <button className="btn-outline">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div>
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
                </div>
                <div className="card-body space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Current Plan</h3>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Professional Plan</p>
                          <p className="text-sm text-gray-500">₹2,999/month</p>
                        </div>
                        <button className="btn-outline">Upgrade</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm text-gray-700">•••• •••• •••• 4242</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="card-footer bg-gray-50 flex justify-end py-3 px-6">
              <button
                type="button"
                className="btn-primary flex items-center space-x-2"
                onClick={handleSave}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;