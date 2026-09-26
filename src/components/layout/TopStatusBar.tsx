import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { Wifi, WifiOff, CloudUpload, Radio, Clock } from 'lucide-react';

export default function TopStatusBar() {
  const { online, pendingTransactions, unreadAlertCount } = useApp();
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(`${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-polar-border px-6 py-3 flex items-center justify-between">
      {/* Left: Connection status */}
      <div className="flex items-center gap-4">
        {online ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">IRIDIUM LINK SIMULATED</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-beacon" />
            <span className="text-xs font-medium text-green-600">ONLINE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <WifiOff className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">SATELLITE LINK OFFLINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-beacon" />
            <span className="text-xs font-medium text-red-600">LOCAL EDGE MODE</span>
          </div>
        )}

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          pendingTransactions.length > 0
            ? 'bg-amber-50 border-amber-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <CloudUpload className={`w-4 h-4 ${pendingTransactions.length > 0 ? 'text-amber-600' : 'text-gray-400'}`} />
          <span className={`text-sm font-semibold ${pendingTransactions.length > 0 ? 'text-amber-700' : 'text-gray-500'}`}>
            {pendingTransactions.length} Pending Transactions
          </span>
        </div>

        {!online && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <Radio className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">SBD / Low-Bandwidth Ready</span>
          </div>
        )}
      </div>

      {/* Right: Demo mode + clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Demo Mode</span>
        </div>

        {unreadAlertCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">{unreadAlertCount}</span>
            <span className="text-xs font-semibold text-red-700">Unread Alerts</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-polar-muted font-mono">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="tabular-nums">{utcTime}</span>
        </div>
      </div>
    </header>
  );
}
