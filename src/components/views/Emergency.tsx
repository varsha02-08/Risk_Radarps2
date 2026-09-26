import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import {
  Siren, AlertTriangle, Radio, Battery, MapPin, Users,
  Truck, Shield, Activity, CheckCircle2, FileText, Eye,
} from 'lucide-react';

export default function Emergency() {
  const { emergency, triggerEmergency, acknowledgeEmergency, clearEmergency, traverseTeams, setCurrentPage } = useApp();
  const [incidentOpen, setIncidentOpen] = useState(false);

  const telemetryLines = emergency.telemetryPayload ? emergency.telemetryPayload.split(' ').reduce((acc: string[], hex, i) => {
    const lineIdx = Math.floor(i / 8);
    if (!acc[lineIdx]) acc[lineIdx] = '';
    acc[lineIdx] += (acc[lineIdx] ? ' ' : '') + hex;
    return acc;
  }, []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Emergency / Distress Center</h1>
        <p className="text-sm text-polar-muted mt-1">Monitor and respond to distress beacons and emergency situations in the field.</p>
      </div>

      {/* Emergency banner */}
      {emergency.active ? (
        <div className="card p-0 overflow-hidden ring-2 ring-red-500 animate-fade-in">
          <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
            <Siren className="w-6 h-6 animate-pulse" />
            <div>
              <p className="text-lg font-bold tracking-wide">PRIORITY EMERGENCY</p>
              <p className="text-sm text-red-100">Distress beacon active — immediate response required</p>
            </div>
            <div className="ml-auto">
              <StatusBadge variant="emergency" label="CRITICAL" dot={true} />
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Emergency details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-polar-border">
                  <p className="text-xs font-bold text-polar-muted uppercase mb-2">Team</p>
                  <p className="text-lg font-bold text-polar-ink">{emergency.teamName}</p>
                  <p className="text-sm text-polar-muted">{emergency.vehicle}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-polar-border">
                    <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-polar-action" /><span className="text-xs text-polar-muted">Personnel</span></div>
                    <p className="text-lg font-bold text-polar-ink">{emergency.personnel}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-polar-border">
                    <div className="flex items-center gap-2 mb-1"><Battery className="w-4 h-4 text-green-500" /><span className="text-xs text-polar-muted">Battery</span></div>
                    <p className="text-lg font-bold text-polar-ink">{emergency.battery}%</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-polar-border">
                  <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-red-500" /><span className="text-xs text-polar-muted">Simulated Coordinates</span></div>
                  <p className="text-sm font-mono text-polar-ink">{emergency.coordinates}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-polar-border">
                  <div className="flex items-center gap-2 mb-1"><Radio className="w-4 h-4 text-amber-500" /><span className="text-xs text-polar-muted">Beacon / Telemetry</span></div>
                  <p className="text-sm text-polar-ink">Beacon: <span className="font-semibold text-amber-600">DEGRADED</span></p>
                  <p className="text-sm text-polar-ink">Last: <span className="font-mono">{emergency.lastTelemetry}</span></p>
                </div>
              </div>

              {/* Telemetry payload */}
              <div className="p-4 bg-polar-navy rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Simulated Compressed Telemetry</p>
                </div>
                <div className="font-mono text-xs text-green-400 space-y-1 leading-relaxed">
                  {telemetryLines.map((line, i) => (
                    <p key={i}>{line} {i === telemetryLines.length - 1 ? '...' : ''}</p>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3 italic">
                  Prototype representation of a compact emergency telemetry payload.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-[10px] text-slate-400">Payload size: ~{telemetryLines.join(' ').split(' ').length * 2} bytes • Compressed SBD format</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">
                Status: {emergency.acknowledged ? 'ACKNOWLEDGED — Response in progress' : 'UNACKNOWLEDGED — Awaiting response'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {!emergency.acknowledged ? (
                <button onClick={acknowledgeEmergency} className="btn btn-primary flex-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Acknowledge Alert
                </button>
              ) : (
                <button onClick={clearEmergency} className="btn btn-primary flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Close Incident
                </button>
              )}
              <button onClick={() => setIncidentOpen(true)} className="btn btn-secondary flex-1">
                <FileText className="w-4 h-4" />
                Open Incident
              </button>
              <button onClick={() => setCurrentPage('personnel')} className="btn btn-secondary flex-1">
                <Eye className="w-4 h-4" />
                View Team
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-polar-ink">No Active Emergencies</h3>
          <p className="text-sm text-polar-muted mt-1 mb-6">All field teams are operating normally. No distress beacons active.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {traverseTeams.map((team) => (
              <button key={team.id} onClick={() => triggerEmergency(team.id)} className="btn btn-danger">
                <Siren className="w-4 h-4" />
                Simulate Distress — {team.name.replace('Traverse Team ', 'Team ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Incident modal */}
      <Modal open={incidentOpen} onClose={() => setIncidentOpen(false)} title="Incident Report" maxWidth="max-w-lg"
        icon={<div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center"><FileText className="w-5 h-5 text-red-600" /></div>}
      >
        {emergency.active && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-bold text-red-800">INC-{Date.now().toString().slice(-6)}</p>
              <p className="text-xs text-red-600 mt-1">Distress beacon activation — {emergency.teamName}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-polar-muted">Incident Type</span><span className="font-semibold text-polar-ink">Distress Beacon</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Severity</span><span className="font-semibold text-red-600">CRITICAL</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Team</span><span className="font-semibold text-polar-ink">{emergency.teamName}</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Vehicle</span><span className="font-semibold text-polar-ink">{emergency.vehicle}</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Coordinates</span><span className="font-mono text-polar-ink text-xs">{emergency.coordinates}</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Personnel at Risk</span><span className="font-semibold text-polar-ink">{emergency.personnel}</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Battery Level</span><span className="font-semibold text-polar-ink">{emergency.battery}%</span></div>
              <div className="flex justify-between"><span className="text-polar-muted">Acknowledged</span><span className="font-semibold text-polar-ink">{emergency.acknowledged ? 'Yes' : 'No'}</span></div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-bold text-polar-muted uppercase mb-1">Response Actions</p>
              <ul className="text-xs text-polar-ink space-y-1">
                <li>1. Establish communication via backup beacon</li>
                <li>2. Dispatch rescue team from nearest station</li>
                <li>3. Notify NCPOR operations center</li>
                <li>4. Prepare medical evacuation if required</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
