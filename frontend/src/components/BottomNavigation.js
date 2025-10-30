import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Truck, Recycle, Map, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/collection', icon: Truck, label: 'Collection' },
    { path: '/recycling', icon: Recycle, label: 'Recycling' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="bottom-nav bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              location.pathname === path
                ? 'text-primary bg-primary/10'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;