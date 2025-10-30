import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const LiveMapStatus = ({ isConnected, lastUpdate }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (lastUpdate) {
        const now = new Date();
        const diff = Math.floor((now - lastUpdate) / 1000);
        
        if (diff < 60) {
          setTimeAgo(`${diff}s ago`);
        } else {
          setTimeAgo(`${Math.floor(diff / 60)}m ago`);
        }
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <Wifi size={14} className="animate-pulse" />
      ) : (
        <WifiOff size={14} />
      )}
      <span>
        {isConnected ? 'Live' : 'Offline'} {timeAgo && `• ${timeAgo}`}
      </span>
    </div>
  );
};

export default LiveMapStatus;