// Centralized mock data layer for the Polar Logistics Platform.
// All numbers across the app derive from these sources to maintain consistency.

export type StationId = 'maitri' | 'bharati';
export type ExpeditionStatus = 'ACTIVE' | 'PLANNED' | 'COMPLETED';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type InventoryStatus = 'NORMAL' | 'LOW STOCK' | 'CRITICAL' | 'COLD-CHAIN RISK';
export type CargoStatus = 'RECEIVED' | 'LOADED' | 'IN TRANSIT' | 'DELIVERED';
export type CargoPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type SyncStatus = 'QUEUED' | 'TRANSMITTING' | 'SYNCED' | 'FAILED';
export type WasteCategory = 'Hazardous Materials' | 'Fuel Drums' | 'Solid Waste' | 'Chemical Waste' | 'Other Return Payload';
export type WasteStatus = 'STORED' | 'READY FOR RETURN' | 'SCHEDULED' | 'RETURNED' | 'OVERDUE';
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
export type AlertCategory = 'Inventory' | 'Cold Chain' | 'Personnel' | 'Emergency' | 'Cargo' | 'Compliance' | 'Connectivity';

export interface Expedition {
  id: string;
  name: string;
  station: string;
  missionType: string;
  startDate: string;
  endDate: string;
  personnel: number;
  cargo: number;
  status: ExpeditionStatus;
  riskLevel: RiskLevel;
  overview: string;
  route: string;
  complianceStatus: string;
  emergencyStatus: string;
}

export interface InventoryItem {
  id: string;
  assetId: string;
  item: string;
  category: string;
  station: string;
  quantity: number;
  safetyStock: number;
  temperature: number | null;
  safeRange: string | null;
  safeThreshold: number | null;
  status: InventoryStatus;
  lastUpdated: string;
  coldChain: boolean;
}

export interface CargoItem {
  id: string;
  description: string;
  origin: string;
  destination: string;
  weight: string;
  priority: CargoPriority;
  status: CargoStatus;
  category: string;
}

export interface TraverseTeam {
  id: string;
  name: string;
  vehicle: string;
  personnel: number;
  status: 'ACTIVE' | 'RETURNING' | 'STANDBY' | 'EMERGENCY';
  beacon: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  lastTelemetry: string;
  mission: string;
  battery: number;
  coordinates: { x: number; y: number };
  routeProgress: number;
}

export interface WasteRecord {
  id: string;
  category: WasteCategory;
  quantity: string;
  station: string;
  targetReturnDate: string;
  status: WasteStatus;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  critical: boolean;
}

export interface SyncTransaction {
  id: string;
  type: string;
  station: string;
  timestamp: string;
  status: SyncStatus;
  payloadSize: number;
  payloadPreview: string;
  direction: 'OUT' | 'IN';
  records: number;
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  dismissed: boolean;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: string;
}

export interface MapMarker {
  id: string;
  label: string;
  type: 'station' | 'traverse' | 'cargo' | 'emergency';
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'emergency' | 'station';
}

// --- Expeditions ---
export const initialExpeditions: Expedition[] = [
  {
    id: 'EXP-001',
    name: 'Antarctica Research Expedition 2026',
    station: 'Bharati Station',
    missionType: 'Research',
    startDate: '2026-01-15',
    endDate: '2026-03-30',
    personnel: 24,
    cargo: 67,
    status: 'ACTIVE',
    riskLevel: 'MODERATE',
    overview: 'Multi-disciplinary research expedition focused on glaciology, marine biology, and atmospheric science at the Larsemann Hills.',
    route: 'Bharati → Polar Plateau → Coast',
    complianceStatus: 'Compliant',
    emergencyStatus: 'No Active Emergencies',
  },
  {
    id: 'EXP-002',
    name: 'Antarctic Logistics Support Mission 2026',
    station: 'Maitri Station',
    missionType: 'Logistics',
    startDate: '2026-02-01',
    endDate: '2026-04-15',
    personnel: 22,
    cargo: 53,
    status: 'PLANNED',
    riskLevel: 'LOW',
    overview: 'Logistics support mission for fuel transport, ration resupply, and waste return operations at Schirmacher Oasis.',
    route: 'Maitri → Vaskadalen → Coast',
    complianceStatus: 'Pending Review',
    emergencyStatus: 'No Active Emergencies',
  },
];

