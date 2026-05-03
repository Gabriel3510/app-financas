import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activePage, onNavigate, children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar activePage={activePage} onNavigate={onNavigate} />
    <div className="flex-1 flex flex-col min-w-0">
      <Header activePage={activePage} />
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">{children}</main>
    </div>
    <BottomNav activePage={activePage} onNavigate={onNavigate} />
  </div>
);

export default Layout;
