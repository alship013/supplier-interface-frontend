export interface Contract {
  id: string;
  contractNumber: string;
  supplierId: string;
  supplierName: string;
  type: ContractType;
  status: ContractStatus;
  title: string;
  description: string;

  // Contract Details
  startDate: string;
  endDate: string;
  signingDate?: string;
  value: number;
  currency: string;

  // Supply Terms
  expectedVolume: number;
  volumeUnit: string;
  qualityRequirements: QualityRequirement[];
  deliveryTerms: DeliveryTerms;
  paymentTerms: PaymentTerms;

  // Pricing Structure
  pricingModel: PricingModel;
  basePrice: number;
  priceAdjustments: PriceAdjustment[];

  // Compliance & Certifications
  requiredCertifications: string[];
  complianceStandards: string[];

  // Management
  assignedManager: string;
  reviewDate: string;
  autoRenewal: boolean;
  renewalNoticeDays: number;

  // Documents
  contractDocument?: string;
  amendments: ContractAmendment[];

  // Performance Tracking
  performanceMetrics?: {
    deliveredVolume: number;
    qualityScore: number;
    onTimeDelivery: number;
    complianceScore: number;
  };

  // System Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface QualityRequirement {
  id: string;
  parameter: string;
  requirement: string;
  testMethod: string;
  minimumValue?: number;
  maximumValue?: number;
  unit?: string;
  critical: boolean;
}

export interface DeliveryTerms {
  location: string;
  incoterms: string;
  deliveryFrequency: string;
  leadTime: number;
  deliveryWindow: string;
  transportResponsibility: 'supplier' | 'buyer' | 'shared';
}

export interface PaymentTerms {
  paymentMethod: string;
  paymentDays: number;
  paymentFrequency: string;
  currency: string;
  advancePayment?: number;
  retentionAmount?: number;
  paymentSchedule: PaymentMilestone[];
}

export interface PaymentMilestone {
  id: string;
  description: string;
  percentage: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface PricingModel {
  type: 'fixed' | 'formula' | 'index_linked' | 'quality_based';
  basePricePerUnit: number;
  priceUnit: string;
  priceFormula?: string;
  indexReference?: string;
  qualityBenchmarks?: QualityBenchmark[];
}

export interface QualityBenchmark {
  parameter: string;
  bonusPercentage: number;
  penaltyPercentage: number;
  targetValue: number;
}

export interface PriceAdjustment {
  id: string;
  type: 'quality_bonus' | 'volume_discount' | 'market_adjustment' | 'inflation_index';
  description: string;
  condition: string;
  adjustmentPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface ContractAmendment {
  id: string;
  version: number;
  date: string;
  description: string;
  changes: string[];
  approvedBy: string;
  document?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  type: ContractType;
  isDefault: boolean;
  clauses: ContractClause[];
  requiredCertifications: string[];
  standardTerms: {
    paymentTerms: PaymentTerms;
    deliveryTerms: DeliveryTerms;
    qualityRequirements: QualityRequirement[];
    pricingModel: PricingModel;
  };
  createdAt: string;
  createdBy: string;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  required: boolean;
  editable: boolean;
  category: 'commercial' | 'legal' | 'technical' | 'compliance';
}

export const ContractType = {
  PURCHASE_AGREEMENT: 'purchase_agreement',
  FARMER_CONTRACT: 'farmer_contract',
  SUPPLIER_AGREEMENT: 'supplier_agreement',
  LONG_TERM_SUPPLY: 'long_term_supply',
  TRIAL_SUPPLY: 'trial_supply',
  EXCLUSIVE_SUPPLY: 'exclusive_supply'
} as const;

export type ContractType = typeof ContractType[keyof typeof ContractType];

export const ContractStatus = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PENDING_SIGNATURE: 'pending_signature',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed'
} as const;

export type ContractStatus = typeof ContractStatus[keyof typeof ContractStatus];

export interface ContractCreationData {
  supplierId: string;
  type: ContractType;
  templateId?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  expectedVolume: number;
  volumeUnit: string;
  basePrice: number;
  priceUnit: string;
  customTerms?: Partial<Contract>;
}