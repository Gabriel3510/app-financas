import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatMonth } from '../../utils/formatters';
import { format, addMonths, parseISO } from 'date-fns';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transações',
  charts: 'Gráficos',
  budget: 'Orçamento',
  settings: 'Configurações',
};

interface HeaderProps {
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const changeMonth = (delta: number) => {
    const date = parseISO(`${currentMonth}-01`);
    const newDate = addMonths(date, delta);
    setCurrentMonth(format(newDate, 'yyyy-MM'));
  };

  const showMonthNav = ['dashboard', 'transactions', 'budget'].includes(activePage);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{pageTitles[activePage] || 'App Finanças'}</h2>
      {showMonthNav && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700 w-24 text-center capitalize">
            {formatMonth(currentMonth)}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
