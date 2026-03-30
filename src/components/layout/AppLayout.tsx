import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * AppLayout — coquille principale de l'application.
 *
 * Structure :
 *   ┌─────────────────────────────────┐
 *   │  Sidebar (fixe, réductible)     │
 *   │  ┌───────────────────────────┐  │
 *   │  │  TopBar (h-14)            │  │
 *   │  ├───────────────────────────┤  │
 *   │  │  <Outlet /> (scrollable)  │  │
 *   │  └───────────────────────────┘  │
 *   └─────────────────────────────────┘
 */
const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">

      {/* Sidebar fixe sur la gauche */}
      <Sidebar />

      {/* Zone de contenu principale */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Barre supérieure */}
        <TopBar />

        {/* Contenu des pages */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AppLayout;
