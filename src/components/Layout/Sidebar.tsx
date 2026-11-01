import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';
import Logo from '../UI/Logo';
import { NAV_ITEMS } from './navItems';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { t } = usePreferences();

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-surface border-r border-line h-dvh sticky top-0 overflow-y-auto">
      <div className="px-5 py-5 flex items-center gap-3">
        <Logo size={38} className="flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold leading-tight">{t('app.name')}</p>
          <p className="text-xs text-subtle truncate">{t('app.tagline')}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            data-tour={`nav-${id}`}
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activePage === id
                ? 'bg-primary-soft text-accent'
                : 'text-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icon size={20} />
            {t(label)}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
