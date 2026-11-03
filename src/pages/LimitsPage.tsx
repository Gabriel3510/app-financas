import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import BudgetForm from '../components/Budget/BudgetForm';
import BudgetList from '../components/Budget/BudgetList';

const LimitsPage: React.FC = () => {
  const { t } = usePreferences();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        subtitle={t('page.limits.sub')}
        action={<button data-tour="add-limit" onClick={() => setShowForm(true)} className="btn-primary flex-shrink-0"><Plus size={16} /> {t('common.add')}</button>}
      />
      <BudgetList />
      {showForm && <BudgetForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default LimitsPage;
