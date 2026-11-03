import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import FixedForm from '../components/Fixed/FixedForm';
import FixedList from '../components/Fixed/FixedList';

const FixedPage: React.FC = () => {
  const { t } = usePreferences();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        subtitle={t('page.fixed.sub')}
        action={<button data-tour="add-fixed" onClick={() => setShowForm(true)} className="btn-primary flex-shrink-0"><Plus size={16} /> {t('common.add')}</button>}
      />
      <FixedList />
      {showForm && <FixedForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default FixedPage;
