import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { initialMapMarkers, type MapMarker } from '@/data/mockData';
import {
  Compass, Users, Boxes, Package, AlertTriangle, Siren,
  MapPin, Truck, Navigation, Activity, ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const {
    activeExpeditionCount, totalPersonnel, totalCargo, totalAssets,
    inventoryAlertCount, activeEmergencyCount,
    expeditions, alerts, activity, emergency, setCurrentPage,
  online,
  } = useApp();

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Polar Operations Command Center</h1>
        <p className="text-sm text-polar-muted mt-1">Unified visibility across expeditions, assets, personnel and field operations.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-6 gap-4">
        <MetricCard label="Active Expeditions" value={String(activeExpeditionCount).padStart(2, '0')} icon={Compass} accent="blue" />
        <MetricCard label="Personnel Deployed" value={String(totalPersonnel).padStart(2, '0')} icon={Users} accent="navy" />
        <MetricCard label="Cargo Items" value={String(totalCargo).padStart(3, '0')} icon={Boxes} accent="blue" />
        <MetricCard label="Assets" value={String(totalAssets).padStart(2, '0')} icon={Package} accent="navy" />
        <MetricCard label="Inventory Alerts" value={String(inventoryAlertCount).padStart(2, '0')} icon={AlertTriangle} accent="amber" alert={inventoryAlertCount > 0} />
        <MetricCard label="Active Emergencies" value={String(activeEmergencyCount).padStart(2, '0')} icon={Siren} accent={activeEmergencyCount > 0 ? 'red' : 'gray'} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* A. Operations Map */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <MapPin className="w-5 h-5 text-polar-action" />
              Polar Operations Map
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simulated Map Data</span>
          </div>

          <div className="relative h-80 bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 rounded-xl border border-polar-border overflow-hidden">
            {/* Simplified Antarctica shape */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 15,30 Q 25,15 45,18 Q 65,15 80,28 Q 88,45 82,62 Q 72,78 50,80 Q 28,78 18,65 Q 12,48 15,30 Z"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="0.5"
                opacity="0.6"
              />
              <path
                d="M 30,45 Q 40,38 55,40 Q 65,42 70,50"
                fill="none"
                stroke="#0284C7"
                strokeWidth="0.4"
                strokeDasharray="1.5,1"
                opacity="0.5"
              />
            </svg>

            {/* Markers */}
            {initialMapMarkers.filter((m) => m.x > 0).map((marker) => {
              const colors = {
                station: 'bg-sky-600',
                normal: 'bg-green-500',
                warning: 'bg-amber-500',
                emergency: 'bg-red-600',
              };
              const isEmergency = marker.type === 'emergency' || (emergency.active && marker.id === 'mkr-alpha');
              const colorClass = isEmergency ? 'bg-red-600' : colors[marker.status];

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <div className="relative">
                    {isEmergency && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring" />
                    )}
                    <div className={`w-4 h-4 rounded-full ${colorClass} ring-2 ring-white shadow-lg relative z-10`} />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-semibold text-polar-ink bg-white/90 px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {marker.label}
                  </span>
                </button>
              );
            })}

            {/* Emergency beacon overlay */}
            {emergency.active && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg shadow-lg animate-fade-in">
                <Siren className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Emergency Beacon Active</span>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg shadow-md px-3 py-2 space-y-1">
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-sky-600" /> Station</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Normal</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Emergency</div>
            </div>
          </div>

          {/* Selected marker info */}
          {selectedMarker && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg animate-fade-in">
              <MapPin className="w-5 h-5 text-sky-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-polar-ink">{selectedMarker.label}</p>
                <p className="text-xs text-polar-muted capitalize">{selectedMarker.type} • Status: {selectedMarker.status}</p>
              </div>
              <button onClick={() => setSelectedMarker(null)} className="text-xs text-sky-600 font-semibold hover:underline">Dismiss</button>
            </div>
          )}
        </div>

        {/* C. Operational Alerts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Operational Alerts
            </h2>
            <button onClick={() => setCurrentPage('alerts')} className="text-xs text-polar-action font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {activeAlerts.slice(0, 5).map((alert) => {
              const sevConfig = {
                critical: { variant: 'critical' as const, icon: '🔴' },
                warning: { variant: 'warning' as const, icon: '🟠' },
                info: { variant: 'info' as const, icon: '🟡' },
                success: { variant: 'success' as const, icon: '🟢' },
              };
              const sc = sevConfig[alert.severity];
              return (
                <button
                  key={alert.id}
                  onClick={() => setCurrentPage('alerts')}
                  className="w-full flex items-start gap-2.5 p-3 rounded-lg border border-polar-border hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm">{sc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-polar-ink">{alert.title}</p>
                    <p className="text-xs text-polar-muted mt-0.5 truncate">{alert.description}</p>
                  </div>
                </button>
              );
            })}
            {activeAlerts.length === 0 && (
              <p className="text-sm text-polar-muted text-center py-8">No active alerts.</p>
            )}
          </div>
        </div>
      </div>

      {/* B. Active Expeditions + D. Recent Activity */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <Compass className="w-5 h-5 text-polar-action" />
              Active Expeditions
            </h2>
            <button onClick={() => setCurrentPage('expeditions')} className="text-xs text-polar-action font-semibold hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {expeditions.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setCurrentPage('expeditions')}
                className="flex items-center gap-4 p-4 rounded-lg border border-polar-border hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-6 h-6 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-polar-ink">{exp.name}</p>
                  <p className="text-xs text-polar-muted mt-0.5">
                    Location: {exp.station} • Personnel: {exp.personnel} • Cargo: {exp.cargo} items
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge variant={exp.status === 'ACTIVE' ? 'active' : 'planned'} label={exp.status} />
                  <span className="text-xs text-polar-muted">{exp.missionType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-polar-ink flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-polar-action" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {activity.slice(0, 8).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-polar-ink">{act.message}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{act.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection status banner */}
      {!online && (
        <div className="card p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Siren className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">Satellite link lost. Local edge mode active.</p>
              <p className="text-xs text-red-600">All actions are queued locally. Visit the Sync Center to restore connection.</p>
            </div>
            <button onClick={() => setCurrentPage('sync')} className="btn btn-primary ml-auto">
              Go to Sync Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
