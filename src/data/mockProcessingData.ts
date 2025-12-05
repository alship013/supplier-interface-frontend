import { IntakeRecord, ProcessingBatch, QualityTest, InventoryRecord, RawMaterialType, AcceptanceStatus, BatchStatus, QualityTestType, TestResult, ProductType, QualityGrade } from '@/types/processing';

// Mock Intake Records
export const mockIntakeRecords: IntakeRecord[] = [
  {
    id: 'intake_001',
    intakeNumber: 'INT-2024-001',
    supplierId: 'sup_001',
    supplierName: 'PT Agro Lestari Jaya',
    contractId: 'contract_001',
    deliveryDate: '2024-01-15',
    receivedDate: '2024-01-15',
    receivedBy: 'John Smith',
    vehicleNumber: 'BK 1234 ABC',
    driverName: 'Ahmad Wijaya',
    driverContact: '+62-812-3456-7890',
    transportCompany: 'PT Logistic Sejahtera',
    arrivalTime: '2024-01-15T08:30:00',
    departureTime: '2024-01-15T10:15:00',
    rawMaterialType: RawMaterialType.CRUDE_PALM_OIL,
    expectedQuantity: 5000,
    receivedQuantity: 4985,
    unit: 'kg',
    moistureContent: 0.2,
    temperature: 32.5,
    contaminationLevel: 0.02,
    visualInspection: {
      appearance: 'Clear golden yellow',
      color: 'Golden yellow',
      odor: 'Characteristic palm oil odor',
      foreignMatter: 'None detected',
      containerCondition: 'Clean and intact',
      sealCondition: 'Seal intact and valid',
      temperatureCondition: 'Ambient',
      overallCondition: 'Good',
      photos: ['intake_photo_001.jpg', 'intake_photo_002.jpg']
    },
    preliminaryTests: [
      {
        type: 'FFA Content',
        result: '4.8%',
        unit: '%',
        method: 'AOAC Cd 3-25',
        instrument: 'Titration Equipment',
        timestamp: '2024-01-15T09:00:00',
        performedBy: 'Sarah Lee'
      },
      {
        type: 'Moisture Content',
        result: '0.18%',
        unit: '%',
        method: 'Karl Fischer',
        instrument: 'KF Titrator',
        timestamp: '2024-01-15T09:15:00',
        performedBy: 'Mike Johnson'
      }
    ],
    acceptanceStatus: AcceptanceStatus.ACCEPTED,
    deliveryNoteNumber: 'DN-2024-001234',
    weighingTickets: [
      {
        id: 'wt_001',
        ticketNumber: 'WGT-2024-001',
        grossWeight: 5200,
        tareWeight: 215,
        netWeight: 4985,
        unit: 'kg',
        weighingTime: '2024-01-15T08:45:00',
        scaleId: 'SCALE-01',
        operatorName: 'Robert Chen',
        verified: true,
        photoUrl: 'weighing_ticket_001.jpg'
      }
    ],
    photos: [
      {
        id: 'photo_001',
        url: 'vehicle_photo_001.jpg',
        type: 'vehicle',
        description: 'Truck arrival at gate',
        timestamp: '2024-01-15T08:30:00',
        takenBy: 'John Smith'
      },
      {
        id: 'photo_002',
        url: 'material_photo_001.jpg',
        type: 'material',
        description: 'CPO quality check',
        timestamp: '2024-01-15T09:00:00',
        takenBy: 'Sarah Lee'
      }
    ],
    sampleCollected: true,
    sampleId: 'SAMPLE-2024-001',
    storageLocation: 'Warehouse A - Zone 1 - Tank 101',
    storageBin: 'TANK-101',
    quarantineStatus: 'none' as any,
    createdAt: '2024-01-15T08:30:00',
    updatedAt: '2024-01-15T10:15:00',
    approvedBy: 'Plant Manager',
    approvedAt: '2024-01-15T11:00:00'
  },
  {
    id: 'intake_002',
    intakeNumber: 'INT-2024-002',
    supplierId: 'sup_002',
    supplierName: 'Koperasi Petani Sawit Raya',
    contractId: 'contract_002',
    deliveryDate: '2024-01-16',
    receivedDate: '2024-01-16',
    receivedBy: 'Maria Rodriguez',
    vehicleNumber: 'BK 5678 DEF',
    driverName: 'Budi Santoso',
    driverContact: '+62-813-9876-5432',
    arrivalTime: '2024-01-16T07:45:00',
    departureTime: '2024-01-16T09:30:00',
    rawMaterialType: RawMaterialType.CRUDE_PALM_OIL,
    expectedQuantity: 2500,
    receivedQuantity: 2520,
    unit: 'kg',
    moistureContent: 0.25,
    temperature: 31.8,
    contaminationLevel: 0.03,
    visualInspection: {
      appearance: 'Clear with slight haziness',
      color: 'Dark golden',
      odor: 'Slight off-odor detected',
      foreignMatter: 'Minimal sediment',
      containerCondition: 'Clean with minor scratches',
      sealCondition: 'Seal intact',
      temperatureCondition: 'Slightly elevated',
      overallCondition: 'Fair',
      photos: ['intake_photo_003.jpg', 'intake_photo_004.jpg']
    },
    preliminaryTests: [
      {
        type: 'FFA Content',
        result: '6.2%',
        unit: '%',
        method: 'AOAC Cd 3-25',
        instrument: 'Titration Equipment',
        timestamp: '2024-01-16T08:15:00',
        performedBy: 'David Kim'
      }
    ],
    acceptanceStatus: AcceptanceStatus.QUARANTINE,
    rejectionReasons: ['FFA content above specification', 'Slight off-odor detected'],
    deliveryNoteNumber: 'DN-2024-001235',
    weighingTickets: [
      {
        id: 'wt_002',
        ticketNumber: 'WGT-2024-002',
        grossWeight: 2600,
        tareWeight: 80,
        netWeight: 2520,
        unit: 'kg',
        weighingTime: '2024-01-16T08:00:00',
        scaleId: 'SCALE-02',
        operatorName: 'Lisa Wang',
        verified: true
      }
    ],
    photos: [
      {
        id: 'photo_003',
        url: 'vehicle_photo_002.jpg',
        type: 'vehicle',
        description: 'Small truck delivery',
        timestamp: '2024-01-16T07:45:00',
        takenBy: 'Maria Rodriguez'
      }
    ],
    sampleCollected: true,
    sampleId: 'SAMPLE-2024-002',
    storageLocation: 'Warehouse A - Zone 2 - Tank 102',
    storageBin: 'TANK-102',
    quarantineStatus: 'quality_hold' as any,
    quarantineExpiryDate: '2024-01-20',
    createdAt: '2024-01-16T07:45:00',
    updatedAt: '2024-01-16T09:30:00'
  }
];

