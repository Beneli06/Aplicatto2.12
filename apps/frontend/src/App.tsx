import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components';
import { LandingPage } from './views';
import { User, UserRole } from './types';

const App: React.FC = () => {
  // Minimal wiring copied from original App for now
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const handleLogout = () => setCurrentUser(null);
  const handleLoginOpen = () => {}; 

  return (
    <HashRouter>
      <Navbar user={currentUser} onLogout={handleLogout} onLoginClick={handleLoginOpen} />
      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;
