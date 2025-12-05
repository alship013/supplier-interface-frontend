import { Contract, ContractTemplate, ContractType, ContractStatus } from '@/types/contract';

export const mockContracts: Contract[] = [
  {
    id: 'contract_001',
    contractNumber: 'GC-2024-001',
    supplierId: 'sup_001',
    supplierName: 'PT Agro Lestari Jaya',
    type: ContractType.LONG_TERM_SUPPLY,
    status: ContractStatus.ACTIVE,
    title: 'Crude Palm Oil Supply Agreement',
    description: 'Long-term supply agreement for high-quality CPO with sustainability certification requirements',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    signingDate: '2023-12-15',
    value: 5000000,
    currency: 'IDR',
    expectedVolume: 500,
    volumeUnit: 'MT',
    qualityRequirements: [
      {
        id: 'qr_001',
        parameter: 'Free Fatty Acid (FFA)',
        requirement: 'Maximum 5%',
        testMethod: 'AOAC Cd 3-25',
        maximumValue: 5,
        unit: '%',
        critical: true
      },
      {
        id: 'qr_002',
        parameter: 'Moisture Content',
        requirement: 'Maximum 0.2%',
        testMethod: 'AOAC 925.10',
        maximumValue: 0.2,
        unit: '%',
        critical: false
      },
      {
        id: 'qr_003',
        parameter: 'Dirt Content',
        requirement: 'Maximum 0.02%',
        testMethod: 'AOAC Ba 3a-38',
        maximumValue: 0.02,
        unit: '%',
        critical: false
      }
    ],
    deliveryTerms: {
      location: 'Genco Oil Processing Plant, Medan',
      incoterms: 'FCA (Free Carrier)',
      deliveryFrequency: 'Weekly',
      leadTime: 7,
      deliveryWindow: 'Monday-Friday, 08:00-17:00',
      transportResponsibility: 'shared'
    },
    paymentTerms: {
      paymentMethod: 'Bank Transfer',
      paymentDays: 30,
      paymentFrequency: 'Monthly',
      currency: 'IDR',
      retentionAmount: 5,
      paymentSchedule: [
        {
          id: 'ps_001',
          description: 'Monthly Payment for Delivered Volume',
          percentage: 95,
          dueDate: '2024-02-01',
          status: 'paid'
        },
        {
          id: 'ps_002',
          description: 'Retention Release',
          percentage: 5,
          dueDate: '2024-07-01',
          status: 'pending'
        }
      ]
    },
    pricingModel: {
      type: 'formula',
      basePricePerUnit: 14000,
      priceUnit: 'IDR/kg',
      priceFormula: 'Base Price + (Market Index × 0.3) + Quality Premium',
      indexReference: 'ICIS CPO Price Index',
      qualityBenchmarks: [
        {
          parameter: 'FFA',
          bonusPercentage: 2,
          penaltyPercentage: 3,
          targetValue: 3
        }
      ]
    },
    basePrice: 14000,
    priceAdjustments: [
      {
        id: 'pa_001',
        type: 'quality_bonus',
        description: 'Premium for FFA below 3%',
        condition: 'FFA < 3%',
        adjustmentPercentage: 2,
        effectiveFrom: '2024-01-01'
      }
    ],
    requiredCertifications: ['ISCC', 'RSPO', 'Halal'],
    complianceStandards: ['EUDR', 'Indonesian Sustainable Palm Oil (ISPO)'],
    assignedManager: 'John Doe',
    reviewDate: '2024-06-01',
    autoRenewal: true,
    renewalNoticeDays: 90,
    amendments: [],
    performanceMetrics: {
      deliveredVolume: 450,
      qualityScore: 94,
      onTimeDelivery: 98,
      complianceScore: 100
    },
    createdAt: '2023-12-01',
    updatedAt: '2024-01-15',
    createdBy: 'admin'
  },
  {
    id: 'contract_002',
    contractNumber: 'GC-2024-002',
    supplierId: 'sup_002',
    supplierName: 'Koperasi Petani Sawit Raya',
    type: ContractType.FARMER_CONTRACT,
    status: ContractStatus.ACTIVE,
    title: 'Smallholder Farmer Supply Contract',
    description: 'Direct procurement contract from smallholder farmer cooperative',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    signingDate: '2024-02-20',
    value: 800000,
    currency: 'IDR',
    expectedVolume: 80,
    volumeUnit: 'MT',
    qualityRequirements: [
      {
        id: 'qr_004',
        parameter: 'Free Fatty Acid (FFA)',
        requirement: 'Maximum 7%',
        testMethod: 'AOAC Cd 3-25',
        maximumValue: 7,
        unit: '%',
        critical: true
      }
    ],
    deliveryTerms: {
      location: 'Collection Point, Riau',
      incoterms: 'EXW (Ex Works)',
      deliveryFrequency: 'Bi-weekly',
      leadTime: 3,
      deliveryWindow: 'Monday & Thursday, 07:00-14:00',
      transportResponsibility: 'buyer'
    },
    paymentTerms: {
      paymentMethod: 'Bank Transfer',
      paymentDays: 14,
      paymentFrequency: 'Bi-weekly',
      currency: 'IDR',
      advancePayment: 30,
      paymentSchedule: [
        {
          id: 'ps_003',
          description: 'Advance Payment',
          percentage: 30,
          dueDate: '2024-02-28',
          status: 'paid'
        }
      ]
    },
    pricingModel: {
      type: 'fixed',
      basePricePerUnit: 12000,
      priceUnit: 'IDR/kg'
    },
    basePrice: 12000,
    priceAdjustments: [],
    requiredCertifications: ['ISCC'],
    complianceStandards: ['EUDR'],
    assignedManager: 'Jane Smith',
    reviewDate: '2024-09-01',
    autoRenewal: false,
    renewalNoticeDays: 60,
    amendments: [],
    performanceMetrics: {
      deliveredVolume: 25,
      qualityScore: 88,
      onTimeDelivery: 92,
      complianceScore: 95
    },
    createdAt: '2024-02-01',
    updatedAt: '2024-03-01',
    createdBy: 'jane_smith'
  },
  {
    id: 'contract_003',
    contractNumber: 'GC-2024-003',
    supplierId: 'sup_003',
    supplierName: 'CV Sinar Makmur',
    type: ContractType.TRIAL_SUPPLY,
    status: ContractStatus.PENDING_SIGNATURE,
    title: 'Trial Supply Agreement',
    description: '3-month trial supply agreement for new supplier qualification',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    value: 300000,
    currency: 'IDR',
    expectedVolume: 30,
    volumeUnit: 'MT',
    qualityRequirements: [
      {
        id: 'qr_005',
        parameter: 'Free Fatty Acid (FFA)',
        requirement: 'Maximum 5%',
        testMethod: 'AOAC Cd 3-25',
        maximumValue: 5,
        unit: '%',
        critical: true
      }
    ],
    deliveryTerms: {
      location: 'Genco Oil Processing Plant, Medan',
      incoterms: 'FCA (Free Carrier)',
      deliveryFrequency: 'Monthly',
      leadTime: 5,
      deliveryWindow: 'First week of each month',
      transportResponsibility: 'supplier'
    },
    paymentTerms: {
      paymentMethod: 'Bank Transfer',
      paymentDays: 21,
      paymentFrequency: 'Monthly',
      currency: 'IDR'
    },
    pricingModel: {
      type: 'fixed',
      basePricePerUnit: 13500,
      priceUnit: 'IDR/kg'
    },
    basePrice: 13500,
    priceAdjustments: [],
    requiredCertifications: ['ISCC'],
    complianceStandards: ['EUDR'],
    assignedManager: 'Mike Johnson',
    reviewDate: '2024-05-15',
    autoRenewal: false,
    renewalNoticeDays: 30,
    amendments: [],
    createdAt: '2024-04-15',
    updatedAt: '2024-05-01',
    createdBy: 'mike_johnson'
  }
];