// Mock Processing Batches
export const mockProcessingBatches: ProcessingBatch[] = [
  {
    id: 'batch_001',
    batchNumber: 'BATCH-2024-001',
    parentIntakeIds: ['intake_001'],
    processingDate: '2024-01-16',
    processingStartTime: '2024-01-16T06:00:00',
    processingEndTime: '2024-01-16T14:30:00',
    processedBy: 'James Wilson',
    processingLine: 'line_1' as any,
    inputMaterials: [
      {
        materialType: RawMaterialType.CRUDE_PALM_OIL,
        sourceIntakeId: 'intake_001',
        quantity: 4985,
        unit: 'kg',
        qualityGrade: QualityGrade.STANDARD,
        storageLocation: 'Warehouse A - Zone 1 - Tank 101'
      }
    ],
    totalInputQuantity: 4985,
    processingSteps: [
      {
        id: 'step_001',
        stepName: 'Pre-heating',
        stepType: 'pre_heating' as any,
        sequence: 1,
        startTime: '2024-01-16T06:00:00',
        endTime: '2024-01-16T07:30:00',
        duration: 90,
        temperature: 65,
        operatorId: 'OP-001',
        operatorName: 'James Wilson',
        supervisorId: 'SUP-001',
        supervisorName: 'Robert Chen',
        targetOutput: 4985,
        actualOutput: 4980,
        efficiency: 99.9,
        completedSuccessfully: true,
        qualityChecks: [
          {
            id: 'qc_001',
            checkName: 'Temperature Check',
            checkType: 'parameter' as any,
            sequence: 1,
            mandatory: true,
            actualTime: '2024-01-16T06:30:00',
            completedAt: '2024-01-16T06:30:00',
            checkedBy: 'OP-001',
            checkedByName: 'James Wilson',
            passed: true,
            measurements: [
              {
                parameter: 'Temperature',
                value: 65,
                unit: '°C',
                specification: { target: 65 },
                result: 'pass' as any,
                measurementTime: '2024-01-16T06:30:00'
              }
            ]
          }
        ]
      },
      {
        id: 'step_002',
        stepName: 'Degumming',
        stepType: 'degumming' as any,
        sequence: 2,
        startTime: '2024-01-16T07:30:00',
        endTime: '2024-01-16T09:00:00',
        duration: 90,
        temperature: 85,
        ph: 6.5,
        operatorId: 'OP-001',
        operatorName: 'James Wilson',
        targetOutput: 4950,
        actualOutput: 4945,
        efficiency: 99.9,
        completedSuccessfully: true
      },
      {
        id: 'step_003',
        stepName: 'Bleaching',
        stepType: 'bleaching' as any,
        sequence: 3,
        startTime: '2024-01-16T09:00:00',
        endTime: '2024-01-16T11:30:00',
        duration: 150,
        temperature: 105,
        pressure: 0.5,
        operatorId: 'OP-002',
        operatorName: 'Michael Brown',
        targetOutput: 4920,
        actualOutput: 4910,
        efficiency: 99.8,
        completedSuccessfully: true
      },
      {
        id: 'step_004',
        stepName: 'Deodorization',
        stepType: 'deodorization' as any,
        sequence: 4,
        startTime: '2024-01-16T11:30:00',
        endTime: '2024-01-16T14:30:00',
        duration: 180,
        temperature: 240,
        pressure: 0.1,
        operatorId: 'OP-002',
        operatorName: 'Michael Brown',
        targetOutput: 4900,
        actualOutput: 4890,
        efficiency: 99.8,
        completedSuccessfully: true
      }
    ],
    qualityChecks: [],
    outputProducts: [
      {
        productType: ProductType.REFINED_PALM_OIL,
        quantity: 4890,
        unit: 'kg',
        qualityGrade: QualityGrade.PREMIUM,
        batchNumber: 'RPO-2024-001',
        storageLocation: 'Warehouse B - Zone 1 - Tank 201',
        certifications: ['ISO 9001', 'Halal Certified']
      }
    ],
    actualYield: 98.2,
    expectedYield: 98.5,
    yieldVariance: -0.3,
    processingEfficiency: 99.8,
    energyConsumption: 450,
    waterUsage: 1200,
    finalQualityResults: [
      {
        parameter: 'FFA Content',
        value: 0.05,
        unit: '%',
        specification: { minimum: 0, maximum: 0.1, target: 0.05 },
        result: 'pass' as any,
        deviation: 0,
        withinSpec: true
      },
      {
        parameter: 'Moisture Content',
        value: 0.03,
        unit: '%',
        specification: { minimum: 0, maximum: 0.05, target: 0.03 },
        result: 'pass' as any,
        deviation: 0,
        withinSpec: true
      },
      {
        parameter: 'Color (Lovibond)',
        value: 2.5,
        unit: 'R',
        specification: { minimum: 0, maximum: 3.0, target: 2.5 },
        result: 'pass' as any,
        deviation: 0,
        withinSpec: true
      }
    ],
    batchStatus: BatchStatus.COMPLETED,
    holdsOrIssues: [],
    sourceIntakes: [mockIntakeRecords[0]],
    createdAt: '2024-01-16T06:00:00',
    updatedAt: '2024-01-16T14:30:00',
    completedAt: '2024-01-16T14:30:00'
  }
];

