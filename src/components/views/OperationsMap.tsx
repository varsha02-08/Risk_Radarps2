import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { initialMapMarkers, type MapMarker } from '@/data/mockData';
import { MapPin, Navigation, Truck, Siren, Building2 } from 'lucide-react';

export default function OperationsMap() {
  const { emergency, traverseTeams } = useApp();
  const [selected, setSelected] = useState<MapMarker | null>(null);

  const markers = initialMapMarkers.filter((m) => m.x > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Operations Map</h1>
        <p className="text-sm text-polar-muted mt-1">Geographic overview of stations, field teams, cargo routes, and emergency beacons.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Map */}
        <div className="col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <MapPin className="w-5 h-5 text-polar-action" />
              Antarctic Operations Overview
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simulated Map Data</span>
          </div>

          <div className="relative h-[500px] bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 rounded-xl border border-polar-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 15,30 Q 25,15 45,18 Q 65,15 80,28 Q 88,45 82,62 Q 72,78 50,80 Q 28,78 18,65 Q 12,48 15,30 Z" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="0.5" opacity="0.6" />
              {/* Routes */}
              <path d="M 28,62 C 35,55 38,52 42,50" fill="none" stroke="#0284C7" strokeWidth="0.4" strokeDasharray="1.5,1" />
              <path d="M 72,35 C 65,38 62,40 58,42" fill="none" stroke="#0284C7" strokeWidth="0.4" strokeDasharray="1.5,1" />
              <path d="M 28,62 C 38,68 44,72 50,70" fill="none" stroke="#16A34A" strokeWidth="0.4" strokeDasharray="1.5,1" />
            </svg>

            {markers.map((marker) => {
              const isEmergency = marker.type === 'emergency' || (emergency.active && marker.id === 'mkr-alpha');
              const colors = {
                station: 'bg-sky-600',
                normal: 'bg-green-500',
                warning: 'bg-amber-500',
                emergency: 'bg-red-600',
              };
              const colorClass = isEmergency ? 'bg-red-600' : colors[marker.status];
              const sizes = { station: 'w-6 h-6', traverse: 'w-5 h-5', cargo: 'w-4 h-4', emergency: 'w-5 h-5' };
              const Icons = { station: Building2, traverse: Navigation, cargo: Truck, emergency: Siren };
              const Icon = Icons[marker.type];

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelected(marker)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <div className="relative">
                    {isEmergency && <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring" />}
                    <div className={`${sizes[marker.type]} ${colorClass} ring-2 ring-white shadow-lg rounded-full flex items-center justify-center relative z-10`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-semibold text-polar-ink bg-white/90 px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {marker.label}
                  </span>
                </button>
              );
            })}

            {/* Emergency overlay */}
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
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-polar-ink mb-3">Map Markers</h3>
            <div className="space-y-2">
              {markers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${selected?.id === m.id ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${m.status === 'station' ? 'bg-sky-600' : m.status === 'normal' ? 'bg-green-500' : m.status === 'warning' ? 'bg-amber-500' : 'bg-red-600'}`} />
                  <span className="text-xs font-semibold text-polar-ink">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="card p-4 animate-fade-in">
              <h3 className="text-sm font-bold text-polar-ink mb-2">{selected.label}</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-polar-muted">Type</span><span className="font-semibold text-polar-ink capitalize">{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-polar-muted">Status</span><StatusBadge variant={selected.status === 'station' ? 'info' : selected.status === 'normal' ? 'normal' : selected.status === 'warning' ? 'warning' : 'emergency'} label={selected.status} /></div>
                <div className="flex justify-between"><span className="text-polar-muted">Position</span><span className="font-mono text-polar-ink">{selected.x.toFixed(0)}%, {selected.y.toFixed(0)}%</span></div>
              </div>
              {selected.type === 'traverse' && (
                <div className="mt-3 pt-3 border-t border-polar-border">
                  <p className="text-xs text-polar-muted">Live telemetry data available in Personnel section.</p>
                </div>
              )}
            </div>
          )}

          {/* Active teams summary */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-polar-ink mb-3">Active Traverse Teams</h3>
            <div className="space-y-2">
              {traverseTeams.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-polar-ink">{t.name.replace('Traverse Team ', 'Team ')}</span>
                  <StatusBadge variant={t.status === 'ACTIVE' ? 'active' : t.status === 'RETURNING' ? 'returning' : t.status === 'EMERGENCY' ? 'emergency' : 'standby'} label={t.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