export const mockContractTemplates: ContractTemplate[] = [
  {
    id: 'template_001',
    name: 'Standard Long-Term Supply Agreement',
    description: 'Template for long-term supply contracts with established suppliers',
    type: ContractType.LONG_TERM_SUPPLY,
    isDefault: true,
    clauses: [
      {
        id: 'clause_001',
        title: 'Supply Commitment',
        content: 'Supplier commits to deliver the specified volume of products meeting quality requirements throughout the contract period.',
        required: true,
        editable: true,
        category: 'commercial'
      },
      {
        id: 'clause_002',
        title: 'Quality Standards',
        content: 'All products must meet the quality specifications outlined in Schedule A of this agreement.',
        required: true,
        editable: false,
        category: 'technical'
      },
      {
        id: 'clause_003',
        title: 'Price Adjustment Mechanism',
        content: 'Prices will be adjusted quarterly based on market index changes as defined in Schedule B.',
        required: true,
        editable: true,
        category: 'commercial'
      }
    ],
    requiredCertifications: ['ISCC', 'RSPO', 'Halal'],
    standardTerms: {
      paymentTerms: {
        paymentMethod: 'Bank Transfer',
        paymentDays: 30,
        paymentFrequency: 'Monthly',
        currency: 'IDR',
        retentionAmount: 5,
        paymentSchedule: []
      },
      deliveryTerms: {
        location: 'Genco Oil Processing Plant',
        incoterms: 'FCA (Free Carrier)',
        deliveryFrequency: 'Weekly',
        leadTime: 7,
        deliveryWindow: 'Business hours',
        transportResponsibility: 'shared'
      },
      qualityRequirements: [
        {
          id: 'qr_std_001',
          parameter: 'Free Fatty Acid (FFA)',
          requirement: 'Maximum 5%',
          testMethod: 'AOAC Cd 3-25',
          maximumValue: 5,
          unit: '%',
          critical: true
        }
      ],
      pricingModel: {
        type: 'formula',
        basePricePerUnit: 14000,
        priceUnit: 'IDR/kg',
        priceFormula: 'Base Price + (Market Index × 0.3)',
        indexReference: 'ICIS CPO Price Index'
      }
    },
    createdAt: '2023-01-01',
    createdBy: 'admin'
  },
  {
    id: 'template_002',
    name: 'Smallholder Farmer Contract',
    description: 'Template for contracts with smallholder farmer cooperatives',
    type: ContractType.FARMER_CONTRACT,
    isDefault: false,
    clauses: [
      {
        id: 'clause_004',
        title: 'Sustainability Requirements',
        content: 'Farmer must maintain sustainable farming practices and provide necessary documentation.',
        required: true,
        editable: false,
        category: 'compliance'
      },
      {
        id: 'clause_005',
        title: 'Price Support',
        content: 'Minimum price guarantee provided to protect farmers from market volatility.',
        required: true,
        editable: true,
        category: 'commercial'
      }
    ],
    requiredCertifications: ['ISCC'],
    standardTerms: {
      paymentTerms: {
        paymentMethod: 'Bank Transfer',
        paymentDays: 14,
        paymentFrequency: 'Bi-weekly',
        currency: 'IDR',
        advancePayment: 30,
        paymentSchedule: []
      },
      deliveryTerms: {
        location: 'Designated Collection Point',
        incoterms: 'EXW (Ex Works)',
        deliveryFrequency: 'Bi-weekly',
        leadTime: 3,
        deliveryWindow: 'Business hours',
        transportResponsibility: 'buyer'
      },
      qualityRequirements: [
        {
          id: 'qr_std_002',
          parameter: 'Free Fatty Acid (FFA)',
          requirement: 'Maximum 7%',
          testMethod: 'AOAC Cd 3-25',
          maximumValue: 7,
          unit: '%',
          critical: true
        }
      ],
      pricingModel: {
        type: 'fixed',
        basePricePerUnit: 12000,
        priceUnit: 'IDR/kg'
      }
    },
    createdAt: '2023-02-01',
    createdBy: 'admin'
  },
  {
    id: 'template_003',
    name: 'Trial Supply Agreement',
    description: 'Template for trial periods with new suppliers',
    type: ContractType.TRIAL_SUPPLY,
    isDefault: false,
    clauses: [
      {
        id: 'clause_006',
        title: 'Trial Period',
        content: 'This agreement covers a 3-month trial period to evaluate supplier capability and quality.',
        required: true,
        editable: false,
        category: 'commercial'
      },
      {
        id: 'clause_007',
        title: 'Performance Evaluation',
        content: 'Supplier performance will be evaluated based on quality, delivery timeliness, and compliance.',
        required: true,
        editable: false,
        category: 'technical'
      }
    ],
    requiredCertifications: ['ISCC'],
    standardTerms: {
      paymentTerms: {
        paymentMethod: 'Bank Transfer',
        paymentDays: 21,
        paymentFrequency: 'Monthly',
        currency: 'IDR'
      },
      deliveryTerms: {
        location: 'Genco Oil Processing Plant',
        incoterms: 'FCA (Free Carrier)',
        deliveryFrequency: 'Monthly',
        leadTime: 5,
        deliveryWindow: 'First week of month',
        transportResponsibility: 'supplier'
      },
      qualityRequirements: [
        {
          id: 'qr_std_003',
          parameter: 'Free Fatty Acid (FFA)',
          requirement: 'Maximum 5%',
          testMethod: 'AOAC Cd 3-25',
          maximumValue: 5,
          unit: '%',
          critical: true
        }
      ],
      pricingModel: {
        type: 'fixed',
        basePricePerUnit: 13500,
        priceUnit: 'IDR/kg'
      }
    },
    createdAt: '2023-03-01',
    createdBy: 'admin'
  }
];