// Mock Quality Tests
export const mockQualityTests: QualityTest[] = [
  {
    id: 'test_001',
    testNumber: 'QT-2024-001',
    batchId: 'batch_001',
    sampleId: 'SAMPLE-2024-001',
    testType: QualityTestType.CHEMICAL,
    testDate: '2024-01-16',
    testedBy: 'Dr. Sarah Mitchell',
    laboratory: 'Genco Oil Quality Laboratory',
    certificationBody: 'SUCOFINDO',
    parameters: [
      {
        name: 'Free Fatty Acid (FFA)',
        value: 0.05,
        unit: '%',
        specification: { maximum: 0.1 },
        result: 'pass' as any,
        method: 'AOAC Cd 3-25'
      },
      {
        name: 'Moisture Content',
        value: 0.03,
        unit: '%',
        specification: { maximum: 0.05 },
        result: 'pass' as any,
        method: 'Karl Fischer'
      },
      {
        name: 'Peroxide Value',
        value: 2.1,
        unit: 'meq/kg',
        specification: { maximum: 5.0 },
        result: 'pass' as any,
        method: 'AOAC Cd 8-53'
      }
    ],
    testMethod: 'Complete Chemical Analysis',
    equipmentUsed: 'GC-MS, HPLC, Titration Equipment',
    testConditions: [
      {
        parameter: 'Room Temperature',
        value: 25,
        unit: '°C'
      },
      {
        parameter: 'Relative Humidity',
        value: 45,
        unit: '%'
      }
    ],
    testStatus: 'completed' as any,
    overallResult: 'pass' as any,
    detailedResults: [
      {
        testPoint: 'FFA Content',
        expected: 0.1,
        actual: 0.05,
        tolerance: 0.02,
        passed: true
      },
      {
        testPoint: 'Moisture Content',
        expected: 0.05,
        actual: 0.03,
        tolerance: 0.01,
        passed: true
      }
    ],
    specificationsMet: true,
    nonConformances: [],
    testReportUrl: 'reports/test_report_001.pdf',
    analystSignature: 'Dr. Sarah Mitchell',
    supervisorSignature: 'Quality Manager',
    certificationDate: '2024-01-17',
    createdAt: '2024-01-16T10:00:00',
    updatedAt: '2024-01-16T16:00:00',
    reviewedBy: 'Quality Manager',
    reviewedAt: '2024-01-17T09:00:00'
  },
  {
    id: 'test_002',
    testNumber: 'QT-2024-002',
    intakeId: 'intake_002',
    sampleId: 'SAMPLE-2024-002',
    testType: QualityTestType.CHEMICAL,
    testDate: '2024-01-16',
    testedBy: 'Dr. James Chen',
    laboratory: 'Genco Oil Quality Laboratory',
    parameters: [
      {
        name: 'Free Fatty Acid (FFA)',
        value: 6.2,
        unit: '%',
        specification: { maximum: 5.0 },
        result: 'fail' as any,
        method: 'AOAC Cd 3-25'
      }
    ],
    testMethod: 'Basic Chemical Analysis',
    testStatus: 'completed' as any,
    overallResult: 'fail' as any,
    specificationsMet: false,
    nonConformances: [
      {
        id: 'nc_001',
        parameter: 'FFA Content',
        severity: 'major',
        description: 'FFA content exceeds specification limit',
        impact: 'Material not suitable for premium grade processing',
        requiredAction: 'Material reclassification or supplier notification',
        dueDate: '2024-01-17',
        responsibleParty: 'Quality Manager',
        status: 'open'
      }
    ],
    createdAt: '2024-01-16T11:00:00',
    updatedAt: '2024-01-16T15:00:00'
  }
];

