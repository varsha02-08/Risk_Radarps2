import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import Modal from '@/components/ui/Modal';
import { scanableAssets, type InventoryItem } from '@/data/mockData';
import { ScanLine, CheckCircle2, Package } from 'lucide-react';

interface ScannerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ScannerModal({ open, onClose }: ScannerModalProps) {
  const { addInventoryItem, online } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<typeof scanableAssets[0] | null>(null);

  useEffect(() => {
    if (!open) {
      setScanning(false);
      setScanned(false);
      setResult(null);
    }
  }, [open]);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
    setResult(null);
    setTimeout(() => {
      const asset = scanableAssets[Math.floor(Math.random() * scanableAssets.length)];
      setResult(asset);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleAdd = () => {
    if (!result) return;
    const newItem: InventoryItem = {
      id: `INV-${Date.now()}`,
      assetId: result.assetId,
      item: result.item,
      category: result.category,
      station: result.station,
      quantity: 1,
      safetyStock: 5,
      temperature: null,
      safeRange: null,
      safeThreshold: null,
      status: 'NORMAL',
      lastUpdated: '2026-09-25 14:35 UTC',
      coldChain: false,
    };
    addInventoryItem(newItem);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Scan Asset" maxWidth="max-w-md"
      icon={<div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><ScanLine className="w-5 h-5 text-sky-600" /></div>}
    >
      <div className="space-y-4">
        {/* Scanner frame */}
        <div className="relative aspect-square max-w-xs mx-auto bg-gray-900 rounded-xl overflow-hidden border-2 border-polar-border">
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br-lg" />

          {/* Scan line */}
          {scanning && (
            <div className="absolute left-4 right-4 h-0.5 bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.6)] animate-scan-line" />
          )}

          {/* Result */}
          {scanned && result ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 animate-fade-in p-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-sm font-bold text-polar-ink">{result.assetId}</p>
              <p className="text-xs text-polar-muted mt-1">{result.item}</p>
              <p className="text-xs text-polar-muted">{result.station}</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-700" />
            </div>
          )}
        </div>

        {/* Actions */}
        {!scanned ? (
          <div className="flex gap-3">
            <button onClick={handleScan} disabled={scanning} className="btn btn-primary flex-1">
              {scanning ? (
                <>
                  <ScanLine className="w-4 h-4 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" />
                  Simulate Scan
                </>
              )}
            </button>
            <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">SCANNED</span>
              </div>
              <p className="text-xs text-polar-muted">Asset ID: {result?.assetId}</p>
              <p className="text-xs text-polar-muted">Item: {result?.item}</p>
              <p className="text-xs text-polar-muted">Station: {result?.station}</p>
            </div>
            {!online && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <span className="text-xs font-bold text-amber-700 uppercase">QUEUED LOCALLY</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={handleAdd} className="btn btn-primary flex-1">Add to Inventory</button>
              <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
