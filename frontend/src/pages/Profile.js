import React, { useState } from 'react';
import { User, Settings, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
    toast.success(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}`);
  };

  const menuItems = [
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      action: toggleNotifications,
      toggle: true,
      value: notifications
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      action: () => setShowPrivacy(true)
    },
    {
      icon: Settings,
      title: 'App Settings',
      subtitle: 'Customize your app experience',
      action: () => setShowSettings(true)
    }
  ];

  return (
    <div className={`pb-20 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="bg-primary text-white p-6 rounded-b-3xl">
        <div className="text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="text-xl font-bold">{user?.name || 'User'}</h1>
          <p className="opacity-90">{user?.email || 'user@example.com'}</p>
          <p className="text-sm opacity-75 mt-1 capitalize">
            {user?.role || 'resident'} Account
          </p>
        </div>
      </div>

      <div className="p-4 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-sm text-gray-600">Collections</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">156kg</p>
            <p className="text-sm text-gray-600">Recycled</p>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.action}
                className={`w-full p-4 flex items-center justify-between transition-colors ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <item.icon size={20} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
                {item.toggle ? (
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    item.value ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                      item.value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </button>
              {index < menuItems.length - 1 && <div className="border-b border-gray-100 mx-4"></div>}
            </div>
          ))}
        </div>

        <div className={`rounded-xl shadow-sm p-4 mt-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h3 className="font-semibold mb-3">About TakaTrack</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2025.1</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>Oct 2025</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>

        {showPrivacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-96 overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Privacy & Security</h3>
                <button onClick={() => setShowPrivacy(false)} className="text-gray-500">×</button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span>Data Sharing</span>
                  <div className="w-12 h-6 bg-gray-300 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full mt-0.5 translate-x-0.5"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Location Tracking</span>
                  <div className="w-12 h-6 bg-primary rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full mt-0.5 translate-x-6"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Analytics</span>
                  <div className="w-12 h-6 bg-primary rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full mt-0.5 translate-x-6"></div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Your data is encrypted and stored securely. We never share personal information with third parties.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-96 overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">App Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-500">×</button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span>Dark Mode</span>
                  <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Auto Refresh</span>
                  <div className="w-12 h-6 bg-primary rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full mt-0.5 translate-x-6"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Refresh Interval</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;