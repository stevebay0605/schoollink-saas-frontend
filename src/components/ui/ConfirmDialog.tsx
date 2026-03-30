import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible. Voulez-vous continuer ?',
  confirmLabel = 'Supprimer',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="flex flex-col items-center text-center gap-4">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
        <AlertTriangle size={28} className="text-red-500" aria-hidden="true" />
      </div>

      {/* Text */}
      <div>
        <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <Button
          variant="ghost"
          onClick={onClose}
          fullWidth
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={loading}
          fullWidth
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
