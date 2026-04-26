import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { useUIStore } from '@/stores/uiStore';
import { useThemeInit } from '@/hooks/useThemeInit';
import { useAuth } from '@/hooks/useAuth';

const AppContent: React.FC = () => {
  const { showLanding, setShowLanding } = useUIStore();
  const { user, loading } = useAuth();
  useThemeInit();

  useEffect(() => {
    if (!loading) {
      setShowLanding(!user);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
        <div className="text-sm opacity-60">Loading…</div>
      </div>
    );
  }

  return showLanding ? <LoginPage /> : <WorkspacePage />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
