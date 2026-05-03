import React from 'react';
import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: 'Transações', icon: <ArrowLeftRight size={20} /> },
  { id: 'charts', label: 'Gráficos', icon: <BarChart2 size={20} /> },
  { id: 'budget', label: 'Orçamento', icon: <Target size={20} /> },
  { id: 'settings', label: 'Config', icon: <Settings size={20} /> },
];

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
    {navItems.map((item) => (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`flex-1 flex flex-col items-center py-2 gap-1 text-xs font-medium transition-colors ${
          activePage === item.id ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        {item.icon}
        {item.label}
      </button>
    ))}
  </nav>
);

export default BottomNav;
