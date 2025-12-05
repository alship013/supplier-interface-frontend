export interface IntakeRecord {
  id: string;
  intakeNumber: string;
  supplierId: string;
  supplierName: string;
  contractId?: string;
  deliveryDate: string;
  receivedDate: string;
  receivedBy: string;

  // Vehicle and Transport Details
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  transportCompany?: string;
  arrivalTime: string;
  departureTime: string;

  // Material Details
  rawMaterialType: RawMaterialType;
  expectedQuantity: number;
  receivedQuantity: number;
  unit: string;
  moistureContent: number;
  temperature: number;
  contaminationLevel: number;

  // Quality Assessment at Intake
  visualInspection: VisualInspection;
  preliminaryTests: PreliminaryTest[];
  acceptanceStatus: AcceptanceStatus;
  rejectionReasons?: string[];

  // Documentation
  deliveryNoteNumber: string;
  weighingTickets: WeighingTicket[];
  photos: IntakePhoto[];
  sampleCollected: boolean;
  sampleId?: string;

  // Storage Assignment
  storageLocation: string;
  storageBin?: string;
  quarantineStatus: QuarantineStatus;
  quarantineExpiryDate?: string;

  // System Fields
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ProcessingBatch {
  id: string;
  batchNumber: string;
  parentIntakeIds: string[];
  processingDate: string;
  processingStartTime: string;
  processingEndTime?: string;
  processedBy: string;
  processingLine: ProcessingLine;

  // Input Materials
  inputMaterials: BatchMaterial[];
  totalInputQuantity: number;

  // Processing Details
  processingSteps: ProcessingStep[];
  qualityChecks: QualityCheck[];
  outputProducts: OutputProduct[];

  // Batch Performance
  actualYield: number;
  expectedYield: number;
  yieldVariance: number;
  processingEfficiency: number;
  energyConsumption: number;
  waterUsage: number;

  // Quality Results
  finalQualityResults: FinalQualityResult[];
  batchStatus: BatchStatus;
  holdsOrIssues: BatchIssue[];

  // Traceability
  sourceIntakes: IntakeRecord[];
  outputBatches?: string[];
  customerAllocation?: string;

  // System Fields
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface QualityTest {
  id: string;
  testNumber: string;
  batchId?: string;
  intakeId?: string;
  sampleId: string;
  testType: QualityTestType;
  testDate: string;
  testedBy: string;
  laboratory?: string;
  certificationBody?: string;

  // Test Parameters
  parameters: TestParameter[];
  testMethod: string;
  equipmentUsed?: string;
  testConditions: TestCondition[];

  // Results
  testStatus: TestStatus;
  overallResult: TestResult;
  detailedResults: DetailedTestResult[];

  // Compliance
  specificationsMet: boolean;
  nonConformances: NonConformance[];
  correctiveActions?: string[];

  // Documentation
  testReportUrl?: string;
  analystSignature?: string;
  supervisorSignature?: string;
  certificationDate?: string;

  // System Fields
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface InventoryRecord {
  id: string;
  productType: ProductType;
  batchId: string;
  batchNumber: string;
  location: StorageLocation;
  binNumber?: string;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  status: InventoryStatus;

  // Quality and Compliance
  qualityTestResults?: string[];
  certifications: string[];
  expiryDate?: string;
  quarantineStatus: QuarantineStatus;
  quarantineReasons?: string[];

  // Movement Tracking
  lastMovementDate: string;
  movementHistory: InventoryMovement[];
  allocatedQuantity: number;
  availableQuantity: number;

  // Cost and Valuation
  unitCost: number;
  totalValue: number;
  currency: string;
  valuationDate: string;

  // System Fields
  createdAt: string;
  updatedAt: string;
  lastCountedDate?: string;
  varianceCount?: number;
}

export interface ProcessingStep {
  id: string;
  stepName: string;
  stepType: ProcessingStepType;
  sequence: number;
  startTime: string;
  endTime?: string;
  duration?: number;

  // Parameters
  temperature?: number;
  pressure?: number;
  humidity?: number;
  ph?: number;
  otherParameters: {[key: string]: any};

  // Equipment and Personnel
  equipmentId?: string;
  equipmentName?: string;
  operatorId: string;
  operatorName: string;
  supervisorId?: string;
  supervisorName?: string;

  // Quality Control
  qualityChecks: StepQualityCheck[];
  inProcessSampling: boolean;
  sampleIds?: string[];

  // Performance
  targetOutput: number;
  actualOutput: number;
  efficiency: number;

  // Issues and Notes
  issues?: string[];
  notes?: string;
  completedSuccessfully: boolean;
}

export interface QualityCheck {
  id: string;
  checkName: string;
  checkType: QualityCheckType;
  sequence: number;
  mandatory: boolean;

  // Timing
  scheduledTime?: string;
  actualTime: string;
  completedAt?: string;

  // Responsibility
  checkedBy: string;
  checkedByName: string;
  supervisorId?: string;

  // Results
  passed: boolean;
  measurements: QualityMeasurement[];
  observations?: string;
  deviations?: QualityDeviation[];

  // Documentation
  photoEvidence?: string[];
  instrumentReadings?: InstrumentReading[];

  // Follow-up Actions
  requiresFollowUp: boolean;
  followUpActions?: string[];
  followUpCompleted: boolean;
  followUpCompletedAt?: string;
}

// Enums as const
export const RawMaterialType = {
  CRUDE_PALM_OIL: 'crude_palm_oil',
  PALM_KERNEL: 'palm_kernel',
  PALM_KERNEL_OIL: 'palm_kernel_oil',
  EMPTY_FRUIT_BUNCHES: 'empty_fruit_bunches',
  FIBER: 'fiber',
  SHELL: 'shell'
} as const;

export type RawMaterialType = typeof RawMaterialType[keyof typeof RawMaterialType];

export const AcceptanceStatus = {
  ACCEPTED: 'accepted',
  CONDITIONALLY_ACCEPTED: 'conditionally_accepted',
  REJECTED: 'rejected',
  QUARANTINE: 'quarantine',
  PENDING_ANALYSIS: 'pending_analysis'
} as const;

export type AcceptanceStatus = typeof AcceptanceStatus[keyof typeof AcceptanceStatus];

export const QuarantineStatus = {
  NONE: 'none',
  QUALITY_HOLD: 'quality_hold',
  COMPLIANCE_HOLD: 'compliance_hold',
  DOCUMENTATION_HOLD: 'documentation_hold',
  INVESTIGATION_HOLD: 'investigation_hold'
} as const;

export type QuarantineStatus = typeof QuarantineStatus[keyof typeof QuarantineStatus];

export const ProcessingLine = {
  LINE_1: 'line_1',
  LINE_2: 'line_2',
  LINE_3: 'line_3',
  PILOT_PLANT: 'pilot_plant',
  REFINERY_LINE: 'refinery_line'
} as const;

export type ProcessingLine = typeof ProcessingLine[keyof typeof ProcessingLine];

export const BatchStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  FAILED: 'failed',
  REWORK: 'rework',
  QUALITY_APPROVED: 'quality_approved',
  QUALITY_REJECTED: 'quality_rejected',
  RELEASED: 'released',
  SHIPPED: 'shipped'
} as const;

export type BatchStatus = typeof BatchStatus[keyof typeof BatchStatus];

export const QualityTestType = {
  PHYSICAL: 'physical',
  CHEMICAL: 'chemical',
  MICROBIOLOGICAL: 'microbiological',
  SENSORY: 'sensory',
  CONTAMINANT: 'contaminant',
  NUTRITIONAL: 'nutritional'
} as const;

export type QualityTestType = typeof QualityTestType[keyof typeof QualityTestType];

export const TestStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export type TestStatus = typeof TestStatus[keyof typeof TestStatus];

export const TestResult = {
  PASS: 'pass',
  FAIL: 'fail',
  MARGINAL: 'marginal',
  EXCEPTION: 'exception'
} as const;

export type TestResult = typeof TestResult[keyof typeof TestResult];

export const ProcessingStepType = {
  CLEANING: 'cleaning',
  CRUSHING: 'crushing',
  PRESSING: 'pressing',
  SEPARATION: 'separation',
  REFINING: 'refining',
  BLEACHING: 'bleaching',
  DEODORIZING: 'deodorizing',
  FRACTIONATION: 'fractionation',
  PACKAGING: 'packaging',
  QUALITY_CHECK: 'quality_check',
  STORAGE: 'storage'
} as const;

export type ProcessingStepType = typeof ProcessingStepType[keyof typeof ProcessingStepType];

export const QualityCheckType = {
  PHYSICAL: 'physical',
  CHEMICAL: 'chemical',
  MICROBIOLOGICAL: 'microbiological',
  SENSORY: 'sensory',
  CONTAMINANT: 'contaminant',
  NUTRITIONAL: 'nutritional'
} as const;

export type QualityCheckType = typeof QualityCheckType[keyof typeof QualityCheckType];

export const ProductType = {
  CRUDE_PALM_OIL: 'crude_palm_oil',
  REFINED_PALM_OIL: 'refined_palm_oil',
  PALM_KERNEL_OIL: 'palm_kernel_oil',
  REFINED_PKO: 'refined_pko',
  PALM_FATTY_ACID: 'palm_fatty_acid',
  GLYCERIN: 'glycerin',
  BIODIESEL: 'biodiesel'
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

export const QualityGrade = {
  PREMIUM: 'premium',
  STANDARD: 'standard',
  COMMERCIAL: 'commercial',
  INDUSTRIAL: 'industrial',
  REJECT: 'reject'
} as const;

export type QualityGrade = typeof QualityGrade[keyof typeof QualityGrade];

export const InventoryStatus = {
  AVAILABLE: 'available',
  ALLOCATED: 'allocated',
  RESERVED: 'reserved',
  IN_TRANSIT: 'in_transit',
  QUALITY_HOLD: 'quality_hold',
  EXPIRED: 'expired',
  DAMAGED: 'damaged'
} as const;

export type InventoryStatus = typeof InventoryStatus[keyof typeof InventoryStatus];

// Supporting Interfaces
export interface VisualInspection {
  appearance: string;
  color: string;
  odor: string;
  foreignMatter: string;
  containerCondition: string;
  sealCondition: string;
  temperatureCondition: string;
  overallCondition: string;
  photos: string[];
}

export interface PreliminaryTest {
  type: string;
  result: string;
  unit?: string;
  method: string;
  instrument?: string;
  timestamp: string;
  performedBy: string;
}

export interface WeighingTicket {
  id: string;
  ticketNumber: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  unit: string;
  weighingTime: string;
  scaleId: string;
  operatorName: string;
  verified: boolean;
  photoUrl?: string;
}

export interface IntakePhoto {
  id: string;
  url: string;
  type: 'vehicle' | 'material' | 'documentation' | 'damage' | 'sample';
  description?: string;
  timestamp: string;
  takenBy: string;
}

export interface BatchMaterial {
  materialType: RawMaterialType;
  sourceIntakeId: string;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  storageLocation: string;
}

export interface OutputProduct {
  productType: ProductType;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  batchNumber: string;
  storageLocation: string;
  certifications: string[];
}

export interface FinalQualityResult {
  parameter: string;
  value: number;
  unit: string;
  specification: {
    minimum: number;
    maximum: number;
    target: number;
  };
  result: TestResult;
  deviation: number;
  withinSpec: boolean;
}

export interface BatchIssue {
  id: string;
  type: 'quality' | 'equipment' | 'process' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  detectedBy: string;
  resolved: boolean;
  resolvedAt?: string;
  resolution?: string;
  impact: string;
}

export interface TestParameter {
  name: string;
  value: number;
  unit: string;
  specification: {
    minimum?: number;
    maximum?: number;
    target?: number;
  };
  result: TestResult;
  method: string;
  notes?: string;
}

export interface TestCondition {
  parameter: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface DetailedTestResult {
  testPoint: string;
  expected: number;
  actual: number;
  tolerance: number;
  passed: boolean;
  notes?: string;
}

export interface NonConformance {
  id: string;
  parameter: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  impact: string;
  requiredAction: string;
  dueDate: string;
  responsibleParty: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface StorageLocation {
  warehouse: string;
  zone: string;
  area: string;
  rack?: string;
  shelf?: string;
}

export interface InventoryMovement {
  id: string;
  movementType: 'receipt' | 'transfer' | 'allocation' | 'shipment' | 'adjustment' | 'return';
  fromLocation?: string;
  toLocation?: string;
  quantity: number;
  unit: string;
  referenceNumber?: string;
  reason: string;
  performedBy: string;
  timestamp: string;
  approvedBy?: string;
  notes?: string;
}

export interface StepQualityCheck {
  name: string;
  type: 'parameter' | 'visual' | 'instrumental';
  specification: any;
  result: any;
  passed: boolean;
  checkedAt: string;
  checkedBy: string;
}

export interface QualityMeasurement {
  parameter: string;
  value: number;
  unit: string;
  specification: any;
  result: TestResult;
  measurementTime: string;
  instrument?: string;
}

export interface QualityDeviation {
  parameter: string;
  expected: any;
  actual: any;
  tolerance: number;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  actionRequired: boolean;
  actionTaken?: string;
}

export interface InstrumentReading {
  instrumentId: string;
  instrumentName: string;
  readingType: string;
  value: number;
  unit: string;
  calibrationDate: string;
  readingTime: string;
  operator: string;
}

// Processing Workflows
export interface ProcessingWorkflow {
  id: string;
  name: string;
  productType: ProductType;
  version: number;
  steps: WorkflowStep[];
  qualityGates: QualityGate[];
  approvals: ApprovalRequirement[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  sequence: number;
  type: ProcessingStepType;
  duration: number;
  requiredPersonnel: PersonnelRequirement[];
  requiredEquipment: EquipmentRequirement[];
  qualityRequirements: QualityRequirement[];
  parameters: ProcessParameter[];
}

export interface QualityGate {
  id: string;
  name: string;
  sequence: number;
  requiredTests: string[];
  passCriteria: PassCriteria[];
  canProceed: boolean;
  requiresApproval: boolean;
  approvers: string[];
}

export interface PassCriteria {
  parameter: string;
  condition: string;
  value: any;
}

export interface ApprovalRequirement {
  step: string;
  role: string;
  minimumApprovers: number;
  required: boolean;
}

export interface PersonnelRequirement {
  role: string;
  skill: string;
  certification: string;
  minimumExperience: number;
  quantity: number;
}

export interface EquipmentRequirement {
  equipmentId: string;
  equipmentType: string;
  capacity: number;
  requiredForStep: boolean;
}

export interface QualityRequirement {
  testType: QualityTestType;
  parameters: string[];
  frequency: string;
  required: boolean;
}

export interface ProcessParameter {
  name: string;
  dataType: 'number' | 'string' | 'boolean';
  defaultValue: any;
  range: {
    minimum: number;
    maximum: number;
  };
  unit: string;
  critical: boolean;
}