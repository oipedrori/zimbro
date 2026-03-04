import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Statistics from './pages/Statistics'; // Added Statistics import
import Limits from './pages/Limits';
import Wallet from './pages/Wallet';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import InstallPrompt from './components/InstallPrompt';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', color: 'var(--primary-color)' }}>Carregando...</div>;
  }

  return currentUser ? children : <Navigate to="/onboarding" />;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/onboarding" element={currentUser ? <Navigate to="/" /> : <Onboarding />} />

      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Home />} />
        <Route path="statistics" element={<Statistics />} /> {/* Added Statistics route */}
        <Route path="limits" element={<Limits />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('zimbro_theme') || 'system';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.remove('theme-dark', 'theme-light');
    }
  }, []);

  return (
    <AuthProvider>
      <InstallPrompt />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
