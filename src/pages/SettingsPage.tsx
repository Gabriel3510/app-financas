import React from 'react';
import Settings from '../components/Settings/Settings';

const SettingsPage: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-bold text-gray-800">Configurações</h2>
      <p className="text-sm text-gray-500">Gerencie preferências e dados</p>
    </div>
    <Settings />
  </div>
);

export default SettingsPage;
