import React, { useState, useEffect } from 'react';
import { Bell, Truck, Recycle, MapPin, TrendingUp, Users, Shield } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    totalBins: 0, 
    collectedToday: 0, 
    recycledWeight: 0, 
    pendingCollections: 0, 
    activeDrivers: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to TakaTrack', message: 'Your dashboard is ready!', type: 'info', time: 'Just now' }
  ]);
  const [drivers, setDrivers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [recyclingRecords, setRecyclingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [statsResponse, notificationsResponse, driversResponse, collectionsResponse, recyclingResponse] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/notifications'),
        api.get('/api/drivers'),
        api.get('/api/waste/collections'),
        api.get('/api/recycling/records')
      ]);
      setStats(statsResponse.data);
      setNotifications(notificationsResponse.data.length > 0 ? notificationsResponse.data : [
        { id: 1, title: 'Welcome to TakaTrack', message: 'Your dashboard is ready!', type: 'info', time: 'Just now' }
      ]);
      setDrivers(driversResponse.data);
      setCollections(collectionsResponse.data || []);
      setRecyclingRecords(recyclingResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load dashboard data. Using demo data.');
      // Set demo data if API calls fail
      setStats({ 
        totalBins: 15, 
        collectedToday: 8, 
        recycledWeight: 45.2, 
        pendingCollections: 3, 
        activeDrivers: 3,
        completed: 5,
        pending: 3,
        inProgress: 2
      });
      setNotifications([
        { id: 1, title: 'Demo Mode', message: 'Dashboard running in demo mode', type: 'info', time: 'Just now' },
        { id: 2, title: 'Collection Completed', message: 'Westlands route completed', type: 'success', time: '2 hours ago' }
      ]);
      setDrivers([
        { id: 1, name: 'John Kamau', phone: '+254701234567', email: 'john@demo.com', activeCollections: 2, totalCollected: 125.5, status: 'active' },
        { id: 2, name: 'Mary Wanjiku', phone: '+254712345678', email: 'mary@demo.com', activeCollections: 1, totalCollected: 89.2, status: 'active' }
      ]);
    }
    setLoading(false);
  };

  // Helper functions to get consistent data counts
  const getMyCollectionsData = () => {
    const userCollections = collections.filter(c => c.user_id === user?.id) || [];
    return userCollections.length > 0 ? userCollections : [
      { id: 1, location: `${user?.name || 'My'} Home - Westlands`, waste_type: 'General Waste', status: 'completed', weight: 15.5, created_at: 'Today 08:30' },
      { id: 2, location: `${user?.name || 'My'} Office - CBD`, waste_type: 'Recycling', status: 'completed', weight: 8.2, created_at: 'Yesterday 16:45' },
      { id: 3, location: `${user?.name || 'My'} Apartment - Kilimani`, waste_type: 'Organic Waste', status: 'in_progress', weight: 0, created_at: 'Tomorrow' }
    ];
  };

  const getMyRecyclingData = () => {
    const userRecycling = recyclingRecords.filter(r => r.user_id === user?.id) || [];
    return userRecycling.length > 0 ? userRecycling : [
      { id: 1, material: 'Plastic Bottles', weight: 5.2, location: 'Recycling Center - Westlands', environmental_impact: 10.4, createdAt: 'Today' },
      { id: 2, material: 'Paper & Cardboard', weight: 8.5, location: 'Recycling Center - CBD', environmental_impact: 12.75, createdAt: 'Yesterday' },
      { id: 3, material: 'Glass Bottles', weight: 3.8, location: 'Recycling Center - Kilimani', environmental_impact: 1.9, createdAt: '2 days ago' },
      { id: 4, material: 'Electronic Waste', weight: 4.9, location: 'E-Waste Center', environmental_impact: 19.6, createdAt: 'Last week' }
    ];
  };

  const getNextPickupData = () => {
    return [
      { id: 1, location: `${user?.name || 'My'} Home - Westlands`, type: 'General Waste', date: 'Tomorrow', time: '08:00 AM', status: 'Confirmed' },
      { id: 2, location: `${user?.name || 'My'} Office - CBD`, type: 'Recycling', date: 'Friday', time: '02:00 PM', status: 'Scheduled' }
    ];
  };

  const getEcoPointsData = () => {
    const recyclingData = getMyRecyclingData();
    return [
      { activity: 'Recycled Plastic Bottles', points: '+52', date: 'Today', impact: '10.4kg CO2 saved' },
      { activity: 'Recycled Paper & Cardboard', points: '+85', date: 'Yesterday', impact: '12.75kg CO2 saved' },
      { activity: 'Proper Waste Sorting', points: '+15', date: '2 days ago', impact: 'Helped sorting efficiency' }
    ];
  };

  const getNextPickupDays = () => 3;
  const openModal = (type) => {
    console.log('Opening modal:', type);
    setActiveModal(type);
  };
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
    console.log('Getting content for modal:', activeModal);
    
    // RESIDENT MODALS - Show consistent data
    if (activeModal === 'myCollections') {
      const displayCollections = getMyCollectionsData();
      
      return (
        <div className="space-y-3">
          {displayCollections.slice(0, 5).map((collection, index) => (
            <div key={collection.id || index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-blue-800">{collection.location}</p>
                  <p className="text-sm text-blue-600">{collection.waste_type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  collection.status === 'completed' ? 'bg-green-100 text-green-800' :
                  collection.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {collection.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-blue-600">
                <span>Weight: {collection.weight || 0}kg</span>
                <span>{collection.created_at || collection.scheduled_date}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Driver: John Kamau</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'recycling') {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-green-800">Plastic Bottles</p>
                <p className="text-sm text-green-600">Recycling Center - Westlands</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-800">5.2kg</p>
                <p className="text-xs text-green-600">+52 pts</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>10.4kg CO2 saved</span>
              <span>Today</span>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-green-800">Paper & Cardboard</p>
                <p className="text-sm text-green-600">Recycling Center - CBD</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-800">8.5kg</p>
                <p className="text-xs text-green-600">+85 pts</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>12.75kg CO2 saved</span>
              <span>Yesterday</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === 'nextPickup') {
      const displayPickups = getNextPickupData();
      
      return (
        <div className="space-y-3">
          <div className="bg-orange-100 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium text-orange-800">Next Pickup: Tomorrow at 8:00 AM</p>
            <p className="text-xs text-orange-600">General waste collection at your home</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-orange-800">My Home - Westlands</p>
                <p className="text-sm text-orange-600">General Waste</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Confirmed</span>
            </div>
            <div className="flex justify-between text-sm text-orange-600">
              <span>Tomorrow at 08:00 AM</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Driver: John Kamau</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-orange-800">My Office - CBD</p>
                <p className="text-sm text-orange-600">Recycling</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Scheduled</span>
            </div>
            <div className="flex justify-between text-sm text-orange-600">
              <span>Friday at 02:00 PM</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Driver: Mary Wanjiku</p>
          </div>
        </div>
      );
    }

    if (activeModal === 'ecoPoints') {
      const recyclingData = getMyRecyclingData();
      const totalPoints = Math.round(recyclingData.reduce((sum, r) => sum + (r.environmental_impact * 10), 0));
      const pointsHistory = getEcoPointsData();
      
      return (
        <div className="space-y-3">
          <div className="bg-green-100 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-800">Current Level: Eco Warrior</p>
                <p className="text-xs text-green-600">73 points to next level</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-800">🌱</p>
              </div>
            </div>
          </div>
          {pointsHistory.map((item, i) => (
            <div key={i} className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-green-800">{item.activity}</p>
                <span className="text-sm font-bold text-green-600">{item.points}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{item.impact}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // DRIVER MODALS
    if (activeModal === 'route') {
      const todaysRoute = [
        { id: 1, location: 'Westlands Shopping Mall', time: '08:00', status: 'completed', weight: '15.5kg' },
        { id: 2, location: 'Sarit Centre', time: '09:30', status: 'completed', weight: '8.2kg' },
        { id: 3, location: 'Karen Shopping Centre', time: '11:00', status: 'in_progress', weight: 'Pending' },
        { id: 4, location: 'Yaya Centre', time: '13:00', status: 'pending', weight: 'Pending' },
        { id: 5, location: 'Junction Mall', time: '14:30', status: 'pending', weight: 'Pending' },
        { id: 6, location: 'Village Market', time: '16:00', status: 'pending', weight: 'Pending' },
        { id: 7, location: 'Two Rivers Mall', time: '17:30', status: 'pending', weight: 'Pending' },
        { id: 8, location: 'Galleria Mall', time: '19:00', status: 'pending', weight: 'Pending' }
      ];
      return (
        <div className="space-y-3">
          {todaysRoute.map((stop) => (
            <div key={stop.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{stop.location}</p>
                  <p className="text-sm text-gray-600">Scheduled: {stop.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stop.status === 'completed' ? 'bg-green-100 text-green-800' :
                  stop.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stop.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600">Weight: {stop.weight}</p>
            </div>
          ))}
        </div>
      );
    }







    // ADMIN MODALS


    if (activeModal === 'drivers') {
      const activeDriversData = [
        { id: 1, name: 'John Kamau', phone: '+254701234567', collections: 2, total: '125.5kg', status: 'active' },
        { id: 2, name: 'Mary Wanjiku', phone: '+254712345678', collections: 1, total: '89.2kg', status: 'active' },
        { id: 3, name: 'Peter Mwangi', phone: '+254723456789', collections: 3, total: '156.8kg', status: 'active' }
      ];
      return (
        <div className="space-y-3">
          {activeDriversData.map((driver) => (
            <div key={driver.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">{driver.status}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Collections: {driver.collections}</span>
                <span>Total: {driver.total}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }





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



    if (activeModal === 'users') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">John Kamau</p>
              <p className="text-sm text-gray-600">Driver</p>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Mary Wanjiku</p>
              <p className="text-sm text-gray-600">Driver</p>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Peter Mwangi</p>
              <p className="text-sm text-gray-600">Driver</p>
            </div>
            <span className="text-sm text-yellow-600">Idle</span>
          </div>

        </div>
      );
    }

    if (activeModal === 'reports') {
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border-l-4 bg-red-50 border-red-500">
            <p className="font-medium text-red-800">Bin Overflow Alert</p>
            <p className="text-sm text-red-600">Bin #12 in Westlands is full</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="p-3 rounded-lg border-l-4 bg-yellow-50 border-yellow-500">
            <p className="font-medium text-yellow-800">Route Delay</p>
            <p className="text-sm text-yellow-600">Truck T002 is 30 mins behind schedule</p>
            <p className="text-xs text-gray-500">1 hour ago</p>
          </div>
          <div className="p-3 rounded-lg border-l-4 bg-green-50 border-green-500">
            <p className="font-medium text-green-800">Collection Complete</p>
            <p className="text-sm text-green-600">CBD route completed successfully</p>
            <p className="text-xs text-gray-500">3 hours ago</p>
          </div>

        </div>
      );
    }



    if (activeModal === 'collections') {
      const completedCount = stats.completed || 5;
      const completedCollections = [
        { location: 'Westlands Shopping Mall', time: '08:30', weight: '15.5kg', type: 'General Waste' },
        { location: 'Sarit Centre', time: '10:15', weight: '8.2kg', type: 'Recycling' },
        { location: 'CBD Area', time: '16:45', weight: '25.8kg', type: 'General Waste' },
        { location: 'Kilimani', time: '18:20', weight: '14.2kg', type: 'Recycling' },
        { location: 'Karen Shopping Centre', time: '14:30', weight: '12.3kg', type: 'Organic Waste' }
      ].slice(0, completedCount);
      return (
        <div className="space-y-3">
          {completedCollections.map((collection, i) => (
            <div key={i} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-800">{collection.location}</p>
                  <p className="text-sm text-green-600">{collection.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-800">{collection.weight}</p>
                  <p className="text-xs text-green-600">{collection.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'weight') {
      const weightData = [
        { type: 'General Waste', weight: '53.5kg', percentage: 45 },
        { type: 'Recycling', weight: '22.4kg', percentage: 30 },
        { type: 'Organic Waste', weight: '12.3kg', percentage: 15 },
        { type: 'Electronic Waste', weight: '6.8kg', percentage: 10 }
      ];
      return (
        <div className="space-y-4">
          {weightData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{item.type}</span>
                <span className="text-sm text-gray-600">{item.weight}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'remaining') {
      const pendingCount = stats.pendingCollections || stats.pending || 3;
      const remainingCollections = [
        { location: 'Yaya Centre', time: '13:00', priority: 'High', type: 'General Waste' },
        { location: 'Junction Mall', time: '14:30', priority: 'Medium', type: 'Recycling' },
        { location: 'Village Market', time: '16:00', priority: 'Medium', type: 'General Waste' },
        { location: 'Two Rivers Mall', time: '17:30', priority: 'High', type: 'Recycling' },
        { location: 'Galleria Mall', time: '19:00', priority: 'Low', type: 'Organic Waste' }
      ].slice(0, pendingCount);
      return (
        <div className="space-y-3">
          {remainingCollections.map((collection, i) => (
            <div key={i} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-orange-800">{collection.location}</p>
                  <p className="text-sm text-orange-600">{collection.type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  collection.priority === 'High' ? 'bg-red-100 text-red-800' :
                  collection.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {collection.priority}
                </span>
              </div>
              <p className="text-sm text-orange-600">Scheduled: {collection.time}</p>
            </div>
          ))}
        </div>
      );
    }












    
    return <div className="text-center py-4 text-gray-500">No content available</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-primary text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">TakaTrack</h1>
            <p className="opacity-90">
              {user?.role === 'driver' || user?.email?.includes('driver') ? 'Driver Dashboard' :
               user?.role === 'admin' || user?.email?.includes('admin') ? 'Admin Dashboard' :
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
            <div className="text-2xl font-bold">{stats.pending || 3}</div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.inProgress || 2}</div>
            <div className="text-sm opacity-90">In Progress</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{stats.completed || 5}</div>
            <div className="text-sm opacity-90">Completed</div>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {user?.role === 'driver' || user?.email?.includes('driver') ? (
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
                    <p className="text-2xl font-bold text-gray-900">{stats.completed || stats.collectedToday || 5}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingCollections || stats.pending || 3}</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </button>
            </>
          ) : user?.role === 'admin' || user?.email?.includes('admin') ? (
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
                    <p className="text-2xl font-bold text-gray-900">3</p>
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
                    <p className="text-2xl font-bold text-gray-900">{getMyCollectionsData().length}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{getMyRecyclingData().reduce((sum, r) => sum + r.weight, 0).toFixed(1)}kg</p>
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
                    <p className="text-2xl font-bold text-gray-900">{Math.round(getMyRecyclingData().reduce((sum, r) => sum + (r.environmental_impact * 10), 0))}</p>
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
            {user?.role === 'driver' || user?.email?.includes('driver') ? 'Today\'s Tasks' :
             user?.role === 'admin' || user?.email?.includes('admin') ? 'System Alerts' :
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