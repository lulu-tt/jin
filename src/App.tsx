import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState(window.location.hash === '#/admin' ? 'admin' : 'chat');

  useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash === '#/admin' ? 'admin' : 'chat');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple routing logic based on Hash
  if (view === 'admin') {
    return <AdminDashboard />;
  }

  return <ChatInterface />;
}
