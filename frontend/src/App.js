import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteCollection from './pages/WasteCollection';
import RecyclingTracker from './pages/RecyclingTracker';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import BottomNavigation from './components/BottomNavigation';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/" replace /> : <Register />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/collection" element={
          <ProtectedRoute>
            <WasteCollection />
          </ProtectedRoute>
        } />
        <Route path="/recycling" element={
          <ProtectedRoute>
            <RecyclingTracker />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
      
      {user && <BottomNavigation />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;