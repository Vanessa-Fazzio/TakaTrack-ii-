import React, { useState, useEffect } from 'react';
import { Plus, Recycle, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecyclingTracker = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ totalWeight: 0, carbonSaved: 0, treesEquivalent: 0 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ material: 'plastic', weight: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const recordsResponse = await axios.get('http://localhost:5003/api/recycling/records');
      const statsResponse = await axios.get('http://localhost:5003/api/recycling/stats');
      setRecords(recordsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5003/api/recycling/records', formData);
      toast.success('Record added!');
      setShowForm(false);
      setFormData({ material: 'plastic', weight: '', location: '' });
      loadData();
    } catch (error) {
      toast.error('Failed to add record');
    }
  };

  const getMaterialColor = (material) => {
    if (material === 'plastic') return 'bg-blue-100 text-blue-800';
    if (material === 'paper') return 'bg-green-100 text-green-800';
    if (material === 'glass') return 'bg-purple-100 text-purple-800';
    if (material === 'metal') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Recycling Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white p-2 rounded-full"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-green-500 to-primary rounded-xl p-6 text-white mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award size={20} />
            Environmental Impact
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalWeight}kg</p>
              <p className="text-sm opacity-90">Total Recycled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.carbonSaved}kg</p>
              <p className="text-sm opacity-90">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.treesEquivalent}</p>
              <p className="text-sm opacity-90">Trees Saved</p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold mb-4">Add Recycling Record</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="metal">Metal</option>
                  <option value="electronic">Electronic</option>
                </select>

                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                  step="0.1"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />

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
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Records</h3>
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle size={16} className="text-primary" />
                    <span className="font-medium capitalize">{record.material}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getMaterialColor(record.material)}`}>
                      {record.material}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Weight: {record.weight}kg
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Location: {record.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">
                      +{(record.weight * 2.1).toFixed(1)}kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecyclingTracker;