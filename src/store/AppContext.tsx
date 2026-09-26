import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  initialExpeditions, initialInventory, initialCargo, initialTraverseTeams,
  initialWaste, initialChecklist, initialAlerts, initialActivity,
  initialSyncHistory, generateHexPayload,
  type Expedition, type InventoryItem, type CargoItem, type TraverseTeam,
  type WasteRecord, type ChecklistItem, type AlertItem, type ActivityLog,
  type SyncTransaction, type SyncStatus, type AlertSeverity,
} from '@/data/mockData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface EmergencyState {
  active: boolean;
  acknowledged: boolean;
  teamId: string;
  teamName: string;
  vehicle: string;
  personnel: number;
  battery: number;
  coordinates: string;
  lastTelemetry: string;
  telemetryPayload: string;
}

interface AppState {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Connection
  online: boolean;
  pendingTransactions: SyncTransaction[];
  syncHistory: SyncTransaction[];
  syncing: boolean;
  syncStep: string;

  // Data
  expeditions: Expedition[];
  inventory: InventoryItem[];
  cargo: CargoItem[];
  traverseTeams: TraverseTeam[];
  waste: WasteRecord[];
  checklist: ChecklistItem[];
  alerts: AlertItem[];
  activity: ActivityLog[];

  // Emergency
  emergency: EmergencyState;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Actions
  toggleConnection: () => void;
  simulateBlackout: () => void;
  restoreConnection: () => void;
  addLocalTransaction: () => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateCargoStatus: (id: string, status: CargoItem['status']) => void;
  toggleChecklistItem: (id: string) => void;
  triggerEmergency: (teamId: string) => void;
  acknowledgeEmergency: () => void;
  clearEmergency: () => void;
  addAlert: (alert: Omit<AlertItem, 'id' | 'timestamp' | 'acknowledged' | 'dismissed' | 'read'>) => void;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  addActivity: (message: string, type: string) => void;
  updateWasteStatus: (id: string, status: WasteRecord['status']) => void;

