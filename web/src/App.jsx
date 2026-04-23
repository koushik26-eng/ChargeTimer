import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import CalculatorPage from '@/pages/CalculatorPage';
import ProfileManagementPage from '@/pages/ProfileManagementPage';
import { WifiOff } from 'lucide-react';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {!isOnline && (
        <div className="fixed top-4 right-4 z-50 glass-card rounded-lg px-4 py-2 flex items-center gap-2 border border-destructive/20 bg-destructive/10">
          <WifiOff className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Offline</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/profiles" element={<ProfileManagementPage />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-6">Page not found</p>
                <a href="/" className="text-primary hover:underline">
                  Back to home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;