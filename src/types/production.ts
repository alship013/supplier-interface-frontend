// Production Module Data Types for RTSO Production & Inventory System

export interface RMTank {
  id: string;
  tankCode: string; // e.g., "RM-A", "RM-B"
  name: string;
  description?: string;
  maxCapacity: number; // in kg
  currentWeight: number; // in kg
  productType: string; // "Rubber Seed", "Copra", etc.
  status: TankStatus;
  activeSuppliers: SupplierComposition[]; // List of suppliers contributing to this tank
  lastUpdated: string;
  location?: string;
  temperature?: number;
  qualityMetrics?: TankQualityMetrics;
}

export interface FPTank {
  id: string;
  tankCode: string; // e.g., "FP-01", "FP-02"
  name: string;
  description?: string;
  maxCapacity: number; // in kg
  currentWeight: number; // in kg
  productType: string; // "RTSO Oil", "RTSO Cake"
  status: TankStatus;
  sourceBatchIds: string[]; // Batches that contributed to this tank
  lastUpdated: string;
  location?: string;
  temperature?: number;
  qualityMetrics?: TankQualityMetrics;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string; // e.g., "BATCH-2024-001"
  sourceTankId: string;
  sourceTankCode: string;
  inputWeight: number; // kg of raw material used
  totalOutputWeight: number; // kg of finished products
  lossPercentage: number;
  lossWeight: number; // kg
  status: BatchStatus;
  isFinalized: boolean;

  // Production Details
  startTime: string;
  endTime?: string;
  operatorId?: string;
  operatorName?: string;

  // Quality Metrics for this batch
  ffa: number; // Free Fatty Acid (%)
  moisture: number; // Moisture & Impurities (%)
  qualityGrade: string; // 'A', 'B', 'C'

  // Traceability
  supplierComposition: SupplierComposition[]; // Inherited from source tank

  // Products from this batch
  inventoryUnits: InventoryUnit[]; // All barrels/bags from this batch

  // System Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InventoryUnit {
  id: string;
  unitId: string; // QR Code ID
  type: InventoryType;
  weight: number; // Net weight in kg
  batchId: string;
  batchNumber: string;
  status: InventoryStatus;

  // Quality for this specific unit
  qualityMetrics?: UnitQualityMetrics;

  // Location tracking
  currentLocation: string;
  locationHistory: LocationHistory[];

  // System Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  shippedAt?: string;
  shippedTo?: string;
}

export interface SupplierComposition {
  supplierId: string;
  supplierName: string;
  percentage: number; // % contribution to tank/batch
  weight: number; // kg contribution
  productType: string;
  sourceQuality?: {
    ffa: number;
    moisture: number;
  };
}

export interface TankQualityMetrics {
  ffa: number; // Free Fatty Acid (%)
  moisture: number; // Moisture & Impurities (%)
  purity: number; // Purity (%)
  contamination: number; // Contamination (%)
  lastTestDate: string;
  testMethod: string;
}

export interface UnitQualityMetrics {
  ffa: number; // Free Fatty Acid (%)
  moisture: number; // Moisture & Impurities (%)
  purity: number; // Purity (%)
  contamination: number; // Contamination (%)
  testDate: string;
  testedBy: string;
  testMethod: string;
  grade: string; // 'A', 'B', 'C', 'Reject'
}

export interface LocationHistory {
  location: string;
  timestamp: string;
  movedBy: string;
  purpose: string;
}

export interface ReceivingRecord {
  id: string;
  recordNumber: string;
  destinationTankId: string;
  destinationTankCode: string;
  supplierId: string;
  supplierName: string;
  productType: string;
  weight: number; // kg
  qrCodes: string[]; // Scanned QR codes
  receivingDate: string;
  receivedBy: string;
  qualityCheck?: {
    passed: boolean;
    ffa: number;
    moisture: number;
    notes?: string;
  };
  createdAt: string;
}

export interface ProductionRecord {
  id: string;
  batchId: string;
  batchNumber: string;
  operation: 'start_production' | 'add_inventory' | 'finalize_batch';
  timestamp: string;
  operatorId: string;
  operatorName: string;
  details: Record<string, any>;
  createdAt: string;
}

// Enums and Constants
export const TankStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning'
} as const;

export type TankStatus = typeof TankStatus[keyof typeof TankStatus];

export const BatchStatus = {
  INITIATED: 'initiated',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FINALIZED: 'finalized',
  CANCELLED: 'cancelled'
} as const;

export type BatchStatus = typeof BatchStatus[keyof typeof BatchStatus];

export const InventoryType = {
  BARREL: 'barrel',
  BAG: 'bag',
  DRUM: 'drum',
  TOTE: 'tote'
} as const;

export type InventoryType = typeof InventoryType[keyof typeof InventoryType];

export const InventoryStatus = {
  ACTIVE: 'active',
  SHIPPED: 'shipped',
  QUALITY_HOLD: 'quality_hold',
  DAMAGED: 'damaged',
  LOST: 'lost'
} as const;

export type InventoryStatus = typeof InventoryStatus[keyof typeof InventoryStatus];

// Production Flow Steps
export const ProductionStep = {
  RM_RECEIVING: 'rm_receiving', // Step 1
  PRODUCTION: 'production', // Step 2
  FP_PACKING: 'fp_packing' // Step 3
} as const;

export type ProductionStep = typeof ProductionStep[keyof typeof ProductionStep];

// Input validation types
export interface RMReceivingInput {
  destinationTankId: string;
  supplierId: string;
  productType: string;
  weight: number;
  qrCodes: string[];
  qualityCheck?: {
    ffa: number;
    moisture: number;
  };
}

export interface ProductionStartInput {
  sourceTankId: string;
  inputWeight: number;
  operatorName?: string;
}

export interface InventoryUnitInput {
  unitId: string; // QR Code
  type: InventoryType;
  weight: number;
  batchId: string;
  qualityMetrics?: {
    ffa: number;
    moisture: number;
  };
}

// Mass Balance Calculation Result
export interface MassBalanceResult {
  batchId: string;
  inputWeight: number;
  totalOutputWeight: number;
  lossWeight: number;
  lossPercentage: number;
  oilOutput: number;
  cakeOutput: number;
  efficiency: number;
  isAcceptableLoss: boolean; // true if loss <= 10%
  warningMessage?: string;
}

// Dashboard statistics
export interface ProductionStats {
  totalRMTanks: number;
  activeRMTanks: number;
  totalFPTanks: number;
  activeFPTanks: number;
  totalBatches: number;
  activeBatches: number;
  totalInventoryUnits: number;
  shippedUnits: number;
  averageLossPercentage: number;
  totalProductionToday: number;
  qualityMetrics: {
    averageFFA: number;
    averageMoisture: number;
    gradeDistribution: Record<string, number>;
  };
}

// Report data structures
export interface ProductionReport {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  generatedAt: string;
  generatedBy: string;

  // Summary data
  totalInput: number;
  totalOutput: number;
  totalLoss: number;
  averageLossPercentage: number;

  // Breakdown by product
  productBreakdown: Array<{
    productType: string;
    input: number;
    output: number;
    batches: number;
  }>;

  // Quality summary
  qualitySummary: {
    averageFFA: number;
    averageMoisture: number;
    gradeDistribution: Record<string, number>;
    qualityIssues: number;
  };

  // Supplier performance
  supplierPerformance: Array<{
    supplierId: string;
    supplierName: string;
    volume: number;
    averageQuality: number;
    batches: number;
  }>;
}