import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { generateHexPayload } from '@/data/mockData';
import {
  RefreshCw, Wifi, WifiOff, CloudUpload, Radio, Database,
  ArrowRight, CheckCircle2, Loader2, Activity, ArrowDown,
} from 'lucide-react';

export default function SyncCenter() {
  const {
    online, pendingTransactions, syncHistory, syncing, syncStep,
    simulateBlackout, restoreConnection, addLocalTransaction,
  } = useApp();
  const [detailTx, setDetailTx] = useState<typeof syncHistory[0] | null>(null);

  const totalPayload = pendingTransactions.reduce((sum, t) => sum + t.payloadSize, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Offline-First Satellite Sync Engine</h1>
        <p className="text-sm text-polar-muted mt-1">Prototype simulation of low-bandwidth communication and local edge operation.</p>
      </div>

      {/* Demo label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
        <Radio className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Simulated Iridium Workflow</span>
      </div>

      {/* Connection status */}
      <div className="grid grid-cols-3 gap-6">
        <div className={`card p-5 ${online ? 'ring-2 ring-green-300' : 'ring-2 ring-red-300'}`}>
          <div className="flex items-center gap-3 mb-4">
            {online ? <Wifi className="w-6 h-6 text-green-600" /> : <WifiOff className="w-6 h-6 text-red-600" />}
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Connection Status</p>
              <p className={`text-lg font-bold ${online ? 'text-green-700' : 'text-red-700'}`}>
                {online ? 'IRIDIUM LINK SIMULATED' : 'SATELLITE LINK OFFLINE'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} animate-beacon`} />
              <span className="text-polar-ink">{online ? 'SBD / Low-Bandwidth Mode' : 'Local Edge Mode Active'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-polar-ink">{online ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </div>
          </div>
        </div>

        {/* Pending transactions */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <CloudUpload className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Pending Transactions</p>
              <p className="text-lg font-bold text-polar-ink">{pendingTransactions.length} Queued</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
            {pendingTransactions.length === 0 ? (
              <p className="text-xs text-polar-muted text-center py-4">No pending transactions.</p>
            ) : (
              pendingTransactions.map((tx, i) => (
                <div key={tx.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <span className="font-mono text-polar-muted">#{String(i + 1).padStart(3, '0')}</span>
                  <span className="font-semibold text-polar-ink">{tx.type}</span>
                  <span className="text-polar-muted">{tx.station}</span>
                  <StatusBadge variant="queued" label="Queued" dot={false} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sync payload */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-sky-600" />
            <div>
              <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">Sync Payload</p>
              <p className="text-lg font-bold text-polar-ink">{pendingTransactions.length} Records</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-polar-muted">Payload Size</span><span className="font-semibold text-polar-ink">{totalPayload > 0 ? `${totalPayload} Bytes` : '16–48 Bytes'}</span></div>
            <div className="flex justify-between"><span className="text-polar-muted">Status</span><StatusBadge variant={pendingTransactions.length > 0 ? 'queued' : 'synced'} label={pendingTransactions.length > 0 ? 'QUEUED' : 'SYNCED'} /></div>
          </div>
          {pendingTransactions.length > 0 && (
            <div className="mt-3 p-2 bg-polar-navy rounded font-mono text-[10px] text-green-400 break-all">
              {pendingTransactions[0]?.payloadPreview} ...
            </div>
          )}
          <p className="text-[10px] text-gray-400 mt-2 italic">Simulated Compact Payload</p>
        </div>
      </div>

      {/* Action panel */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-polar-ink mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-polar-action" />
          Sync Workflow Control
        </h2>

        {syncing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-sky-50 border border-sky-200 rounded-lg">
              <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
              <p className="text-sm font-semibold text-sky-700">{syncStep}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-polar-muted">
              <span>Compressing</span><ArrowRight className="w-3 h-3" />
              <span>Payload</span><ArrowRight className="w-3 h-3" />
              <span>Transmitting</span><ArrowRight className="w-3 h-3" />
              <span>Synced</span>
            </div>
          </div>
        ) : online ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-700">System is online. All transactions synchronized.</p>
            </div>
            <button onClick={simulateBlackout} className="btn btn-danger">
              <WifiOff className="w-4 h-4" />
              Simulate 72-Hour Satellite Blackout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <WifiOff className="w-5 h-5 text-red-600" />
                <p className="text-sm font-bold text-red-800">Satellite link lost. Switching to local edge storage.</p>
              </div>
              <p className="text-xs text-red-600">All actions are queued locally. Click below to simulate local transactions.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={addLocalTransaction} className="btn btn-secondary flex-1">
                <CloudUpload className="w-4 h-4" />
                + Simulate Local Transaction
              </button>
              {pendingTransactions.length > 0 && (
                <button onClick={restoreConnection} className="btn btn-primary flex-1">
                  <Wifi className="w-4 h-4" />
                  Restore Satellite Link & Sync
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sync History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-polar-border">
          <h2 className="text-base font-bold text-polar-ink flex items-center gap-2">
            <Activity className="w-5 h-5 text-polar-action" />
            Sync History
          </h2>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-polar-border">
              <tr>
                {['Timestamp', 'Direction', 'Records', 'Payload Size', 'Status', 'Payload Preview', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-border">
              {syncHistory.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setDetailTx(tx)}>
                  <td className="px-4 py-3 text-xs font-mono text-polar-muted whitespace-nowrap">{tx.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-polar-ink">
                      {tx.direction === 'OUT' ? <ArrowRight className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-blue-500" />}
                      {tx.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-polar-ink">{tx.records}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{tx.payloadSize} Bytes</td>
                  <td className="px-4 py-3"><StatusBadge variant={tx.status === 'SYNCED' ? 'synced' : tx.status === 'FAILED' ? 'failed' : tx.status === 'TRANSMITTING' ? 'transmitting' : 'queued'} label={tx.status} /></td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500 max-w-xs truncate">{tx.payloadPreview} ...</td>
                  <td className="px-4 py-3 text-right"><button className="text-xs text-polar-action font-semibold hover:underline">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detailTx} onClose={() => setDetailTx(null)} title="Sync Transaction Details" maxWidth="max-w-lg"
        icon={<div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-sky-600" /></div>}
      >
        {detailTx && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-polar-muted">Transaction ID</p><p className="font-mono text-polar-ink text-xs">{detailTx.id}</p></div>
              <div><p className="text-xs text-polar-muted">Type</p><p className="font-semibold text-polar-ink">{detailTx.type}</p></div>
              <div><p className="text-xs text-polar-muted">Station</p><p className="font-semibold text-polar-ink">{detailTx.station}</p></div>
              <div><p className="text-xs text-polar-muted">Timestamp</p><p className="font-mono text-polar-ink text-xs">{detailTx.timestamp}</p></div>
              <div><p className="text-xs text-polar-muted">Direction</p><p className="font-semibold text-polar-ink">{detailTx.direction}</p></div>
              <div><p className="text-xs text-polar-muted">Records</p><p className="font-semibold text-polar-ink">{detailTx.records}</p></div>
              <div><p className="text-xs text-polar-muted">Payload Size</p><p className="font-semibold text-polar-ink">{detailTx.payloadSize} Bytes</p></div>
              <div><p className="text-xs text-polar-muted">Status</p><StatusBadge variant={detailTx.status === 'SYNCED' ? 'synced' : 'failed'} label={detailTx.status} /></div>
            </div>
            <div className="p-4 bg-polar-navy rounded-lg">
              <p className="text-xs font-bold text-sky-300 uppercase mb-2">Full Payload</p>
              <p className="font-mono text-xs text-green-400 break-all">{detailTx.payloadPreview} {generateHexPayload(4)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
