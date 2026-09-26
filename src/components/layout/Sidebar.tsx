import { useApp } from '@/store/AppContext';
import {
  LayoutDashboard, Compass, Map, Package, Boxes, Users,
  Siren, Leaf, RefreshCw, AlertTriangle,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'expeditions', label: 'Expeditions', icon: Compass },
  { id: 'map', label: 'Operations Map', icon: Map },
  { id: 'inventory', label: 'Inventory & Cold Chain', icon: Package },
  { id: 'cargo', label: 'Cargo', icon: Boxes },
  { id: 'personnel', label: 'Personnel & Traverses', icon: Users },
  { id: 'emergency', label: 'Emergency Center', icon: Siren },
  { id: 'compliance', label: 'Treaty & Compliance', icon: Leaf },
  { id: 'sync', label: 'Sync Center', icon: RefreshCw },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, activeEmergencyCount, unreadAlertCount, pendingTransactions, online } = useApp();

  return (
    <aside className="w-64 bg-polar-navy text-white flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center">
            <Compass className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">POLARLOG</h1>
            <p className="text-[11px] text-sky-300 font-medium leading-tight">Integrated Polar Operations</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-beacon" />
          <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">DEMO MODE • Simulated Data</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            const Icon = item.icon;
            const showEmergencyBadge = item.id === 'emergency' && activeEmergencyCount > 0;
            const showAlertBadge = item.id === 'dashboard' && unreadAlertCount > 0;
            const showSyncBadge = item.id === 'sync' && pendingTransactions.length > 0;
            const badge = showEmergencyBadge ? activeEmergencyCount : showAlertBadge ? unreadAlertCount : showSyncBadge ? pendingTransactions.length : 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      showEmergencyBadge ? 'bg-red-500 text-white' : 'bg-amber-400 text-polar-navy'
                    }`}>
                      {badge}
                    </span>
                  )}
                  {!online && item.id === 'sync' && pendingTransactions.length === 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-[11px] text-slate-400 font-medium leading-relaxed">
          <p className="text-slate-300 font-semibold">NCPOR / MoES</p>
          <p>Maitri • Bharati</p>
          <p className="text-slate-500">Antarctic Operations</p>
        </div>
      </div>
    </aside>
  );
}
