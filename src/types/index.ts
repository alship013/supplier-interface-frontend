export interface Contract {
  id: string;
  supplierId: string;
  startDate: string;
  endDate: string;
  terms: string;
  volume: number;
  price: number;
  status: 'active' | 'expired' | 'pending';
}

export interface FeedstockRecord {
  id: string;
  supplierId: string;
  date: string;
  volume: number;
  feedstockType: 'palm_kernel_shell' | 'empty_fruit_bunch' | 'mesocarp_fiber' | 'palm_mill_effluent' | 'shells' | 'fronds';
  quality: {
    moisture: number;
    purity: number;
    contamination: number;
    size_distribution: string;
    calorific_value?: number;
    ash_content?: number;
  };
  location: {
    name: string;
    coordinates?: { lat: number; lng: number };
    storage_facility?: string;
  };
  transport: {
    vehicle_number: string;
    driver_name: string;
    departure_time: string;
    arrival_time: string;
    transport_company: string;
  };
  photos: string[];
  documents: {
    delivery_note?: string;
    quality_certificate?: string;
    weigh_bridge_ticket?: string;
    transport_manifest?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'quality_check' | 'stored';
  inspection: {
    inspected_by: string;
    inspection_date: string;
    notes?: string;
    recommendations?: string[];
  };
  certificateUrl?: string;
  batch_number: string;
  storage_location?: string;
  expiry_date?: string;
}

export interface FeedstockInventory {
  id: string;
  feedstockType: FeedstockRecord['feedstockType'];
  totalVolume: number;
  availableVolume: number;
  allocatedVolume: number;
  qualityAverage: number;
  location: string;
  lastUpdated: string;
  batches: FeedstockRecord[];
}

export interface QualityTest {
  id: string;
  name: string;
  method: string;
  standard: string;
  unit: string;
  minAcceptance: number;
  maxAcceptance: number;
  measuredValue: number;
  result: 'pass' | 'fail' | 'pending';
  testedBy: string;
  testDate: string;
  equipment?: string;
  notes?: string;
}

export interface QualityInspection {
  id: string;
  feedstockRecordId: string;
  inspectionType: 'incoming' | 'in_process' | 'final' | 'reinspection';
  inspectorName: string;
  inspectorId: string;
  inspectionDate: string;
  location: string;
  tests: QualityTest[];
  overallResult: 'pass' | 'fail' | 'conditional_pass' | 'pending';
  totalScore: number;
  maxScore: number;
  recommendations: string[];
  nonConformities: string[];
  correctiveActions: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  certificateUrl?: string;
  photos: string[];
  approvedBy?: string;
  approvedDate?: string;
}

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  temperature?: number;
  pressure?: number;
  equipment: string;
  parameters: Record<string, any>;
  qualityChecks: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  operator: string;
  notes?: string;
}

export interface ProcessingBatch {
  id: string;
  feedstockRecordId: string;
  batchNumber: string;
  processingPlanId: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'on_hold';
  steps: ProcessingStep[];
  currentStepIndex: number;
  inputVolume: number;
  expectedOutputVolume: number;
  actualOutputVolume?: number;
  yieldPercentage?: number;
  qualityMetrics: {
    moistureBefore: number;
    moistureAfter: number;
    purityBefore: number;
    purityAfter: number;
    sizeDistributionBefore: string;
    sizeDistributionAfter: string;
    calorificValueBefore?: number;
    calorificValueAfter?: number;
  };
  costBreakdown: {
    labor: number;
    energy: number;
    equipment: number;
    materials: number;
    overhead: number;
  };
  assignedTo: string;
  supervisedBy: string;
  notes: string[];
  deviations: string[];
  qualityInspections: string[]; // IDs of QualityInspection
}

export interface ProcessingPlan {
  id: string;
  name: string;
  feedstockType: FeedstockRecord['feedstockType'];
  processingMethod: FeedstockProcessing['processingMethod'];
  steps: Omit<ProcessingStep, 'status' | 'startTime' | 'endTime' | 'operator' | 'notes'>[];
  estimatedDuration: number; // in minutes
  capacityPerBatch: number;
  qualityTargets: {
    moistureMax: number;
    purityMin: number;
    contaminationMax: number;
    calorificValueMin?: number;
    ashContentMax?: number;
  };
  requiredEquipment: string[];
  requiredPersonnel: string[];
  safetyRequirements: string[];
  environmentalControls: string[];
  costPerTon: number;
}

export interface FeedstockProcessing {
  id: string;
  batchId: string;
  feedstockType: FeedstockRecord['feedstockType'];
  processingDate: string;
  inputVolume: number;
  outputVolume: number;
  processingMethod: 'drying' | 'sizing' | 'screening' | 'pelletizing' | 'grinding';
  qualityBefore: FeedstockRecord['quality'];
  qualityAfter: FeedstockRecord['quality'];
  processingUnit: string;
  operator: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  processingBatchId?: string;
  yieldPercentage?: number;
  downtimeMinutes?: number;
  energyConsumption?: number;
  qualityScore?: number;
}

export interface Activity {
  id: string;
  type: 'registration' | 'delivery' | 'contract' | 'quality_check';
  description: string;
  timestamp: string;
  entityId: string;
  entityName: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  totalFarmers: number;
  activeSuppliers: number;
  totalVolume: number;
  averageQuality: number;
  pendingRegistrations: number;
  recentActivity: Activity[];
}

export interface Supplier {
  id: string;
  name: string;
  type: 'supplier' | 'farmer';
  email: string;
  phone: string;
  location: {
    address: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalVolume: number;
  averageQuality: number;
  complianceStatus: 'compliant' | 'non-compliant' | 'pending';
  contracts: Contract[];
  feedstockHistory: FeedstockRecord[];
  performance: {
    reliability: number;
    quality: number;
    delivery: number;
  };
}