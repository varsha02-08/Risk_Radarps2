import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel, danger = true,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-polar-navy/40 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl border border-polar-border animate-slide-up">
        <div className="flex items-start gap-4 p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-polar-ink">{title}</h3>
            <p className="text-sm text-polar-muted mt-1">{message}</p>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel} className="btn btn-secondary flex-1">{cancelLabel}</button>
          <button onClick={onConfirm} className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
