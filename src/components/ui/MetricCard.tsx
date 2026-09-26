import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'navy' | 'gray';
  alert?: boolean;
}

const accents = {
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  navy: 'bg-slate-100 text-slate-700',
  gray: 'bg-gray-100 text-gray-600',
};

export default function MetricCard({ label, value, icon: Icon, accent = 'blue', alert }: MetricCardProps) {
  return (
    <div className={`card p-4 ${alert ? 'ring-2 ring-amber-300' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-polar-muted uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-polar-ink mt-1 tabular-nums">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
