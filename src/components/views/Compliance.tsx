import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { useMemo } from 'react';
import {
  Leaf, Trash2, CheckCircle2, AlertCircle, ShieldCheck,
  FileWarning, Calendar, Package,
} from 'lucide-react';
import type { WasteStatus } from '@/data/mockData';

const wasteStatusVariants: Record<WasteStatus, 'stored' | 'ready' | 'scheduled' | 'returned' | 'overdue'> = {
  'STORED': 'stored',
  'READY FOR RETURN': 'ready',
  'SCHEDULED': 'scheduled',
  'RETURNED': 'returned',
  'OVERDUE': 'overdue',
};

export default function Compliance() {
  const { waste, checklist, toggleChecklistItem, updateWasteStatus } = useApp();

  const completed = checklist.filter((c) => c.completed).length;
  const total = checklist.length;
  const readiness = Math.round((completed / total) * 100);
  const remaining = total - completed;
  const criticalItems = checklist.filter((c) => c.critical);
  const criticalCompleted = criticalItems.filter((c) => c.completed).length;
  const criticalRemaining = criticalItems.length - criticalCompleted;

  const wasteStats = useMemo(() => {
    const returned = waste.filter((w) => w.status === 'RETURNED').length;
    const overdue = waste.filter((w) => w.status === 'OVERDUE').length;
    const ready = waste.filter((w) => w.status === 'READY FOR RETURN').length;
    const stored = waste.filter((w) => w.status === 'STORED').length;
    const scheduled = waste.filter((w) => w.status === 'SCHEDULED').length;
    return { returned, overdue, ready, stored, scheduled };
  }, [waste]);

  const complianceProgress = Math.round((wasteStats.returned / waste.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Treaty & Compliance Center</h1>
        <p className="text-sm text-polar-muted mt-1">Environmental compliance and operational safety under the Antarctic Treaty System (ATS Annex III).</p>
      </div>

      {/* Compliance progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            ATS Annex III Waste Return Compliance
          </h2>
          <span className="text-2xl font-bold text-green-600">{complianceProgress}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${complianceProgress}%` }} />
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4">
          <div className="text-center"><p className="text-lg font-bold text-gray-600">{wasteStats.stored}</p><p className="text-xs text-polar-muted">Stored</p></div>
          <div className="text-center"><p className="text-lg font-bold text-amber-600">{wasteStats.ready}</p><p className="text-xs text-polar-muted">Ready</p></div>
          <div className="text-center"><p className="text-lg font-bold text-blue-600">{wasteStats.scheduled}</p><p className="text-xs text-polar-muted">Scheduled</p></div>
          <div className="text-center"><p className="text-lg font-bold text-green-600">{wasteStats.returned}</p><p className="text-xs text-polar-muted">Returned</p></div>
          <div className="text-center"><p className="text-lg font-bold text-red-600">{wasteStats.overdue}</p><p className="text-xs text-polar-muted">Overdue</p></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Waste tracker */}
        <div className="col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-polar-border">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-polar-action" />
              ATS Annex III Waste Tracker
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-polar-border">
                <tr>
                  {['Waste ID', 'Category', 'Quantity', 'Station', 'Target Return Date', 'Status', 'Update'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-border">
                {waste.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-polar-muted">{w.id}</td>
                    <td className="px-4 py-3 text-xs text-polar-ink">{w.category}</td>
                    <td className="px-4 py-3 text-xs text-polar-ink">{w.quantity}</td>
                    <td className="px-4 py-3 text-xs text-polar-ink">{w.station}</td>
                    <td className="px-4 py-3 text-xs font-mono text-polar-muted">{w.targetReturnDate}</td>
                    <td className="px-4 py-3"><StatusBadge variant={wasteStatusVariants[w.status]} label={w.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={w.status}
                        onChange={(e) => updateWasteStatus(w.id, e.target.value as WasteStatus)}
                        className="text-xs border border-polar-border rounded-lg px-2 py-1 bg-white text-polar-ink focus:outline-none focus:ring-1 focus:ring-polar-action"
                      >
                        {['STORED', 'READY FOR RETURN', 'SCHEDULED', 'RETURNED', 'OVERDUE'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checklist */}
        <div className="card p-5">
          <h2 className="text-base font-bold text-polar-ink flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-polar-action" />
            Operational Safety Checklist
          </h2>

          {/* Readiness gauge */}
          <div className="text-center mb-5">
            <div className="relative inline-flex items-center justify-center w-32 h-32">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r="56" fill="none" stroke={readiness >= 80 ? '#16A34A' : readiness >= 50 ? '#F59E0B' : '#DC2626'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(readiness / 100) * 351.86} 351.86`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-polar-ink">{readiness}%</p>
                <p className="text-[10px] text-polar-muted uppercase">Readiness</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{completed}</p>
              <p className="text-[10px] text-polar-muted uppercase">Completed</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <p className="text-lg font-bold text-amber-600">{remaining}</p>
              <p className="text-[10px] text-polar-muted uppercase">Remaining</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <p className="text-lg font-bold text-red-600">{criticalRemaining}</p>
              <p className="text-[10px] text-polar-muted uppercase">Critical</p>
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-polar-border hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm flex-1 ${item.completed ? 'text-polar-muted line-through' : 'text-polar-ink font-medium'}`}>
                  {item.label}
                </span>
                {item.critical && !item.completed && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue warning */}
      {wasteStats.overdue > 0 && (
        <div className="card p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <FileWarning className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-bold text-red-800">{wasteStats.overdue} waste record(s) OVERDUE for return.</p>
              <p className="text-xs text-red-600">ATS Annex III requires removal of all waste from Antarctica. Immediate scheduling required.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
