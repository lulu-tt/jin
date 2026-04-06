import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState(window.location.hash === '#/admin' ? 'admin' : 'chat');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash === '#/admin' ? 'admin' : 'chat');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (view === 'admin') {
    return <AdminDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  return <ChatInterface isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
}
