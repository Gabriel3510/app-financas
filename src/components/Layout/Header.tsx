import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import { getCurrentMonth, shiftMonth } from '../../utils/formatters';
import type { Page } from '../../types';
import { NAV_ITEMS } from './navItems';
import Logo from '../UI/Logo';
import NotificationCenter from './NotificationCenter';

const MonthNav: React.FC = () => {
  const { currentMonth, setCurrentMonth } = useFinance();
  const { t, month } = usePreferences();

  return (
    <div data-tour="month-nav" className="flex items-center justify-center gap-1">
      <button onClick={() => setCurrentMonth(shiftMonth(currentMonth, -1))} aria-label={t('month.previous')} className="hero-btn">
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrentMonth(getCurrentMonth())}
        title={t('month.today')}
        className="text-sm font-medium w-28 text-center capitalize py-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
      >
        {month(currentMonth)}
      </button>
      <button onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))} aria-label={t('month.next')} className="hero-btn">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const { t, isDark, setTheme } = usePreferences();
  const page = NAV_ITEMS.find((item) => item.id === activePage);
  const showMonthNav = activePage !== 'settings';

  return (
    <header className="sticky top-0 z-30 bg-hero text-on-hero pt-safe">
      <div className="flex items-center justify-between gap-2 pl-4 pr-2 md:px-6 py-1.5 md:py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Logo size={30} className="md:hidden flex-shrink-0" />
          <h1 className="text-lg font-bold truncate">{page ? t(page.label) : t('app.name')}</h1>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {showMonthNav && <div className="hidden sm:block mr-2"><MonthNav /></div>}
          <button
            data-tour="theme-toggle"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={t('theme.toggle')}
            title={t('theme.toggle')}
            className="hero-btn"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <NotificationCenter onNavigate={onNavigate} />
        </div>
      </div>
      {showMonthNav && (
        <div className="sm:hidden pb-0.5"><MonthNav /></div>
      )}
    </header>
  );
};

export default Header;
