import React, { useRef, useState } from 'react';
import { Download, Upload, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { AppData, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316','#6B7280'];
const ICONS = ['📦','🌟','🔧','🏋️','🎯','🎪','🎸','🍕','🍺','💻','🎓','🏆'];

const Settings: React.FC = () => {
  const {
    setSalary, currentMonth, getSalaryForMonth,
    exportData, importData, resetData,
    customCategories, addCustomCategory, deleteCustomCategory,
  } = useFinance();

  const [salaryInput, setSalaryInput] = useState(String(getSalaryForMonth(currentMonth) || ''));
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatColor, setNewCatColor] = useState('#3B82F6');
  const [newCatType, setNewCatType] = useState<Category['type']>('expense');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(salaryInput.replace(',', '.'));
    if (!isNaN(val) && val > 0) setSalary(currentMonth, val);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppData;
        importData(data);
      } catch {
        alert('Arquivo inválido');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCustomCategory({ name: newCatName, icon: newCatIcon, color: newCatColor, type: newCatType });
    setNewCatName('');
  };

  const currentSalary = getSalaryForMonth(currentMonth);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Salary */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">💰 Salário do Mês</h3>
        <p className="text-sm text-gray-500 mb-3">
          {currentSalary > 0 ? `Salário atual: ${formatCurrency(currentSalary)}` : 'Nenhum salário definido'}
        </p>
        <form onSubmit={handleSalary} className="flex gap-3">
          <input
            type="number"
            placeholder="Valor do salário"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            step="0.01"
            min="0.01"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Definir
          </button>
        </form>
      </div>

      {/* Custom Categories */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">🏷️ Categorias Personalizadas</h3>
        <form onSubmit={handleAddCategory} className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
            className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Ícone:</span>
            <select value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-sm">
              {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Cor:</span>
            <div className="flex gap-1 flex-wrap">
              {COLORS.slice(0,5).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  className={`w-5 h-5 rounded-full border-2 ${newCatColor === c ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Tipo:</span>
            <select value={newCatType} onChange={(e) => setNewCatType(e.target.value as Category['type'])} className="border border-gray-200 rounded px-2 py-1 text-sm">
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="both">Ambos</option>
            </select>
          </div>
          <button type="submit" className="col-span-2 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Adicionar Categoria
          </button>
        </form>
        {customCategories.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">Nenhuma categoria personalizada</p>
        ) : (
          <div className="space-y-2">
            {customCategories.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: c.color + '30' }}>
                  {c.icon}
                </div>
                <span className="flex-1 text-sm text-gray-700">{c.name}</span>
                <button onClick={() => deleteCustomCategory(c.id)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data management */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">💾 Dados</h3>
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} className="text-blue-500" />
            Exportar backup (JSON)
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} className="text-green-500" />
            Importar backup (JSON)
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={() => {
              if (window.confirm('Tem certeza? Todos os dados serão resetados para os dados de exemplo.')) {
                resetData();
              }
            }}
            className="w-full flex items-center gap-3 p-3 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <RefreshCw size={18} />
            Resetar todos os dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
