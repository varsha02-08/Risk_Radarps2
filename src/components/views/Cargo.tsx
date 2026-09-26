import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Boxes, Filter, X, Truck, Package } from 'lucide-react';
import type { CargoStatus } from '@/data/mockData';

const cargoCategories = ['Fuel', 'Food', 'Medical', 'Scientific Equipment', 'Spare Parts', 'Waste Return'];
const statusOptions: CargoStatus[] = ['RECEIVED', 'LOADED', 'IN TRANSIT', 'DELIVERED'];
const statusVariants: Record<CargoStatus, 'normal' | 'info' | 'warning' | 'success'> = {
  'RECEIVED': 'info',
  'LOADED': 'warning',
  'IN TRANSIT': 'warning',
  'DELIVERED': 'success',
};

export default function Cargo() {
  const { cargo, updateCargoStatus } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return cargo.filter((item) => {
      const matchSearch = !search ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [cargo, search, categoryFilter, statusFilter]);

  const pageSize = 20;
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-polar-ink">Cargo Management</h1>
        <p className="text-sm text-polar-muted mt-1">Track cargo movement between stations, origins, and destinations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statusOptions.map((s) => {
          const count = cargo.filter((c) => c.status === s).length;
          return (
            <div key={s} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-polar-muted uppercase tracking-wider">{s}</p>
                  <p className="text-2xl font-bold text-polar-ink mt-1 tabular-nums">{count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  s === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                  s === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600' :
                  s === 'LOADED' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="relative col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search cargo ID or description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="input pl-10" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} className="input">
            <option value="all">All Categories</option>
            {cargoCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="input">
            <option value="all">All Statuses</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center justify-end text-xs text-polar-muted">
            <Filter className="w-3.5 h-3.5 mr-1" />
            {filtered.length} of {cargo.length} items
            {(categoryFilter !== 'all' || statusFilter !== 'all' || search) && (
              <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); setPage(0); }} className="ml-2 text-polar-action font-semibold hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-polar-border">
              <tr>
                {['Cargo ID', 'Description', 'Category', 'Origin', 'Destination', 'Weight', 'Priority', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-polar-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-border">
              {paged.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-polar-muted whitespace-nowrap">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-polar-ink whitespace-nowrap">{item.description}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{item.origin}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink">{item.destination}</td>
                  <td className="px-4 py-3 text-xs text-polar-ink whitespace-nowrap">{item.weight}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${item.priority === 'HIGH' ? 'text-red-600' : item.priority === 'MEDIUM' ? 'text-amber-600' : 'text-gray-500'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge variant={statusVariants[item.status]} label={item.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateCargoStatus(item.id, e.target.value as CargoStatus)}
                      className="text-xs border border-polar-border rounded-lg px-2 py-1 bg-white text-polar-ink focus:outline-none focus:ring-1 focus:ring-polar-action"
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-polar-border">
          <p className="text-xs text-polar-muted">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn btn-secondary px-3 py-1.5 text-xs">Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn btn-secondary px-3 py-1.5 text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
