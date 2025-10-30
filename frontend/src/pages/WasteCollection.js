import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Truck, CheckCircle, Clock, Trash2, Package } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const WasteCollection = () => {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ location: '', wasteType: 'general', scheduledDate: '', priority: 'medium' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get('/api/waste/collections');
      setCollections(response.data);
      
      const pending = response.data.filter(c => c.status === 'pending').length;
      const completed = response.data.filter(c => c.status === 'completed').length;
      const inProgress = response.data.filter(c => c.status === 'in_progress').length;
      setStats({ pending, completed, inProgress });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/waste/collections', formData);
      toast.success('Collection scheduled!');
      setShowForm(false);
      setFormData({ location: '', wasteType: 'general', scheduledDate: '', priority: 'medium' });
      loadData();
    } catch (error) {
      toast.error('Failed to schedule collection');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/waste/collections/${id}`, { status });
      toast.success('Status updated!');
      loadData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWasteTypeIcon = (type) => {
    if (type === 'recycling') return <Package className="text-blue-600" size={20} />;
    if (type === 'organic') return <Trash2 className="text-green-600" size={20} />;
    return <Truck className="text-gray-600" size={20} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Waste Collection</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <Plus size={20} />
          </button>
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Schedule Collection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Location (e.g., Home, Office)"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              
              <select
                value={formData.wasteType}
                onChange={(e) => setFormData({...formData, wasteType: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="general">General Waste</option>
                <option value="recyclable">Recyclable</option>
                <option value="organic">Organic</option>
                <option value="hazardous">Hazardous</option>
              </select>

              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />

              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-lg"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-4 -mt-4">
        {collections.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Truck size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Collections Yet</h3>
            <p className="text-gray-500 mb-4">Schedule your first waste collection to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Schedule Collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getWasteTypeIcon(collection.waste_type || collection.bin?.type)}
                      <div>
                        <div className="font-semibold text-gray-800">Collection #{collection.id}</div>
                        <div className="text-sm text-gray-500 capitalize">{collection.waste_type || collection.bin?.type || 'General'} Waste</div>
                        {collection.priority && (
                          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                            collection.priority === 'high' ? 'bg-red-100 text-red-700' :
                            collection.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {collection.priority} priority
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(collection.scheduled_date)}
                      </span>
                    </div>
                    
                    {collection.weight > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{collection.weight}kg collected</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {collection.location || `Lat: ${collection.bin?.latitude?.toFixed(4)}, Lng: ${collection.bin?.longitude?.toFixed(4)}` || 'Location not specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                      {collection.status.replace('_', ' ')}
                    </span>
                    {collection.completed_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed: {formatDate(collection.completed_date)}
                      </div>
                    )}
                  </div>
                </div>
                
                {collection.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => updateStatus(collection.id, 'in_progress')}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Clock size={16} />
                      Start Collection
                    </button>
                    <button
                      onClick={() => updateStatus(collection.id, 'completed')}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Mark Complete
                    </button>
                  </div>
                )}
                
                {collection.status === 'in_progress' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => updateStatus(collection.id, 'completed')}
                      className="w-full py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Complete Collection
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteCollection;