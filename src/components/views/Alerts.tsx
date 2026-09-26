import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, XCircle, Info, Bell,
  Package, Thermometer, Users, Siren, Boxes, Leaf, Wifi,
} from 'lucide-react';
import type { AlertItem } from '@/data/mockData';

const categoryIcons: Record<string, typeof Package> = {
  Inventory: Package,
  'Cold Chain': Thermometer,
  Personnel: Users,
  Emergency: Siren,
  Cargo: Boxes,
  Compliance: Leaf,
  Connectivity: Wifi,
};

const severityConfig = {
  critical: { variant: 'critical' as const, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  warning: { variant: 'warning' as const, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  info: { variant: 'info' as const, icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { variant: 'success' as const, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
};

export default function Alerts() {
  const { alerts, acknowledgeAlert, dismissAlert, unreadAlertCount } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [filter, setFilter] = useState('all');

  const visibleAlerts = alerts.filter((a) => !a.dismissed);
  const filtered = filter === 'all' ? visibleAlerts : visibleAlerts.filter((a) => a.severity === filter);

  const counts = {
    all: visibleAlerts.length,
    critical: visibleAlerts.filter((a) => a.severity === 'critical').length,
    warning: visibleAlerts.filter((a) => a.severity === 'warning').length,
    info: visibleAlerts.filter((a) => a.severity === 'info').length,
  success: visibleAlerts.filter((a) => a.severity === 'success').length,
  unread: unreadAlertCount,
  acknowledged: alerts.filter((a) => a.acknowledged).length,
  dismissed: alerts.filter((a) => a.dismissed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-polar-ink">Alert Center</h1>
          <p className="text-sm text-polar-muted mt-1">Unified view of all operational alerts across the platform.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <Bell className="w-4 h-4 text-red-600" />
          <span className="text-sm font-semibold text-red-700">{unreadAlertCount} Unread</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Active', value: counts.all, color: 'text-polar-ink', bg: 'bg-gray-100' },
          { label: 'Critical', value: counts.critical, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Warning', value: counts.warning, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Info', value: counts.info, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Acknowledged', value: counts.acknowledged, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold text-polar-muted uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['all', 'critical', 'warning', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              filter === f ? 'bg-polar-action text-white' : 'bg-white border border-polar-border text-polar-muted hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-polar-ink">No alerts in this category.</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const sc = severityConfig[alert.severity];
            const Icon = sc.icon;
            const CatIcon = categoryIcons[alert.category] ?? Bell;
            return (
              <div key={alert.id} className={`card p-4 ${!alert.read ? 'ring-1 ring-sky-200' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${sc.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-polar-ink">{alert.title}</p>
                      <StatusBadge variant={sc.variant} label={alert.severity} dot={false} />
                      {alert.acknowledged && <StatusBadge variant="success" label="ACK" dot={false} />}
                    </div>
                    <p className="text-sm text-polar-muted">{alert.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><CatIcon className="w-3 h-3" /> {alert.category}</span>
                      <span className="font-mono">{alert.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setSelectedAlert(alert)} className="btn btn-secondary px-3 py-1.5 text-xs">Details</button>
                    {!alert.acknowledged && (
                      <button onClick={() => acknowledgeAlert(alert.id)} className="btn btn-primary px-3 py-1.5 text-xs">Acknowledge</button>
                    )}
                    <button onClick={() => dismissAlert(alert.id)} className="btn btn-ghost px-3 py-1.5 text-xs">Dismiss</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!selectedAlert} onClose={() => setSelectedAlert(null)} title="Alert Details" maxWidth="max-w-lg"
        icon={<div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><Bell className="w-5 h-5 text-sky-600" /></div>}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge variant={severityConfig[selectedAlert.severity].variant} label={selectedAlert.severity} />
              <StatusBadge variant="info" label={selectedAlert.category} dot={false} />
            </div>
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase">Title</p>
              <p className="text-sm font-semibold text-polar-ink">{selectedAlert.title}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase">Description</p>
              <p className="text-sm text-polar-ink">{selectedAlert.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-polar-muted">Timestamp</p><p className="font-mono text-polar-ink text-xs">{selectedAlert.timestamp}</p></div>
              <div><p className="text-xs text-polar-muted">Status</p><p className="font-semibold text-polar-ink">{selectedAlert.acknowledged ? 'Acknowledged' : 'Unacknowledged'}</p></div>
            </div>
            <div className="flex gap-3 pt-2">
              {!selectedAlert.acknowledged && (
                <button onClick={() => { acknowledgeAlert(selectedAlert.id); setSelectedAlert(null); }} className="btn btn-primary flex-1">Acknowledge</button>
              )}
              <button onClick={() => { dismissAlert(selectedAlert.id); setSelectedAlert(null); }} className="btn btn-secondary flex-1">Dismiss</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
