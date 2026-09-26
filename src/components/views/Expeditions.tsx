import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import {
  Compass, Users, Boxes, Package, MapPin, Truck,
  Shield, AlertTriangle, Calendar, Route,
} from 'lucide-react';

export default function Expeditions() {
  const { expeditions, cargo, inventory } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = expeditions.find((e) => e.id === selectedId);

  const expCargo = selected ? cargo.filter((c) => c.destination === selected.station || c.origin === selected.station).slice(0, 8) : [];
  const expInventory = selected ? inventory.filter((i) => i.station === selected.station.replace(' Station', '')).slice(0, 8) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Expedition Management</h1>
        <p className="text-sm text-polar-muted mt-1">Plan, monitor, and manage polar research and logistics expeditions.</p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-polar-border">
              <tr>
                {['Expedition Name', 'Station', 'Mission Type', 'Start Date', 'End Date', 'Personnel', 'Cargo', 'Status', 'Risk', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-border">
              {expeditions.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedId(exp.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Compass className="w-4.5 h-4.5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-polar-ink">{exp.name}</p>
                        <p className="text-xs text-gray-400">{exp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-polar-ink">{exp.station}</td>
                  <td className="px-4 py-3 text-sm text-polar-ink">{exp.missionType}</td>
                  <td className="px-4 py-3 text-sm text-polar-muted font-mono">{exp.startDate}</td>
                  <td className="px-4 py-3 text-sm text-polar-muted font-mono">{exp.endDate}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-polar-ink">{exp.personnel}</td>
                  <td className="px-4 py-3 text-sm text-polar-ink">{exp.cargo} items</td>
                  <td className="px-4 py-3"><StatusBadge variant={exp.status === 'ACTIVE' ? 'active' : 'planned'} label={exp.status} /></td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={exp.riskLevel === 'LOW' ? 'normal' : exp.riskLevel === 'MODERATE' ? 'warning' : exp.riskLevel === 'HIGH' ? 'critical' : 'emergency'}
                      label={exp.riskLevel}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-polar-action font-semibold hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelectedId(null)} title={selected?.name ?? ''} maxWidth="max-w-4xl"
        icon={<div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><Compass className="w-5 h-5 text-sky-600" /></div>}
      >
        {selected && (
          <div className="space-y-6">
            {/* Status bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant={selected.status === 'ACTIVE' ? 'active' : 'planned'} label={selected.status} />
              <StatusBadge variant={selected.riskLevel === 'LOW' ? 'normal' : selected.riskLevel === 'MODERATE' ? 'warning' : 'critical'} label={`Risk: ${selected.riskLevel}`} />
              <span className="text-xs text-polar-muted font-mono">{selected.id}</span>
            </div>

            {/* Mission Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">Mission Overview</p>
                <p className="text-sm text-polar-ink">{selected.overview}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-polar-border">
                <p className="text-xs font-bold text-polar-muted uppercase tracking-wider mb-2">Route</p>
                <div className="flex items-center gap-2 text-sm text-polar-ink">
                  <Route className="w-4 h-4 text-polar-action" />
                  {selected.route}
                </div>
                <div className="flex items-center gap-2 text-sm text-polar-ink mt-2">
                  <Calendar className="w-4 h-4 text-polar-action" />
                  {selected.startDate} → {selected.endDate}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <Users className="w-5 h-5 text-polar-action mx-auto mb-2" />
                <p className="text-2xl font-bold text-polar-ink">{selected.personnel}</p>
                <p className="text-xs text-polar-muted">Personnel</p>
              </div>
              <div className="card p-4 text-center">
                <Boxes className="w-5 h-5 text-polar-action mx-auto mb-2" />
                <p className="text-2xl font-bold text-polar-ink">{selected.cargo}</p>
                <p className="text-xs text-polar-muted">Cargo Items</p>
              </div>
              <div className="card p-4 text-center">
                <Package className="w-5 h-5 text-polar-action mx-auto mb-2" />
                <p className="text-2xl font-bold text-polar-ink">{expInventory.length}</p>
                <p className="text-xs text-polar-muted">Inventory Items</p>
              </div>
              <div className="card p-4 text-center">
                <MapPin className="w-5 h-5 text-polar-action mx-auto mb-2" />
                <p className="text-2xl font-bold text-polar-ink">{selected.station}</p>
                <p className="text-xs text-polar-muted">Station</p>
              </div>
            </div>

            {/* Emergency & Compliance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-polar-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Compliance Status</p>
                </div>
                <p className="text-sm font-semibold text-polar-ink">{selected.complianceStatus}</p>
              </div>
              <div className="p-4 rounded-lg border border-polar-border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Emergency Status</p>
                </div>
                <p className="text-sm font-semibold text-polar-ink">{selected.emergencyStatus}</p>
              </div>
            </div>

            {/* Cargo preview */}
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider mb-2">Associated Cargo</p>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-polar-border">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-bold text-polar-muted">ID</th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-polar-muted">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-polar-muted">Priority</th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-polar-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-polar-border">
                    {expCargo.map((c) => (
                      <tr key={c.id}>
                        <td className="px-3 py-2 text-xs font-mono text-polar-muted">{c.id}</td>
                        <td className="px-3 py-2 text-xs text-polar-ink">{c.description}</td>
                        <td className="px-3 py-2 text-xs text-polar-ink">{c.priority}</td>
                        <td className="px-3 py-2 text-xs text-polar-ink">{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