// --- Inventory generation (120 records) ---
const inventoryCategories = [
  'Fuel', 'Rations', 'Medical Supplies', 'Spare Parts',
  'Scientific Equipment', 'Emergency Supplies', 'Waste / Return Payload',
];

const inventoryTemplates: Record<string, { items: string[]; coldChain: boolean }> = {
  Fuel: {
    items: ['Diesel Generator Fuel', 'Emergency Aviation Fuel', 'Vehicle Diesel Reserve', 'Heating Fuel Reserve', 'Snowmobile Fuel'],
    coldChain: false,
  },
  Rations: {
    items: ['Freeze-Dried Rations', 'Canned Provisions', 'Energy Bars', 'Dehydrated Vegetables', 'Polar Ration Packs', 'Beverage Mix'],
    coldChain: true,
  },
  'Medical Supplies': {
    items: ['Medical Oxygen Cylinders', 'Emergency Medical Kit', 'First Aid Supplies', 'Frostbite Treatment Kit', 'IV Fluids', 'Hypothermia Kit'],
    coldChain: true,
  },
  'Spare Parts': {
    items: ['Generator Spare Parts', 'Vehicle Track Assembly', 'Snowmobile Belt', 'Generator Alternator', 'Heater Element', 'Compressor Unit'],
    coldChain: false,
  },
  'Scientific Equipment': {
    items: ['Scientific Instruments', 'Ice Core Drill Bit', 'GPS Receiver Unit', 'Weather Station Sensor', 'Seismograph Module', 'Data Logger Unit'],
    coldChain: false,
  },
  'Emergency Supplies': {
    items: ['Emergency Shelter Module', 'Survival Ration Cache', 'Emergency Beacon Unit', 'Thermal Blankets', 'Portable Heater Unit', 'Emergency Water Supply'],
    coldChain: false,
  },
  'Waste / Return Payload': {
    items: ['Return Payload Hazardous Waste', 'Used Fuel Drums', 'Solid Waste Containers', 'Chemical Waste Drums', 'Biohazard Containers'],
    coldChain: false,
  },
};

