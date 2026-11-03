import React, { useCallback, useState } from 'react';
import { PreferencesProvider } from './contexts/PreferencesProvider';
import { FinanceProvider } from './contexts/FinanceProvider';
import { NotificationProvider } from './contexts/NotificationProvider';
import { usePreferences } from './contexts/preferences';
import { useNotifications } from './contexts/notifications';
import Layout from './components/Layout/Layout';
import FirstRunFinish from './components/Tutorial/FirstRunFinish';
import Onboarding from './components/Tutorial/Onboarding';
import Tour from './components/Tutorial/Tour';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import FixedPage from './pages/FixedPage';
import GoalsPage from './pages/GoalsPage';
import LimitsPage from './pages/LimitsPage';
import ChartsPage from './pages/ChartsPage';
import SettingsPage from './pages/SettingsPage';
import type { Page, TransactionType } from './types';

type TutorialStage = 'onboarding' | 'tour' | 'finish' | null;

const Shell: React.FC = () => {
  const { t, tutorialDone, setTutorialDone } = usePreferences();
  const { showToast } = useNotifications();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [transactionFilter, setTransactionFilter] = useState<TransactionType | 'all'>('all');
  const [stage, setStage] = useState<TutorialStage>(tutorialDone ? null : 'onboarding');
  // Only the very first run ends by offering to erase the sample data the tour was shown with
  const [firstRun] = useState(!tutorialDone);

  const navigate = useCallback((page: Page) => {
    setActivePage(page);
    setTransactionFilter('all');
    window.scrollTo(0, 0);
  }, []);

  const openTransactions = useCallback((type: TransactionType) => {
    navigate('transactions');
    setTransactionFilter(type);
  }, [navigate]);

  const endTour = useCallback(() => {
    navigate('dashboard');
    if (firstRun) {
      setStage('finish');
      return;
    }
    setStage(null);
    setTutorialDone(true);
    showToast({ kind: 'success', message: t('tour.done') });
  }, [firstRun, navigate, setTutorialDone, showToast, t]);

  const endFinish = useCallback(() => {
    setStage(null);
    setTutorialDone(true);
  }, [setTutorialDone]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} onOpenTransactions={openTransactions} />;
      case 'transactions': return <TransactionsPage initialType={transactionFilter} />;
      case 'fixed': return <FixedPage />;
      case 'goals': return <GoalsPage />;
      case 'limits': return <LimitsPage />;
      case 'charts': return <ChartsPage />;
      case 'settings': return <SettingsPage onStartTutorial={() => setStage('tour')} />;
    }
  };

  return (
    <>
      <Layout activePage={activePage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
      {stage === 'onboarding' && <Onboarding onDone={() => setStage('tour')} />}
      {stage === 'tour' && <Tour activePage={activePage} onNavigate={navigate} onClose={endTour} />}
      {stage === 'finish' && <FirstRunFinish onDone={endFinish} />}
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
