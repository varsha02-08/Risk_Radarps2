import type { ReactNode } from 'react';

type Variant = 'normal' | 'warning' | 'critical' | 'info' | 'success' | 'emergency' | 'planned' | 'active' | 'returning' | 'standby' | 'offline' | 'online' | 'degraded' | 'queued' | 'transmitting' | 'synced' | 'failed' | 'stored' | 'ready' | 'scheduled' | 'returned' | 'overdue';

const styles: Record<Variant, string> = {
  normal: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  critical: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  emergency: 'bg-red-100 text-red-800 border border-red-300',
  planned: 'bg-blue-50 text-blue-700 border border-blue-200',
  active: 'bg-green-50 text-green-700 border border-green-200',
  returning: 'bg-amber-50 text-amber-700 border border-amber-200',
  standby: 'bg-gray-100 text-gray-600 border border-gray-200',
  offline: 'bg-red-50 text-red-700 border border-red-200',
  online: 'bg-green-50 text-green-700 border border-green-200',
  degraded: 'bg-amber-50 text-amber-700 border border-amber-200',
  queued: 'bg-gray-100 text-gray-700 border border-gray-200',
  transmitting: 'bg-blue-50 text-blue-700 border border-blue-200',
  synced: 'bg-green-50 text-green-700 border border-green-200',
  failed: 'bg-red-50 text-red-700 border border-red-200',
  stored: 'bg-gray-100 text-gray-700 border border-gray-200',
  ready: 'bg-amber-50 text-amber-700 border border-amber-200',
  scheduled: 'bg-blue-50 text-blue-700 border border-blue-200',
  returned: 'bg-green-50 text-green-700 border border-green-200',
  overdue: 'bg-red-50 text-red-700 border border-red-200',
};

const dotColors: Record<Variant, string> = {
  normal: 'bg-green-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  info: 'bg-blue-500',
  success: 'bg-green-500',
  emergency: 'bg-red-600',
  planned: 'bg-blue-500',
  active: 'bg-green-500',
  returning: 'bg-amber-500',
  standby: 'bg-gray-400',
  offline: 'bg-red-500',
  online: 'bg-green-500',
  degraded: 'bg-amber-500',
  queued: 'bg-gray-400',
  transmitting: 'bg-blue-500',
  synced: 'bg-green-500',
  failed: 'bg-red-500',
  stored: 'bg-gray-400',
  ready: 'bg-amber-500',
  scheduled: 'bg-blue-500',
  returned: 'bg-green-500',
  overdue: 'bg-red-500',
};

interface StatusBadgeProps {
  variant: Variant;
  label?: string;
  dot?: boolean;
  children?: ReactNode;
}

export default function StatusBadge({ variant, label, dot = true, children }: StatusBadgeProps) {
  return (
    <span className={`badge ${styles[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {label ?? children}
    </span>
  );
}
