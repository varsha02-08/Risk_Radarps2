import { AppProvider, useApp } from '@/store/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import TopStatusBar from '@/components/layout/TopStatusBar';
import ToastSystem from '@/components/ui/ToastSystem';
import Dashboard from '@/components/views/Dashboard';
import Expeditions from '@/components/views/Expeditions';
import OperationsMap from '@/components/views/OperationsMap';
import Inventory from '@/components/views/Inventory';
import Cargo from '@/components/views/Cargo';
import Personnel from '@/components/views/Personnel';
import Emergency from '@/components/views/Emergency';
import Compliance from '@/components/views/Compliance';
import SyncCenter from '@/components/views/SyncCenter';
import Alerts from '@/components/views/Alerts';

function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard': return <Dashboard />;
    case 'expeditions': return <Expeditions />;
    case 'map': return <OperationsMap />;
    case 'inventory': return <Inventory />;
    case 'cargo': return <Cargo />;
    case 'personnel': return <Personnel />;
    case 'emergency': return <Emergency />;
    case 'compliance': return <Compliance />;
    case 'sync': return <SyncCenter />;
    case 'alerts': return <Alerts />;
    default: return <Dashboard />;
  }
}

function AppShell() {
  return (
    <div className="flex min-h-screen bg-polar-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopStatusBar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <PageRouter />
        </main>
      </div>
      <ToastSystem />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
