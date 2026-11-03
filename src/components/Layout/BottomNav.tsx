import React, { useState } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';
import Sheet from '../UI/Sheet';
import { NAV_ITEMS, PRIMARY_COUNT } from './navItems';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { t } = usePreferences();
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = NAV_ITEMS.slice(0, PRIMARY_COUNT);
  const secondary = NAV_ITEMS.slice(PRIMARY_COUNT);
  const moreActive = secondary.some((item) => item.id === activePage);

  const tabClass = (active: boolean) =>
    `flex-1 min-w-0 flex flex-col items-center pt-2 pb-1.5 gap-1 text-[11px] font-medium transition-colors ${active ? 'text-accent' : 'text-subtle'}`;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line flex pb-safe">
        {primary.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            data-tour={`nav-${id}`}
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
            className={tabClass(activePage === id)}
          >
            <Icon size={21} />
            <span className="max-w-full truncate px-0.5">{t(label)}</span>
          </button>
        ))}
        <button
          data-tour="nav-more"
          aria-haspopup="dialog"
          aria-current={moreActive ? 'page' : undefined}
          onClick={() => setMoreOpen(true)}
          className={tabClass(moreActive)}
        >
          <MoreHorizontal size={21} />
          <span className="max-w-full truncate px-0.5">{t('nav.more')}</span>
        </button>
      </nav>

      {moreOpen && (
        <Sheet title={t('nav.more')} onClose={() => setMoreOpen(false)}>
          <ul className="p-2">
            {secondary.map(({ id, label, hint, icon: Icon }) => (
              <li key={id}>
                <button
                  data-tour={`nav-${id}`}
                  onClick={() => { setMoreOpen(false); onNavigate(id); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${activePage === id ? 'bg-primary-soft' : 'hover:bg-surface-2'}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-surface-2 text-accent flex items-center justify-center flex-shrink-0"><Icon size={20} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold">{t(label)}</span>
                    {hint && <span className="block text-xs text-muted">{t(hint)}</span>}
                  </span>
                  <ChevronRight size={18} className="text-subtle" />
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      )}
    </>
  );
};

export default BottomNav;
