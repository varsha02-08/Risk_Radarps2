import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { personnelList } from '@/data/mockData';
import { Users, Truck, Radio, Battery, MapPin, Navigation, Activity } from 'lucide-react';

export default function Personnel() {
  const { traverseTeams, triggerEmergency, emergency, setCurrentPage } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Personnel & Traverse Safety</h1>
        <p className="text-sm text-polar-muted mt-1">Monitor field teams, traverse routes, and beacon telemetry across Antarctic operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Total Personnel</p>
              <p className="text-2xl font-bold text-polar-ink mt-1">46</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center"><Users className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Active Teams</p>
              <p className="text-2xl font-bold text-polar-ink mt-1">{traverseTeams.filter((t) => t.status === 'ACTIVE' || t.status === 'EMERGENCY').length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Truck className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Beacons Online</p>
              <p className="text-2xl font-bold text-polar-ink mt-1">{traverseTeams.filter((t) => t.beacon === 'ONLINE').length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><Radio className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Field Personnel</p>
              <p className="text-2xl font-bold text-polar-ink mt-1">{traverseTeams.reduce((sum, t) => sum + t.personnel, 0)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Navigation className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Traverse Map */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
              <MapPin className="w-5 h-5 text-polar-action" />
              Traverse Route Map
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simulated GPS / Beacon Data</span>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 rounded-xl border border-polar-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Antarctica outline */}
              <path d="M 15,30 Q 25,15 45,18 Q 65,15 80,28 Q 88,45 82,62 Q 72,78 50,80 Q 28,78 18,65 Q 12,48 15,30 Z" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="0.5" opacity="0.6" />
              {/* Route lines */}
              <path d="M 28,62 C 35,55 38,52 42,50" fill="none" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="1.5,1" />
              <path d="M 72,35 C 65,38 62,40 58,42" fill="none" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="1.5,1" />
            </svg>

            {/* Station markers */}
            <div className="absolute" style={{ left: '28%', top: '62%' }}>
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-sky-600 ring-2 ring-white shadow-lg" />
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[10px] font-bold text-polar-ink bg-white/90 px-1.5 py-0.5 rounded shadow-sm">Maitri</span>
              </div>
            </div>
            <div className="absolute" style={{ left: '72%', top: '35%' }}>
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-sky-600 ring-2 ring-white shadow-lg" />
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[10px] font-bold text-polar-ink bg-white/90 px-1.5 py-0.5 rounded shadow-sm">Bharati</span>
              </div>
            </div>

            {/* Traverse team markers */}
            {traverseTeams.map((team) => {
              const isEmergency = team.status === 'EMERGENCY' || (emergency.active && emergency.teamId === team.id);
              const color = isEmergency ? 'bg-red-600' : team.status === 'RETURNING' ? 'bg-amber-500' : 'bg-green-500';
              return (
                <div key={team.id} className="absolute transition-all duration-1000" style={{ left: `${team.coordinates.x}%`, top: `${team.coordinates.y}%` }}>
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {isEmergency && <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring" />}
                    <div className={`w-4 h-4 rounded-full ${color} ring-2 ring-white shadow-lg relative z-10`} />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap text-[10px] font-bold text-white bg-polar-navy px-1.5 py-0.5 rounded shadow-sm">
                      {team.name.replace('Traverse Team ', 'Team ')}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg shadow-md px-3 py-2 space-y-1">
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-sky-600" /> Station</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Active</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Returning</div>
              <div className="flex items-center gap-2 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Emergency</div>
            </div>
          </div>
        </div>

        {/* Team details */}
        <div className="space-y-4">
          {traverseTeams.map((team) => {
            const isEmergency = team.status === 'EMERGENCY' || (emergency.active && emergency.teamId === team.id);
            return (
              <div key={team.id} className={`card p-4 ${isEmergency ? 'ring-2 ring-red-400' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-polar-ink">{team.name}</h3>
                  <StatusBadge variant={team.status === 'ACTIVE' ? 'active' : team.status === 'RETURNING' ? 'returning' : team.status === 'EMERGENCY' ? 'emergency' : 'standby'} label={team.status} />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-polar-muted">Vehicle</span><span className="font-semibold text-polar-ink">{team.vehicle}</span></div>
                  <div className="flex justify-between"><span className="text-polar-muted">Personnel</span><span className="font-semibold text-polar-ink">{team.personnel}</span></div>
                  <div className="flex justify-between items-center"><span className="text-polar-muted">Beacon</span><StatusBadge variant={team.beacon === 'ONLINE' ? 'online' : team.beacon === 'DEGRADED' ? 'degraded' : 'offline'} label={team.beacon} /></div>
                  <div className="flex justify-between"><span className="text-polar-muted">Last Telemetry</span><span className="font-mono text-polar-ink">{team.lastTelemetry}</span></div>
                  <div className="flex justify-between items-center"><span className="text-polar-muted">Battery</span><span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-green-500" /><span className="font-semibold text-polar-ink">{team.battery}%</span></span></div>
                  <div className="flex justify-between"><span className="text-polar-muted">Mission</span><span className="font-semibold text-polar-ink">{team.mission}</span></div>
                </div>
                {!isEmergency && (
                  <button onClick={() => triggerEmergency(team.id)} className="btn btn-danger w-full mt-3 text-xs py-2">
                    Simulate Distress
                  </button>
                )}
                {isEmergency && (
                  <button onClick={() => setCurrentPage('emergency')} className="btn btn-danger w-full mt-3 text-xs py-2 animate-pulse">
                    View Emergency
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Personnel table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-polar-border">
          <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
            <Activity className="w-5 h-5 text-polar-action" />
            Personnel Roster
          </h2>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-polar-border">
              <tr>
                {['ID', 'Name', 'Role', 'Station', 'Status', 'Current Mission'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-border">
              {personnelList.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-polar-muted">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-polar-ink">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{p.role}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{p.station}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={p.status === 'Deployed' ? 'active' : p.status === 'Field' ? 'warning' : 'standby'} label={p.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{p.mission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
