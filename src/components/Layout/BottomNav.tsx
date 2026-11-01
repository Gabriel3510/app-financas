import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';
import { NAV_ITEMS } from './navItems';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { t } = usePreferences();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line flex pb-safe">
      {NAV_ITEMS.map(({ id, shortLabel, icon: Icon }) => (
        <button
          key={id}
          data-tour={`nav-${id}`}
          aria-current={activePage === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
          className={`flex-1 min-w-0 flex flex-col items-center pt-2 pb-1.5 gap-1 text-[11px] font-medium transition-colors ${
            activePage === id ? 'text-accent' : 'text-subtle'
          }`}
        >
          <Icon size={21} />
          <span className="max-w-full truncate px-0.5">{t(shortLabel)}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
