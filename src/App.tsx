import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple routing logic
  if (path === '/admin') {
    return <AdminDashboard />;
  }

  return <ChatInterface />;
}