function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  let counter = 1;
  const stations = ['Maitri', 'Bharati'];

  for (const cat of inventoryCategories) {
    const template = inventoryTemplates[cat];
    for (const itemName of template.items) {
      const station = stations[counter % 2];
      const quantity = Math.floor(Math.random() * 80) + 5;
      const safetyStock = Math.floor(Math.random() * 20) + 10;
      const isColdChain = template.coldChain;
      const temp = isColdChain ? -(Math.floor(Math.random() * 30) + 15) : null;
      const safeThreshold = isColdChain ? -25 : null;
      const safeRange = isColdChain ? '-30°C to -25°C' : null;

      let status: InventoryStatus = 'NORMAL';
      if (quantity < safetyStock * 0.5) status = 'CRITICAL';
      else if (quantity < safetyStock) status = 'LOW STOCK';
      else if (isColdChain && temp !== null && safeThreshold !== null && temp > safeThreshold) status = 'COLD-CHAIN RISK';

      // Force a few specific items to have known statuses for demo
      if (itemName === 'Medical Oxygen Cylinders') {
        items.push({
          id: `INV-${String(counter).padStart(3, '0')}`,
          assetId: `MTR-MED-${String(counter).padStart(3, '0')}`,
          item: itemName,
          category: cat,
          station,
          quantity: 8,
          safetyStock: 20,
          temperature: null,
          safeRange: null,
          safeThreshold: null,
          status: 'LOW STOCK',
          lastUpdated: '2026-09-25 08:35 UTC',
          coldChain: false,
        });
      } else if (itemName === 'Emergency Aviation Fuel') {
        items.push({
          id: `INV-${String(counter).padStart(3, '0')}`,
          assetId: `MTR-FL-${String(counter).padStart(3, '0')}`,
          item: itemName,
          category: cat,
          station,
          quantity: 12,
          safetyStock: 25,
          temperature: null,
          safeRange: null,
          safeThreshold: null,
          status: 'CRITICAL',
          lastUpdated: '2026-09-25 07:50 UTC',
          coldChain: false,
        });
      } else if (itemName === 'Freeze-Dried Rations') {
        items.push({
          id: `INV-${String(counter).padStart(3, '0')}`,
          assetId: `MTR-RA-${String(counter).padStart(3, '0')}`,
          item: itemName,
          category: cat,
          station,
          quantity: 45,
          safetyStock: 30,
          temperature: -28,
          safeRange: '-30°C to -25°C',
          safeThreshold: -25,
          status: 'COLD-CHAIN RISK',
          lastUpdated: '2026-09-25 08:12 UTC',
          coldChain: true,
        });
      } else {
        items.push({
          id: `INV-${String(counter).padStart(3, '0')}`,
          assetId: `${station === 'Maitri' ? 'MTR' : 'BHR'}-${cat.slice(0, 2).toUpperCase()}-${String(counter).padStart(3, '0')}`,
          item: itemName,
          category: cat,
          station,
          quantity,
          safetyStock,
          temperature: temp,
          safeRange,
          safeThreshold,
          status,
          lastUpdated: `2026-09-25 0${Math.floor(Math.random() * 9)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} UTC`,
          coldChain: isColdChain,
        });
      }
      counter++;
    }
  }

  // Pad to exactly 120 if needed
  while (items.length < 120) {
    const cat = inventoryCategories[items.length % inventoryCategories.length];
    const station = items.length % 2 === 0 ? 'Maitri' : 'Bharati';
    items.push({
      id: `INV-${String(counter).padStart(3, '0')}`,
      assetId: `${station === 'Maitri' ? 'MTR' : 'BHR'}-GEN-${String(counter).padStart(3, '0')}`,
      item: `Reserve Supply ${counter}`,
      category: cat,
      station,
      quantity: Math.floor(Math.random() * 60) + 10,
      safetyStock: 15,
      temperature: null,
      safeRange: null,
      safeThreshold: null,
      status: 'NORMAL',
      lastUpdated: '2026-09-25 08:00 UTC',
      coldChain: false,
    });
    counter++;
  }

  return items.slice(0, 120);
}

export const initialInventory: InventoryItem[] = generateInventory();

// --- Cargo generation (120 items) ---
const cargoCategories = ['Fuel', 'Food', 'Medical', 'Scientific Equipment', 'Spare Parts', 'Waste Return'];
const cargoDescriptions: Record<string, string[]> = {
  Fuel: ['Emergency Aviation Fuel', 'Diesel Generator Fuel', 'Vehicle Fuel Drums', 'Heating Fuel Reserve'],
  Food: ['Freeze-Dried Rations', 'Canned Provisions', 'Energy Bar Supply', 'Beverage Mix Pack'],
  Medical: ['Medical Oxygen Cylinders', 'First Aid Resupply', 'IV Fluids', 'Hypothermia Kit'],
  'Scientific Equipment': ['Ice Core Drill', 'Weather Sensors', 'GPS Unit', 'Seismograph Module'],
  'Spare Parts': ['Generator Alternator', 'Vehicle Track Assembly', 'Heater Element', 'Compressor Unit'],
  'Waste Return': ['Used Fuel Drums', 'Solid Waste Containers', 'Chemical Waste Drums', 'Biohazard Containers'],
};
const cargoStatuses: CargoStatus[] = ['RECEIVED', 'LOADED', 'IN TRANSIT', 'DELIVERED'];
const cargoPriorities: CargoPriority[] = ['HIGH', 'MEDIUM', 'LOW'];

