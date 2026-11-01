import React from 'react';
import type { Page } from '../../types';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activePage, onNavigate, children }) => (
  <div className="flex min-h-dvh bg-canvas">
    <Sidebar activePage={activePage} onNavigate={onNavigate} />
    <div className="flex-1 flex flex-col min-w-0">
      <Header activePage={activePage} onNavigate={onNavigate} />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 pb-32 md:p-6">{children}</main>
    </div>
    <BottomNav activePage={activePage} onNavigate={onNavigate} />
  </div>
);

export default Layout;
