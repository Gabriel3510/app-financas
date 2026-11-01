import React from 'react';
import { Plus } from 'lucide-react';

interface FabProps {
  label: string;
  onClick: () => void;
  tour?: string;
}

const Fab: React.FC<FabProps> = ({ label, onClick, tour }) => (
  <button
    data-tour={tour}
    onClick={onClick}
    aria-label={label}
    className="md:hidden fixed right-4 bottom-above-nav z-30 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors"
  >
    <Plus size={26} />
  </button>
);

export default Fab;
