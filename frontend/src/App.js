import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteCollection from './pages/WasteCollection';
import RecyclingTracker from './pages/RecyclingTracker';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mobile-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
          <BottomNavigation />
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;