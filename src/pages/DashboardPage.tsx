import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../contexts/finance';
import { usePreferences } from '../contexts/preferences';
import type { TranslationKey } from '../i18n/translations';
import type { Page, TransactionType } from '../types';
import { getCurrentMonth } from '../utils/formatters';
import SummaryCards from '../components/Dashboard/SummaryCards';
import BudgetAlerts from '../components/Dashboard/BudgetAlerts';
import FixedOverview from '../components/Dashboard/FixedOverview';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import TodayOverview from '../components/Dashboard/TodayOverview';
import TransactionForm from '../components/Transactions/TransactionForm';
import ExpensesPieChart from '../components/Charts/ExpensesPieChart';
import Fab from '../components/UI/Fab';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onOpenTransactions: (type: TransactionType) => void;
}

const greetingKey = (hour: number): TranslationKey => {
  if (hour < 12) return 'greeting.morning';
  return hour < 19 ? 'greeting.afternoon' : 'greeting.evening';
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenTransactions }) => {
  const { t, userName } = usePreferences();
  const { currentMonth } = useFinance();
  const [hour] = useState(() => new Date().getHours());
  const [thisMonth] = useState(getCurrentMonth);
  const [showForm, setShowForm] = useState(false);
  const isThisMonth = currentMonth === thisMonth;
  const name = userName.trim();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className={`bg-hero text-on-hero -mx-4 -mt-4 md:mx-0 md:mt-0 md:rounded-2xl px-4 md:px-6 pt-3 md:pt-5 flex items-center justify-between gap-3 ${isThisMonth ? 'pb-14' : 'pb-5'}`}>
        <div className="min-w-0">
          <p className="text-2xl font-bold">{t(greetingKey(hour))}{name ? `, ${name}` : ''}!</p>
          <p className="text-sm opacity-80">{t('page.dashboard.sub')}</p>
        </div>
        <button data-tour="add-transaction" onClick={() => setShowForm(true)} className="btn hidden md:inline-flex bg-on-hero text-hero hover:opacity-90 flex-shrink-0">
          <Plus size={16} /> {t('tx.new')}
        </button>
      </div>
      {isThisMonth && (
        <div className="!-mt-10 md:!mt-[-3.25rem] md:mx-4 relative">
          <TodayOverview onOpenTransactions={onOpenTransactions} />
        </div>
      )}
      <SummaryCards
        onOpenTransactions={onOpenTransactions}
        onOpenCharts={() => onNavigate('charts')}
        onOpenGoals={() => onNavigate('goals')}
      />
      <FixedOverview onOpen={() => onNavigate('fixed')} />
      <BudgetAlerts onOpen={() => onNavigate('limits')} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card p-4 md:p-5 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{t('charts.byCategory')}</h2>
            <button onClick={() => onNavigate('charts')} className="text-sm font-medium text-accent hover:underline py-1">{t('recent.viewAll')}</button>
          </div>
          <ExpensesPieChart />
        </div>
        <RecentTransactions onNavigate={onNavigate} />
      </div>
      <Fab tour="add-transaction" label={t('tx.new')} onClick={() => setShowForm(true)} />
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default DashboardPage;