function generateCargo(): CargoItem[] {
  const items: CargoItem[] = [];
  const stations = ['Maitri', 'Bharati', 'Cape Town', 'Goa'];
  for (let i = 1; i <= 120; i++) {
    const cat = cargoCategories[i % cargoCategories.length];
    const descs = cargoDescriptions[cat];
    const desc = descs[i % descs.length];
    const origin = stations[i % stations.length];
    let dest = stations[(i + 1) % stations.length];
    if (dest === origin) dest = stations[(i + 2) % stations.length];
    items.push({
      id: `CARGO-${String(i).padStart(3, '0')}`,
      description: desc,
      origin,
      destination: dest,
      weight: `${Math.floor(Math.random() * 500) + 10} kg`,
      priority: cargoPriorities[i % 3],
      status: cargoStatuses[i % 4],
      category: cat,
    });
  }
  return items;
}

export const initialCargo: CargoItem[] = generateCargo();

// --- Traverse Teams ---
export const initialTraverseTeams: TraverseTeam[] = [
  {
    id: 'TRV-ALPHA',
    name: 'Traverse Team Alpha',
    vehicle: 'Snowcat #02',
    personnel: 6,
    status: 'ACTIVE',
    beacon: 'ONLINE',
    lastTelemetry: '14:32 UTC',
    mission: 'Fuel Depot Resupply',
    battery: 78,
    coordinates: { x: 35, y: 55 },
    routeProgress: 45,
  },
  {
    id: 'TRV-BETA',
    name: 'Traverse Team Beta',
    vehicle: 'Snowmobile #04',
    personnel: 4,
    status: 'RETURNING',
    beacon: 'ONLINE',
    lastTelemetry: '14:28 UTC',
    mission: 'Field Sample Collection',
    battery: 62,
    coordinates: { x: 65, y: 40 },
    routeProgress: 70,
  },
];

// --- Waste Records ---
export const initialWaste: WasteRecord[] = [
  { id: 'WST-001', category: 'Hazardous Materials', quantity: '12 drums', station: 'Maitri', targetReturnDate: '2026-04-15', status: 'STORED' },
  { id: 'WST-002', category: 'Fuel Drums', quantity: '45 drums', station: 'Maitri', targetReturnDate: '2026-03-01', status: 'READY FOR RETURN' },
  { id: 'WST-003', category: 'Solid Waste', quantity: '8 containers', station: 'Bharati', targetReturnDate: '2026-04-20', status: 'SCHEDULED' },
  { id: 'WST-004', category: 'Chemical Waste', quantity: '6 drums', station: 'Bharati', targetReturnDate: '2026-02-28', status: 'OVERDUE' },
  { id: 'WST-005', category: 'Other Return Payload', quantity: '15 crates', station: 'Maitri', targetReturnDate: '2026-04-10', status: 'STORED' },
  { id: 'WST-006', category: 'Fuel Drums', quantity: '20 drums', station: 'Bharati', targetReturnDate: '2026-03-15', status: 'RETURNED' },
  { id: 'WST-007', category: 'Hazardous Materials', quantity: '4 drums', station: 'Bharati', targetReturnDate: '2026-04-01', status: 'READY FOR RETURN' },
  { id: 'WST-008', category: 'Solid Waste', quantity: '10 containers', station: 'Maitri', targetReturnDate: '2026-03-20', status: 'SCHEDULED' },
];

// --- Checklist ---
export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', label: 'Pre-Traverse Fuel Margin Verification', completed: true, critical: true },
  { id: 'chk-2', label: 'Emergency Shelter Stock Verified', completed: true, critical: true },
  { id: 'chk-3', label: 'Distress Beacon Test Completed', completed: true, critical: true },
  { id: 'chk-4', label: 'Medical Kit Inspection', completed: true, critical: false },
  { id: 'chk-5', label: 'Communication Equipment Check', completed: false, critical: true },
  { id: 'chk-6', label: 'Cold-Chain Verification', completed: true, critical: false },
  { id: 'chk-7', label: 'Waste Return Manifest Verified', completed: false, critical: false },
  { id: 'chk-8', label: 'Vehicle Emergency Kit Verified', completed: true, critical: false },
];