// Mock Inventory Records
export const mockInventoryRecords: InventoryRecord[] = [
  {
    id: 'inv_001',
    productType: ProductType.REFINED_PALM_OIL,
    batchId: 'batch_001',
    batchNumber: 'RPO-2024-001',
    location: {
      warehouse: 'Warehouse B',
      zone: 'Zone 1',
      area: 'Storage Area A',
      rack: 'Rack-01',
      shelf: 'Shelf-01'
    },
    binNumber: 'TANK-201',
    quantity: 4890,
    unit: 'kg',
    qualityGrade: QualityGrade.PREMIUM,
    status: 'available' as any,
    qualityTestResults: ['QT-2024-001'],
    certifications: ['ISO 9001', 'Halal Certified'],
    lastMovementDate: '2024-01-16T14:30:00',
    movementHistory: [
      {
        id: 'move_001',
        movementType: 'receipt' as any,
        toLocation: 'Warehouse B - Zone 1 - Tank 201',
        quantity: 4890,
        unit: 'kg',
        referenceNumber: 'BATCH-2024-001',
        reason: 'Production completion',
        performedBy: 'James Wilson',
        timestamp: '2024-01-16T14:30:00'
      }
    ],
    allocatedQuantity: 0,
    availableQuantity: 4890,
    unitCost: 15000,
    totalValue: 73350000,
    currency: 'IDR',
    valuationDate: '2024-01-16',
    createdAt: '2024-01-16T14:30:00',
    updatedAt: '2024-01-16T14:30:00'
  },
  {
    id: 'inv_002',
    productType: ProductType.CRUDE_PALM_OIL,
    batchId: 'intake_002',
    batchNumber: 'INT-2024-002',
    location: {
      warehouse: 'Warehouse A',
      zone: 'Zone 2',
      area: 'Quarantine Area'
    },
    binNumber: 'TANK-102',
    quantity: 2520,
    unit: 'kg',
    qualityGrade: QualityGrade.COMMERCIAL,
    status: 'quality_hold' as any,
    qualityTestResults: ['QT-2024-002'],
    certifications: ['ISCC'],
    quarantineStatus: 'quality_hold' as any,
    quarantineReasons: ['FFA content above specification'],
    lastMovementDate: '2024-01-16T09:30:00',
    movementHistory: [
      {
        id: 'move_002',
        movementType: 'receipt' as any,
        toLocation: 'Warehouse A - Zone 2 - Tank 102',
        quantity: 2520,
        unit: 'kg',
        referenceNumber: 'INT-2024-002',
        reason: 'Material intake under quarantine',
        performedBy: 'Maria Rodriguez',
        timestamp: '2024-01-16T09:30:00'
      }
    ],
    allocatedQuantity: 0,
    availableQuantity: 2520,
    unitCost: 12000,
    totalValue: 30240000,
    currency: 'IDR',
    valuationDate: '2024-01-16',
    createdAt: '2024-01-16T09:30:00',
    updatedAt: '2024-01-16T09:30:00'
  }
];

// Summary statistics for dashboard
export const mockProcessingStats = {
  totalIntakeToday: 15,
  totalProcessedToday: 3,
  totalQualityTestsPending: 8,
  averageYield: 98.2,
  qualityPassRate: 94.5,
  totalInventoryValue: 2850000000,
  totalBatchesInProduction: 5,
  alertsRequiringAttention: 3
};