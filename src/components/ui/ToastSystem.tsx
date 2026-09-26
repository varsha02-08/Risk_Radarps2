import { useApp } from '@/store/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconColor: 'text-green-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-600' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-600' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-600' },
};

export default function ToastSystem() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const c = config[toast.type];
        const Icon = c.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 ${c.bg} ${c.border} border rounded-lg shadow-lg px-4 py-3 animate-slide-in-right`}
          >
            <Icon className={`w-5 h-5 ${c.iconColor} flex-shrink-0 mt-0.5`} />
            <p className={`text-sm font-medium ${c.text} flex-1`}>{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} className={`${c.text} opacity-50 hover:opacity-100`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
