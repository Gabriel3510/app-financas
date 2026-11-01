import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import BudgetList from '../components/Budget/BudgetList';
import BudgetForm from '../components/Budget/BudgetForm';
import FixedForm from '../components/Fixed/FixedForm';
import FixedList from '../components/Fixed/FixedList';
import GoalForm from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';
import Segmented from '../components/UI/Segmented';

export type GoalsTab = 'goals' | 'fixed' | 'limits';

interface BudgetPageProps {
  tab: GoalsTab;
  onTabChange: (tab: GoalsTab) => void;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ tab, onTabChange }) => {
  const { t } = usePreferences();
  const [showForm, setShowForm] = useState(false);

  const addLabel = { goals: t('goals.new'), fixed: t('fixed.new'), limits: t('budget.new') }[tab];

  return (
    <div className="space-y-4">
      <PageHeader subtitle={t('page.budget.sub')} />
      <div data-tour="budget-tabs">
        <Segmented
          label={t('nav.budget')}
          value={tab}
          onChange={onTabChange}
          options={[
            { value: 'goals', label: t('goals.tab') },
            { value: 'fixed', label: t('fixed.tab') },
            { value: 'limits', label: t('goals.limitsTab') },
          ]}
        />
      </div>
      <button onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto">
        <Plus size={16} /> {addLabel}
      </button>
      {tab === 'goals' && <GoalList />}
      {tab === 'fixed' && <FixedList />}
      {tab === 'limits' && <BudgetList />}
      {showForm && tab === 'goals' && <GoalForm onClose={() => setShowForm(false)} />}
      {showForm && tab === 'fixed' && <FixedForm onClose={() => setShowForm(false)} />}
      {showForm && tab === 'limits' && <BudgetForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default BudgetPage;