// --- Initial Alerts ---
export const initialAlerts: AlertItem[] = [
  {
    id: 'alt-1',
    severity: 'warning',
    category: 'Inventory',
    title: 'Low Medical Oxygen',
    description: 'Medical Oxygen Cylinders at Maitri below safety stock (8/20).',
    timestamp: '2026-09-25 08:35 UTC',
    acknowledged: false,
    dismissed: false,
    read: false,
  },
  {
    id: 'alt-2',
    severity: 'warning',
    category: 'Cold Chain',
    title: 'Cold-Chain Threshold Exceeded',
    description: 'Freeze-Dried Rations at -28°C, safe threshold is -25°C.',
    timestamp: '2026-09-25 08:12 UTC',
    acknowledged: false,
    dismissed: false,
    read: false,
  },
  {
    id: 'alt-3',
    severity: 'warning',
    category: 'Inventory',
    title: 'Emergency Fuel — Reorder Recommended',
    description: 'Emergency Aviation Fuel at critical level (12/25).',
    timestamp: '2026-09-25 07:50 UTC',
    acknowledged: false,
    dismissed: false,
    read: false,
  },
  {
    id: 'alt-4',
    severity: 'info',
    category: 'Compliance',
    title: 'Waste Return Deadline Approaching',
    description: 'Chemical Waste at Bharati is OVERDUE for return.',
    timestamp: '2026-09-25 07:00 UTC',
    acknowledged: false,
    dismissed: false,
    read: false,
  },
];

// --- Initial Activity Log ---
export const initialActivity: ActivityLog[] = [
  { id: 'act-1', timestamp: '08:42 UTC', message: 'Cargo manifest updated', type: 'cargo' },
  { id: 'act-2', timestamp: '08:38 UTC', message: 'Traverse Alpha location updated', type: 'personnel' },
  { id: 'act-3', timestamp: '08:35 UTC', message: 'Inventory scan completed', type: 'inventory' },
  { id: 'act-4', timestamp: '08:29 UTC', message: 'Waste return record created', type: 'compliance' },
  { id: 'act-5', timestamp: '08:15 UTC', message: 'Cold-chain monitoring cycle complete', type: 'inventory' },
  { id: 'act-6', timestamp: '07:50 UTC', message: 'Emergency fuel level checked', type: 'inventory' },
];

// --- Map markers ---
export const initialMapMarkers: MapMarker[] = [
  { id: 'mkr-maitri', label: 'Maitri Station', type: 'station', x: 28, y: 62, status: 'station' },
  { id: 'mkr-bharati', label: 'Bharati Station', type: 'station', x: 72, y: 35, status: 'station' },
  { id: 'mkr-alpha', label: 'Field Traverse Alpha', type: 'traverse', x: 42, y: 50, status: 'normal' },
  { id: 'mkr-beta', label: 'Field Traverse Beta', type: 'traverse', x: 58, y: 42, status: 'warning' },
  { id: 'mkr-cargo', label: 'Cargo Route', type: 'cargo', x: 50, y: 70, status: 'normal' },
  { id: 'mkr-emergency', label: 'Emergency Beacon', type: 'emergency', x: 0, y: 0, status: 'emergency' },
];

