import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import TemperatureGauge from '@/components/ui/TemperatureGauge';
import ScannerModal from '@/components/ui/ScannerModal';
import { Search, ScanLine, Package, Thermometer, AlertTriangle, Filter, X } from 'lucide-react';
import type { InventoryItem } from '@/data/mockData';

const categories = ['Fuel', 'Rations', 'Medical Supplies', 'Spare Parts', 'Scientific Equipment', 'Emergency Supplies', 'Waste / Return Payload'];
const statuses = ['NORMAL', 'LOW STOCK', 'CRITICAL', 'COLD-CHAIN RISK'] as const;

export default function Inventory() {
  const { inventory } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scanOpen, setScanOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch = !search ||
        item.item.toLowerCase().includes(search.toLowerCase()) ||
        item.assetId.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchStation = stationFilter === 'all' || item.station === stationFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchCat && matchStation && matchStatus;
    });
  }, [inventory, search, categoryFilter, stationFilter, statusFilter]);

  const coldChainItems = filtered.filter((i) => i.coldChain);
  const alertItems = filtered.filter((i) => i.status !== 'NORMAL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-polar-ink">Inventory & Cold-Chain Management</h1>
          <p className="text-sm text-polar-muted mt-1">Track supplies, monitor cold-chain integrity, and manage stock levels across stations.</p>
        </div>
        <button onClick={() => setScanOpen(true)} className="btn btn-primary">
          <ScanLine className="w-4 h-4" />
          Scan Asset
        </button>
      </div>

      {/* Cold-chain alert banner */}
      {inventory.some((i) => i.status === 'COLD-CHAIN RISK') && (
        <div className="card p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Cold-Chain Temperature Threshold Exceeded</p>
              <p className="text-xs text-red-600">Freeze-Dried Rations at -28°C — safe threshold is -25°C. Immediate action required.</p>
            </div>
            <button
              onClick={() => setSelectedItem(inventory.find((i) => i.status === 'COLD-CHAIN RISK') ?? null)}
              className="btn btn-danger"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="relative col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, asset IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={stationFilter} onChange={(e) => setStationFilter(e.target.value)} className="input">
            <option value="all">All Stations</option>
            <option value="Maitri">Maitri</option>
            <option value="Bharati">Bharati</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
            <option value="all">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-polar-muted">
            <Filter className="w-3.5 h-3.5" />
            Showing {filtered.length} of {inventory.length} items
            {(categoryFilter !== 'all' || stationFilter !== 'all' || statusFilter !== 'all' || search) && (
              <button
                onClick={() => { setSearch(''); setCategoryFilter('all'); setStationFilter('all'); setStatusFilter('all'); }}
                className="ml-2 text-polar-action font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Normal: {filtered.filter((i) => i.status === 'NORMAL').length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Low: {filtered.filter((i) => i.status === 'LOW STOCK').length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical: {filtered.filter((i) => i.status === 'CRITICAL').length}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Cold-Chain: {filtered.filter((i) => i.status === 'COLD-CHAIN RISK').length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-polar-border">
              <tr>
                {['Asset ID', 'Item', 'Category', 'Station', 'Qty', 'Safety Stock', 'Temp', 'Status', 'Last Updated'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-border">
              {filtered.slice(0, 50).map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-polar-muted whitespace-nowrap">{item.assetId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-polar-ink whitespace-nowrap">{item.item}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{item.station}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-polar-ink tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3 text-xs text-polar-muted tabular-nums">{item.safetyStock}</td>
                  <td className="px-4 py-3 text-xs font-mono text-polar-ink whitespace-nowrap">
                    {item.temperature !== null ? `${item.temperature}°C` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={item.status === 'NORMAL' ? 'normal' : item.status === 'LOW STOCK' ? 'warning' : item.status === 'CRITICAL' ? 'critical' : 'emergency'}
                      label={item.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-polar-muted font-mono whitespace-nowrap">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-polar-border text-xs text-polar-muted text-center">
            Showing first 50 results. Use filters to narrow down.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.item ?? ''} maxWidth="max-w-2xl"
        icon={<div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><Package className="w-5 h-5 text-sky-600" /></div>}
      >
        {selectedItem && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusBadge
                variant={selectedItem.status === 'NORMAL' ? 'normal' : selectedItem.status === 'LOW STOCK' ? 'warning' : selectedItem.status === 'CRITICAL' ? 'critical' : 'emergency'}
                label={selectedItem.status}
              />
              <span className="text-xs font-mono text-polar-muted">{selectedItem.assetId}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-polar-border">
                <p className="text-xs font-bold text-polar-muted uppercase mb-1">Current Stock</p>
                <p className="text-3xl font-bold text-polar-ink tabular-nums">{selectedItem.quantity}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-polar-border">
                <p className="text-xs font-bold text-polar-muted uppercase mb-1">Safety Stock</p>
                <p className="text-3xl font-bold text-polar-ink tabular-nums">{selectedItem.safetyStock}</p>
              </div>
            </div>

            {/* Reorder suggestion */}
            {selectedItem.quantity < selectedItem.safetyStock && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-bold text-amber-800">Safety stock breached.</p>
                </div>
                <p className="text-sm text-amber-700">
                  Recommended reorder: <span className="font-bold">{Math.max(selectedItem.safetyStock - selectedItem.quantity + 5, 10)} units.</span>
                </p>
              </div>
            )}

            {/* Cold chain gauge */}
            {selectedItem.coldChain && selectedItem.temperature !== null && selectedItem.safeThreshold !== null && selectedItem.safeRange !== null && (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer className="w-4 h-4 text-sky-600" />
                  <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">Thermal Exposure / Cold-Chain</p>
                </div>
                <TemperatureGauge
                  current={selectedItem.temperature}
                  threshold={selectedItem.safeThreshold}
                  safeRange={selectedItem.safeRange}
                />
                {selectedItem.temperature > selectedItem.safeThreshold && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-bold text-red-700 uppercase">Exposure Duration: ~4h 20m above threshold</p>
                    <p className="text-xs text-red-600 mt-1">Risk Level: HIGH — immediate corrective action required.</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-xs text-polar-muted">Category</p><p className="font-semibold text-polar-ink">{selectedItem.category}</p></div>
              <div><p className="text-xs text-polar-muted">Station</p><p className="font-semibold text-polar-ink">{selectedItem.station}</p></div>
              <div><p className="text-xs text-polar-muted">Last Updated</p><p className="font-semibold text-polar-ink font-mono text-xs">{selectedItem.lastUpdated}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <ScannerModal open={scanOpen} onClose={() => setScanOpen(false)} />
    </div>
  );
}
