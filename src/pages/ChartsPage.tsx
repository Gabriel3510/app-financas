import React from 'react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import ExpensesPieChart from '../components/Charts/ExpensesPieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';
import BalanceLineChart from '../components/Charts/BalanceLineChart';

const ChartsPage: React.FC = () => {
  const { t } = usePreferences();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader subtitle={t('page.charts.sub')} />
      <div data-tour="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card p-4 md:p-5 min-w-0">
          <h2 className="font-semibold mb-4">{t('charts.byCategory')}</h2>
          <ExpensesPieChart />
        </div>
        <div className="card p-4 md:p-5 min-w-0">
          <h2 className="font-semibold mb-4">{t('charts.history')}</h2>
          <MonthlyBarChart />
        </div>
      </div>
      <div className="card p-4 md:p-5 min-w-0">
        <h2 className="font-semibold mb-4">{t('charts.balance')}</h2>
        <BalanceLineChart />
      </div>
    </div>
  );
};

export default ChartsPage;
