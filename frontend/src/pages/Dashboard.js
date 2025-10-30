import React, { useState, useEffect } from 'react';
import { Bell, Truck, Recycle, MapPin, TrendingUp, Users, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalBins: 0, collectedToday: 0, recycledWeight: 0, pendingCollections: 0, activeDrivers: 0 });
  const [notifications, setNotifications] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsResponse = await axios.get('http://localhost:5003/api/dashboard/stats');
      const notificationsResponse = await axios.get('http://localhost:5003/api/notifications');
      const driversResponse = await axios.get('http://localhost:5003/api/drivers');
      setStats(statsResponse.data);
      setNotifications(notificationsResponse.data);
      setDrivers(driversResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getNextPickupDays = () => 3;
  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const getModalTitle = () => {
    const titles = {
      notifications: 'Notifications',
      users: 'System Users',
      reports: 'System Reports',
      route: "Today's Route",
      collections: 'Collections Done',
      weight: 'Weight Breakdown',
      remaining: 'Remaining Collections',
      drivers: 'Active Drivers',
      health: 'System Health',
      myCollections: 'My Collections',
      nextPickup: 'Next Pickup Schedule',
      recycling: 'My Recycling',
      ecoPoints: 'Eco Points'
    };
    return titles[activeModal] || '';
  };

  const getModalContent = () => {
    if (activeModal === 'notifications') {
      return notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg mb-3">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>
        ))
      );
    }

    if (activeModal === 'drivers') {
      return (
        <div className="space-y-3">
          {drivers.map((driver) => (
            <div key={driver.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {driver.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Collections: {driver.activeCollections}</span>
                <span>Total: {driver.totalCollected}kg</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'users') {
      const users = [
        { name: 'John Kamau', role: 'Driver', status: 'Active' },
        { name: 'Mary Wanjiku', role: 'Driver', status: 'Active' },
        { name: 'Peter Mwangi', role: 'Driver', status: 'Idle' },
        { name: 'Sarah Njeri', role: 'Resident', status: 'Active' }
      ];
      return (
        <div className="space-y-3">
          {users.map((u, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-600">{u.role}</p>
              </div>
              <span className={`text-sm ${u.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{u.status}</span>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'reports') {
      const reports = [
        { type: 'error', title: 'Bin Overflow Alert', msg: 'Bin #12 in Westlands is full', time: '2 hours ago' },
        { type: 'warning', title: 'Route Delay', msg: 'Truck T002 is 30 mins behind schedule', time: '1 hour ago' },
        { type: 'success', title: 'Collection Complete', msg: 'CBD route completed successfully', time: '3 hours ago' },
        { type: 'info', title: 'New Registration', msg: '5 new residents registered today', time: '5 hours ago' }
      ];
      return (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className={`p-3 rounded-lg border-l-4 ${
              r.type === 'error' ? 'bg-red-50 border-red-500' :
              r.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              r.type === 'success' ? 'bg-green-50 border-green-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <p className={`font-medium ${
                r.type === 'error' ? 'text-red-800' :
                r.type === 'warning' ? 'text-yellow-800' :
                r.type === 'success' ? 'text-green-800' :
                'text-blue-800'
              }`}>{r.title}</p>
              <p className={`text-sm ${
                r.type === 'error' ? 'text-red-600' :
                r.type === 'warning' ? 'text-yellow-600' :
                r.type === 'success' ? 'text-green-600' :
                'text-blue-600'
              }`}>{r.msg}</p>
              <p className="text-xs text-gray-500">{r.time}</p>
            </div>
          ))}
        </div>
      );
    }

    return <div>Content for {activeModal}</div>;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-primary text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">TakaTrack</h1>
            <p className="opacity-90">
              {user?.role === 'driver' ? 'Driver Dashboard' :
               user?.role === 'admin' ? 'Admin Dashboard' :
               'Resident Dashboard'}
            </p>
          </div>
          <div className="relative">
            <button onClick={() => openModal('notifications')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <div className="text-sm opacity-90">In Progress</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm opacity-90">Completed</div>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {user?.role === 'driver' ? (
            <>
              <button onClick={() => openModal('route')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Route</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('collections')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Collections Done</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.collectedToday}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('weight')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Weight Collected</p>
                    <p className="text-2xl font-bold text-gray-900">245kg</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Recycle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('remaining')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingCollections}</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </button>
            </>
          ) : user?.role === 'admin' ? (
            <>
              <button onClick={() => openModal('users')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('drivers')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Drivers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeDrivers}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('health')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">System Health</p>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('reports')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Reports</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => openModal('myCollections')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">My Collections</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('nextPickup')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Next Pickup</p>
                    <p className="text-2xl font-bold text-gray-900">{getNextPickupDays()}d</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('recycling')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">My Recycling</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recycledWeight}kg</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Recycle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </button>
              <button onClick={() => openModal('ecoPoints')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Eco Points</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </button>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">
            {user?.role === 'driver' ? 'Today\'s Tasks' :
             user?.role === 'admin' ? 'System Alerts' :
             'Recent Activity'}
          </h3>
          {notifications.slice(0, 5).map((notification, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg mb-3">
              <Bell size={16} className="text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
              <button onClick={closeModal} className="text-gray-500">×</button>
            </div>
            <div className="p-4">{getModalContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;