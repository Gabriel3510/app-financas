import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import Modal from './Modal';

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, body, confirmLabel, onConfirm, onClose }) => {
  const { t } = usePreferences();

  return (
    <Modal title={title} onClose={onClose}>
      <div className="p-5 space-y-5">
        <p className="text-sm text-muted">{body}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn-danger flex-1">
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