  // Derived
  unreadAlertCount: number;
  activeEmergencyCount: number;
  inventoryAlertCount: number;
  activeExpeditionCount: number;
  totalPersonnel: number;
  totalCargo: number;
  totalAssets: number;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'polarlog_state_v1';

function loadPersistedState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [online, setOnline] = useState(true);
  const [pendingTransactions, setPendingTransactions] = useState<SyncTransaction[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncTransaction[]>(initialSyncHistory);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState('');

  const [expeditions] = useState<Expedition[]>(initialExpeditions);
  const [inventory, setInventory] = useState<InventoryItem[]>(persisted?.inventory ?? initialInventory);
  const [cargo, setCargo] = useState<CargoItem[]>(persisted?.cargo ?? initialCargo);
  const [traverseTeams, setTraverseTeams] = useState<TraverseTeam[]>(initialTraverseTeams);
  const [waste, setWaste] = useState<WasteRecord[]>(persisted?.waste ?? initialWaste);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(persisted?.checklist ?? initialChecklist);
  const [alerts, setAlerts] = useState<AlertItem[]>(persisted?.alerts ?? initialAlerts);
  const [activity, setActivity] = useState<ActivityLog[]>(initialActivity);

  const [emergency, setEmergency] = useState<EmergencyState>({
    active: false,
    acknowledged: false,
    teamId: '',
    teamName: '',
    vehicle: '',
    personnel: 0,
    battery: 0,
    coordinates: '',
    lastTelemetry: '',
    telemetryPayload: '',
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist key state to localStorage
  useEffect(() => {
    const state = { inventory, cargo, waste, checklist, alerts };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [inventory, cargo, waste, checklist, alerts]);

  // --- Toast system ---
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Activity ---
  const addActivity = useCallback((message: string, type: string) => {
    const now = new Date();
    const ts = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    setActivity((prev) => [{ id: `act-${Date.now()}`, timestamp: ts, message, type }, ...prev].slice(0, 20));
  }, []);

  // --- Alerts ---
  const addAlert = useCallback((alt: Omit<AlertItem, 'id' | 'timestamp' | 'acknowledged' | 'dismissed' | 'read'>) => {
    const now = new Date();
    const ts = `2026-09-25 ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    setAlerts((prev) => [{
      ...alt,
      id: `alt-${Date.now()}`,
      timestamp: ts,
      acknowledged: false,
      dismissed: false,
      read: false,
    }, ...prev]);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true, read: true } : a));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, dismissed: true } : a));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  }, []);

  // --- Connection / Sync ---
  const toggleConnection = useCallback(() => {
    setOnline((prev) => {
      const next = !prev;
      addToast(next ? 'Satellite link simulated as online.' : 'Satellite link simulated as offline.', next ? 'success' : 'warning');
      return next;
    });
  }, [addToast]);

  const simulateBlackout = useCallback(() => {
    setOnline(false);
    addToast('Satellite link lost. Local edge mode active.', 'error');
    addAlert({
      severity: 'warning',
      category: 'Connectivity',
      title: 'Satellite Link Offline',
      description: 'Simulated 72-hour satellite blackout initiated. Local edge mode active.',
    });
    addActivity('Satellite link lost — local edge mode activated', 'connectivity');
  }, [addToast, addAlert, addActivity]);

  const transactionTypes = ['Inventory Update', 'Personnel Telemetry', 'Cargo Update', 'Waste Record', 'Checklist Update'];
  const stations = ['Maitri', 'Bharati'];

  const addLocalTransaction = useCallback(() => {
    const idx = pendingTransactions.length;
    const type = transactionTypes[idx % transactionTypes.length];
    const station = stations[idx % stations.length];
    const now = new Date();
    const ts = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    const tx: SyncTransaction = {
      id: `tx-${Date.now()}`,
      type,
      station,
      timestamp: ts,
      status: 'QUEUED',
      payloadSize: Math.floor(Math.random() * 32) + 16,
      payloadPreview: generateHexPayload(6),
      direction: 'OUT',
      records: 1,
    };
    setPendingTransactions((prev) => [...prev, tx]);
    addToast(`Transaction queued locally.`, 'info');
    addActivity(`${type} queued locally at ${station}`, 'sync');
  }, [pendingTransactions.length, addToast, addActivity]);

  const restoreConnection = useCallback(async () => {
    setSyncing(true);
    const count = pendingTransactions.length;
    const steps = [
      'Restoring simulated satellite link...',
      'Compressing pending transactions...',
      'Preparing low-bandwidth payload...',
      'Transmitting...',
    ];
    for (const step of steps) {
      setSyncStep(step);
      await new Promise((r) => setTimeout(r, 800));
    }

    const now = new Date();
    const ts = `2026-09-25 ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    const totalPayload = pendingTransactions.reduce((sum, t) => sum + t.payloadSize, 0);

    const syncedEntry: SyncTransaction = {
      id: `sync-${Date.now()}`,
      type: 'Batch Sync',
      station: 'All',
      timestamp: ts,
      status: 'SYNCED',
      payloadSize: totalPayload,
      payloadPreview: generateHexPayload(8),
      direction: 'OUT',
      records: count,
    };

    setSyncHistory((prev) => [syncedEntry, ...prev]);
    setPendingTransactions([]);
    setOnline(true);
    setSyncing(false);
    setSyncStep('');
    addToast(`${count} transactions synchronized successfully.`, 'success');
    addActivity(`${count} transactions synchronized via satellite link`, 'sync');
  }, [pendingTransactions, addToast, addActivity]);

  // --- Inventory ---
  const addInventoryItem = useCallback((item: InventoryItem) => {
    setInventory((prev) => [item, ...prev]);
    addToast(online ? 'Asset successfully added to local inventory.' : 'Asset queued locally (QUEUED LOCALLY).', online ? 'success' : 'warning');
    addActivity(`Asset scanned: ${item.item} at ${item.station}`, 'inventory');
  }, [online, addToast, addActivity]);

  // --- Cargo ---
  const updateCargoStatus = useCallback((id: string, status: CargoItem['status']) => {
    setCargo((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    addToast(`Cargo ${id} marked as ${status}.`, 'info');
    addActivity(`Cargo ${id} status updated to ${status}`, 'cargo');
  }, [addToast, addActivity]);

  // --- Checklist ---
  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, completed: !c.completed } : c));
    addToast('Compliance checklist updated.', 'info');
  }, [addToast]);

  // --- Waste ---
  const updateWasteStatus = useCallback((id: string, status: WasteRecord['status']) => {
    setWaste((prev) => prev.map((w) => w.id === id ? { ...w, status } : w));
    addToast(`Waste record ${id} updated to ${status}.`, 'info');
    addActivity(`Waste record ${id} status updated`, 'compliance');
  }, [addToast, addActivity]);

  // --- Emergency ---
  const triggerEmergency = useCallback((teamId: string) => {
    const team = traverseTeams.find((t) => t.id === teamId) ?? traverseTeams[0];
    setEmergency({
      active: true,
      acknowledged: false,
      teamId: team.id,
      teamName: team.name,
      vehicle: team.vehicle,
      personnel: team.personnel,
      battery: team.battery,
      coordinates: `${(70.5 + Math.random() * 5).toFixed(4)}°S, ${(11.5 + Math.random() * 3).toFixed(4)}°E`,
      lastTelemetry: team.lastTelemetry,
      telemetryPayload: generateHexPayload(24),
    });
    setTraverseTeams((prev) => prev.map((t) => t.id === team.id ? { ...t, status: 'EMERGENCY', beacon: 'DEGRADED' } : t));
    addToast('Emergency alert triggered!', 'error');
    addAlert({
      severity: 'critical',
      category: 'Emergency',
      title: 'Distress Beacon Active',
      description: `${team.name} — ${team.vehicle} has triggered a distress beacon.`,
    });
    addActivity(`Distress beacon activated: ${team.name}`, 'emergency');
  }, [traverseTeams, addToast, addAlert, addActivity]);

  const acknowledgeEmergency = useCallback(() => {
    setEmergency((prev) => ({ ...prev, acknowledged: true }));
    addToast('Emergency acknowledged.', 'warning');
    addActivity('Emergency distress alert acknowledged', 'emergency');
  }, [addToast, addActivity]);

  const clearEmergency = useCallback(() => {
    setEmergency({
      active: false, acknowledged: false, teamId: '', teamName: '', vehicle: '',
      personnel: 0, battery: 0, coordinates: '', lastTelemetry: '', telemetryPayload: '',
    });
    setTraverseTeams((prev) => prev.map((t) => t.status === 'EMERGENCY' ? { ...t, status: 'ACTIVE', beacon: 'ONLINE' } : t));
    addToast('Emergency incident closed.', 'success');
  }, [addToast]);

  // --- Derived values ---
  const unreadAlertCount = alerts.filter((a) => !a.dismissed && !a.read).length;
  const activeEmergencyCount = emergency.active ? 1 : 0;
  const inventoryAlertCount = inventory.filter((i) => i.status !== 'NORMAL').length;
  const activeExpeditionCount = expeditions.filter((e) => e.status === 'ACTIVE').length;
  const totalPersonnel = 46;
  const totalCargo = cargo.length;
  const totalAssets = 20;

  const value: AppState = {
    currentPage, setCurrentPage,
    online, pendingTransactions, syncHistory, syncing, syncStep,
    expeditions, inventory, cargo, traverseTeams, waste, checklist, alerts, activity,
    emergency,
    toasts, addToast, dismissToast,
    toggleConnection, simulateBlackout, restoreConnection, addLocalTransaction,
    addInventoryItem, updateCargoStatus, toggleChecklistItem,
    triggerEmergency, acknowledgeEmergency, clearEmergency,
    addAlert, acknowledgeAlert, dismissAlert, markAlertRead,
    addActivity, updateWasteStatus,
    unreadAlertCount, activeEmergencyCount, inventoryAlertCount,
    activeExpeditionCount, totalPersonnel, totalCargo, totalAssets,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
