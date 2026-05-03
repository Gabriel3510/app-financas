import React, { useState } from 'react';
import { FinanceProvider } from './contexts/FinanceContext';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ChartsPage from './pages/ChartsPage';
import BudgetPage from './pages/BudgetPage';
import SettingsPage from './pages/SettingsPage';

type Page = 'dashboard' | 'transactions' | 'charts' | 'budget' | 'settings';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const navigate = (page: string) => setActivePage(page as Page);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} />;
      case 'transactions': return <TransactionsPage />;
      case 'charts': return <ChartsPage />;
      case 'budget': return <BudgetPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <FinanceProvider>
      <Layout activePage={activePage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
    </FinanceProvider>
  );
};

export default App;
