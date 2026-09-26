import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  icon?: ReactNode;
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl', icon }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-polar-navy/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative ${maxWidth} w-full bg-white rounded-2xl shadow-2xl border border-polar-border max-h-[90vh] overflow-hidden flex flex-col animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-polar-border">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-bold text-polar-ink">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
