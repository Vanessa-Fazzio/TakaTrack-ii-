import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Truck, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import LiveMapStatus from '../components/LiveMapStatus';

const MapView = () => {
  const [bins, setBins] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchMapData();
    getCurrentLocation();
    
    
    const interval = setInterval(() => {
      fetchMapData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMapData = async () => {
    try {
      const binsRes = await api.get('/api/waste/bins');
      setBins(binsRes.data);
      
      
      setTrucks([
        { id: 'T001', driver: 'John Kamau', status: 'collecting', collectionsToday: 12, lat: -1.2900, lng: 36.8200 },
        { id: 'T002', driver: 'Mary Wanjiku', status: 'en route', collectionsToday: 8, lat: -1.2850, lng: 36.8250 },
        { id: 'T003', driver: 'Peter Mwangi', status: 'idle', collectionsToday: 15, lat: -1.3000, lng: 36.8300 }
      ]);
      
      setIsConnected(true);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching map data:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'full': return 'bg-red-500';
      case 'half': return 'bg-yellow-500';
      case 'empty': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredBins = bins.filter(bin => {
    if (filter === 'all') return true;
    return bin.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Map View</h1>
          <button className="p-2 bg-primary text-white rounded-full">
            <Navigation size={20} />
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'full', 'half', 'empty'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {status === 'all' ? 'All Bins' : `${status.charAt(0).toUpperCase() + status.slice(1)} Bins`}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-80 m-4 rounded-xl overflow-hidden border-2 border-gray-200">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
        
        {/* Map Header */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <LiveMapStatus isConnected={isConnected} lastUpdate={lastUpdate} />
          <p className="text-xs text-gray-600 mt-2">Showing {filteredBins.length} bins</p>
        </div>
        
        {/* Refresh Button */}
        <button 
          onClick={fetchMapData}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <RefreshCw size={16} className="text-gray-600" />
        </button>
        
        {/* Dynamic Waste Bins */}
        {filteredBins.map((bin, index) => {
          const positions = [
            { top: '20%', left: '25%' },
            { top: '35%', left: '65%' },
            { top: '55%', left: '30%' },
            { top: '70%', left: '75%' },
            { top: '40%', left: '45%' },
            { top: '25%', left: '80%' },
            { top: '60%', left: '15%' },
            { top: '80%', left: '50%' }
          ];
          const pos = positions[index % positions.length];
          
          return (
            <div 
              key={bin.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className={`w-4 h-4 rounded-full ${getStatusColor(bin.status)} shadow-lg animate-pulse group-hover:scale-125 transition-transform`}></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {bin.type} - {bin.status}
              </div>
            </div>
          );
        })}
        
        {/* Truck Locations */}
        {trucks.map((truck, index) => {
          const truckPositions = [
            { top: '40%', left: '35%' },
            { top: '65%', left: '60%' },
            { top: '30%', left: '50%' }
          ];
          const pos = truckPositions[index % truckPositions.length];
          
          return (
            <div 
              key={truck.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                <Truck size={12} className="text-white" />
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {truck.id} - {truck.status}
              </div>
            </div>
          );
        })}
        
        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path 
            d="M 20% 15% Q 50% 30% 70% 30% Q 80% 45% 25% 60%" 
            stroke="url(#routeGradient)" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="mx-4 mb-4 bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Full Bins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Half Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Empty Bins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Collection Trucks</span>
          </div>
        </div>
      </div>

      {/* Bins List */}
      <div className="mx-4 space-y-3">
        <h3 className="font-semibold">Nearby Bins</h3>
        {filteredBins.map((bin) => (
          <div key={bin.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="font-medium">Bin #{bin.id}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Type: {bin.type}
                </p>
                <p className="text-sm text-gray-600">
                  Coordinates: {bin.latitude?.toFixed(4)}, {bin.longitude?.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(bin.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(bin.status)} mb-2`}></div>
                <span className="text-xs text-gray-500 capitalize">{bin.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Trucks */}
      {trucks.length > 0 && (
        <div className="mx-4 mt-6 space-y-3">
          <h3 className="font-semibold">Active Trucks</h3>
          {trucks.map((truck) => (
            <div key={truck.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Truck size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Truck #{truck.id}</p>
                  <p className="text-sm text-gray-600">Driver: {truck.driver}</p>
                  <p className="text-sm text-gray-600">Status: {truck.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {truck.collectionsToday} collections
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;