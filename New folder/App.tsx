import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Background } from './components/Background';
import { GamePage } from './pages/GamePage';
import { AdminPage } from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen text-kawaii-text font-body overflow-hidden relative">
        <Background />
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;