// --- Personnel list ---
export const personnelList = [
  { id: 'P-001', name: 'Dr. Arjun Mehta', role: 'Expedition Leader', station: 'Bharati', status: 'Deployed', mission: 'Antarctica Research Expedition 2026' },
  { id: 'P-002', name: 'Lt. Priya Nair', role: 'Logistics Officer', station: 'Maitri', status: 'Deployed', mission: 'Antarctic Logistics Support Mission 2026' },
  { id: 'P-003', name: 'Dr. Vikram Rao', role: 'Glaciologist', station: 'Bharati', status: 'Deployed', mission: 'Antarctica Research Expedition 2026' },
  { id: 'P-004', name: 'Sgt. Rohit Singh', role: 'Vehicle Operator', station: 'Maitri', status: 'Field', mission: 'Traverse Team Alpha' },
  { id: 'P-005', name: 'Dr. Anjali Kumar', role: 'Marine Biologist', station: 'Bharati', status: 'Deployed', mission: 'Antarctica Research Expedition 2026' },
  { id: 'P-006', name: 'Cpl. Sana Khan', role: 'Comms Specialist', station: 'Maitri', status: 'Field', mission: 'Traverse Team Beta' },
  { id: 'P-007', name: 'Dr. Rajesh Gupta', role: 'Atmospheric Scientist', station: 'Bharati', status: 'Deployed', mission: 'Antarctica Research Expedition 2026' },
  { id: 'P-008', name: 'Lt. Meera Joshi', role: 'Medical Officer', station: 'Maitri', status: 'Deployed', mission: 'Antarctic Logistics Support Mission 2026' },
  { id: 'P-009', name: 'Sgt. Karan Patel', role: 'Field Technician', station: 'Bharati', status: 'Deployed', mission: 'Antarctica Research Expedition 2026' },
  { id: 'P-010', name: 'Dr. Neha Sharma', role: 'Geologist', station: 'Maitri', status: 'Standby', mission: 'Antarctic Logistics Support Mission 2026' },
];

// --- Sync history initial ---
export const initialSyncHistory: SyncTransaction[] = [
  {
    id: 'sync-001',
    type: 'Inventory Sync',
    station: 'Maitri',
    timestamp: '2026-09-25 06:00 UTC',
    status: 'SYNCED',
    payloadSize: 32,
    payloadPreview: '0x41 0x22 0x7F 0x01 0xA3 0xB0',
    direction: 'OUT',
    records: 5,
  },
  {
    id: 'sync-002',
    type: 'Telemetry Sync',
    station: 'Bharati',
    timestamp: '2026-09-25 04:00 UTC',
    status: 'SYNCED',
    payloadSize: 24,
    payloadPreview: '0x12 0xFE 0x03 0x88 0xB0 0x0C',
    direction: 'OUT',
    records: 3,
  },
  {
    id: 'sync-003',
    type: 'Cargo Manifest',
    station: 'Maitri',
    timestamp: '2026-09-25 02:00 UTC',
    status: 'SYNCED',
    payloadSize: 48,
    payloadPreview: '0x7F 0x01 0xA3 0xB0 0x0C 0x88',
    direction: 'OUT',
    records: 8,
  },
];

// --- Helper: generate hex payload ---
export function generateHexPayload(bytes: number = 8): string {
  const hex = '0123456789ABCDEF';
  const parts: string[] = [];
  for (let i = 0; i < bytes; i++) {
    parts.push(`0x${hex[Math.floor(Math.random() * 16)]}${hex[Math.floor(Math.random() * 16)]}`);
  }
  return parts.join(' ');
}

// --- Asset scan templates ---
export const scanableAssets = [
  { assetId: 'MTR-MED-024', item: 'Emergency Medical Kit', station: 'Maitri', category: 'Emergency Supplies' },
  { assetId: 'BHR-SCI-031', item: 'GPS Receiver Unit', station: 'Bharati', category: 'Scientific Equipment' },
  { assetId: 'MTR-SP-042', item: 'Generator Spare Parts', station: 'Maitri', category: 'Spare Parts' },
  { assetId: 'BHR-EM-055', item: 'Emergency Beacon Unit', station: 'Bharati', category: 'Emergency Supplies' },
  { assetId: 'MTR-RA-067', item: 'Polar Ration Packs', station: 'Maitri', category: 'Rations' },
];
