import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import GoalForm from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';

const GoalsPage: React.FC = () => {
  const { t } = usePreferences();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        subtitle={t('page.goals.sub')}
        action={<button data-tour="add-goal" onClick={() => setShowForm(true)} className="btn-primary flex-shrink-0"><Plus size={16} /> {t('common.add')}</button>}
      />
      <GoalList />
      {showForm && <GoalForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default GoalsPage;
