import React from 'react';
import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: 'Transações', icon: <ArrowLeftRight size={20} /> },
  { id: 'charts', label: 'Gráficos', icon: <BarChart2 size={20} /> },
  { id: 'budget', label: 'Orçamento', icon: <Target size={20} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => (
  <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
    <div className="p-6 border-b border-gray-200">
      <h1 className="text-xl font-bold text-blue-600">💰 App Finanças</h1>
      <p className="text-xs text-gray-500 mt-1">Controle financeiro pessoal</p>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activePage === item.id
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
