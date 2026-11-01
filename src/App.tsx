import React, { useCallback, useState } from 'react';
import { PreferencesProvider } from './contexts/PreferencesProvider';
import { FinanceProvider } from './contexts/FinanceProvider';
import { NotificationProvider } from './contexts/NotificationProvider';
import { usePreferences } from './contexts/preferences';
import { useNotifications } from './contexts/notifications';
import Layout from './components/Layout/Layout';
import Tour from './components/Tutorial/Tour';
import Onboarding from './components/Tutorial/Onboarding';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ChartsPage from './pages/ChartsPage';
import BudgetPage from './pages/BudgetPage';
import type { GoalsTab } from './pages/BudgetPage';
import SettingsPage from './pages/SettingsPage';
import type { Page, TransactionType } from './types';

const Shell: React.FC = () => {
  const { t, tutorialDone, setTutorialDone } = usePreferences();
  const { showToast } = useNotifications();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [goalsTab, setGoalsTab] = useState<GoalsTab>('goals');
  const [transactionFilter, setTransactionFilter] = useState<TransactionType | 'all'>('all');
  const [tutorial, setTutorial] = useState<'welcome' | 'tour' | null>(tutorialDone ? null : 'welcome');

  const navigate = useCallback((page: Page) => {
    setActivePage(page);
    setGoalsTab('goals');
    setTransactionFilter('all');
    window.scrollTo(0, 0);
  }, []);

  const openGoalsTab = useCallback((tab: GoalsTab) => {
    navigate('budget');
    setGoalsTab(tab);
  }, [navigate]);

  const openTransactions = useCallback((type: TransactionType) => {
    navigate('transactions');
    setTransactionFilter(type);
  }, [navigate]);

  const finishTour = useCallback(() => {
    setTutorial(null);
    setTutorialDone(true);
    navigate('dashboard');
    showToast({ kind: 'success', message: t('tour.done') });
  }, [setTutorialDone, navigate, showToast, t]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} onOpenGoalsTab={openGoalsTab} onOpenTransactions={openTransactions} />;
      case 'transactions': return <TransactionsPage initialType={transactionFilter} />;
      case 'charts': return <ChartsPage />;
      case 'budget': return <BudgetPage tab={goalsTab} onTabChange={setGoalsTab} />;
      case 'settings': return <SettingsPage onStartTutorial={() => setTutorial('tour')} />;
    }
  };

  return (
    <>
      <Layout activePage={activePage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
      {tutorial === 'welcome' && <Onboarding onDone={() => setTutorial('tour')} />}
      {tutorial === 'tour' && <Tour activePage={activePage} onNavigate={navigate} onClose={finishTour} />}
    </>
  );
};

const App: React.FC = () => (
  <PreferencesProvider>
    <FinanceProvider>
      <NotificationProvider>
        <Shell />
      </NotificationProvider>
    </FinanceProvider>
  </PreferencesProvider>
);

export default App;
