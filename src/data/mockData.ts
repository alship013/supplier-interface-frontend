import type { Supplier, DashboardStats, Contract, FeedstockRecord, FeedstockInventory, FeedstockProcessing, QualityInspection, ProcessingBatch, ProcessingPlan } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PT. Agro Lestari',
    type: 'supplier',
    email: 'contact@agrolestari.com',
    phone: '+62 21 5555 1234',
    location: {
      address: 'Jl. Merdeka No. 123, Jakarta',
      region: 'Jakarta',
      coordinates: { lat: -6.2088, lng: 106.8456 }
    },
    registrationDate: '2024-01-15',
    status: 'active',
    totalVolume: 150000,
    averageQuality: 92,
    complianceStatus: 'compliant',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 95,
      quality: 92,
      delivery: 88
    }
  },
  {
    id: '2',
    name: 'Santo Farmer Group',
    type: 'farmer',
    email: 'santo@farmercoop.id',
    phone: '+62 361 5555 5678',
    location: {
      address: 'Desa Tegal Sari, Bali',
      region: 'Bali',
      coordinates: { lat: -8.4095, lng: 115.1889 }
    },
    registrationDate: '2024-02-20',
    status: 'active',
    totalVolume: 75000,
    averageQuality: 88,
    complianceStatus: 'compliant',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 90,
      quality: 88,
      delivery: 92
    }
  },
  {
    id: '3',
    name: 'CV. Harvest Indonesia',
    type: 'supplier',
    email: 'info@harvestindo.com',
    phone: '+62 22 5555 9012',
    location: {
      address: 'Jl. Industri No. 45, Bandung',
      region: 'West Java',
      coordinates: { lat: -6.9175, lng: 107.6191 }
    },
    registrationDate: '2024-03-10',
    status: 'pending',
    totalVolume: 45000,
    averageQuality: 85,
    complianceStatus: 'pending',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 85,
      quality: 85,
      delivery: 80
    }
  }
];

export const mockContracts: Contract[] = [
  {
    id: 'c1',
    supplierId: '1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    terms: 'Monthly delivery of 10,000 tons',
    volume: 120000,
    price: 850,
    status: 'active'
  },
  {
    id: 'c2',
    supplierId: '2',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    terms: 'Bi-weekly delivery of 3,000 tons',
    volume: 72000,
    price: 820,
    status: 'active'
  }
];

export const mockFeedstockRecords: FeedstockRecord[] = [
  {
    id: 'f1',
    supplierId: '1',
    date: '2024-11-08',
    volume: 8500,
    feedstockType: 'palm_kernel_shell',
    quality: {
      moisture: 12,
      purity: 94,
      contamination: 2,
      size_distribution: '85% 6-12mm',
      calorific_value: 4200,
      ash_content: 3.2
    },
    location: {
      name: 'Jakarta Collection Point',
      coordinates: { lat: -6.2088, lng: 106.8456 },
      storage_facility: 'Jakarta Storage Facility A'
    },
    transport: {
      vehicle_number: 'B-1234-XYZ',
      driver_name: 'Ahmad Wijaya',
      departure_time: '2024-11-08T06:00:00Z',
      arrival_time: '2024-11-08T08:30:00Z',
      transport_company: 'Jakarta Transport Ltd.'
    },
    photos: ['/photos/delivery1.jpg', '/photos/delivery2.jpg', '/photos/quality1.jpg'],
    documents: {
      delivery_note: '/docs/delivery_f1.pdf',
      quality_certificate: '/certs/quality1.pdf',
      weigh_bridge_ticket: '/docs/weight_f1.pdf',
      transport_manifest: '/docs/manifest_f1.pdf'
    },
    status: 'approved',
    inspection: {
      inspected_by: 'Dr. Budi Santoso',
      inspection_date: '2024-11-08T09:00:00Z',
      notes: 'Quality meets standard requirements. Recommended for immediate processing.',
      recommendations: ['Monitor moisture levels during storage', 'Consider additional screening for size uniformity']
    },
    certificateUrl: '/certs/quality1.pdf',
    batch_number: 'BATCH-2024-1108-001',
    storage_location: 'Warehouse A - Section 1',
    expiry_date: '2025-02-08'
  },
  {
    id: 'f2',
    supplierId: '2',
    date: '2024-11-07',
    volume: 3200,
    feedstockType: 'empty_fruit_bunch',
    quality: {
      moisture: 14,
      purity: 90,
      contamination: 3,
      size_distribution: '70% 20-30cm',
      calorific_value: 3800,
      ash_content: 4.1
    },
    location: {
      name: 'Bali Collection Point',
      coordinates: { lat: -8.4095, lng: 115.1889 },
      storage_facility: 'Bali Storage Facility B'
    },
    transport: {
      vehicle_number: 'DK-5678-ABC',
      driver_name: 'Made Sudiarta',
      departure_time: '2024-11-07T05:30:00Z',
      arrival_time: '2024-11-07T09:15:00Z',
      transport_company: 'Bali Haulage Services'
    },
    photos: ['/photos/delivery3.jpg', '/photos/delivery4.jpg'],
    documents: {
      delivery_note: '/docs/delivery_f2.pdf',
      weigh_bridge_ticket: '/docs/weight_f2.pdf'
    },
    status: 'quality_check',
    inspection: {
      inspected_by: 'Ir. Nyoman Sutrisno',
      inspection_date: '2024-11-07T10:00:00Z',
      notes: 'Pending laboratory analysis for contamination levels.',
      recommendations: ['Conduct detailed contamination analysis', 'Verify moisture content with lab testing']
    },
    batch_number: 'BATCH-2024-1107-002',
    storage_location: 'Warehouse B - Section 3'
  },
  {
    id: 'f3',
    supplierId: '1',
    date: '2024-11-06',
    volume: 5000,
    feedstockType: 'mesocarp_fiber',
    quality: {
      moisture: 18,
      purity: 87,
      contamination: 4,
      size_distribution: '60% fine fiber',
      calorific_value: 3600,
      ash_content: 5.5
    },
    location: {
      name: 'Bandung Collection Point',
      coordinates: { lat: -6.9175, lng: 107.6191 },
      storage_facility: 'Bandung Storage Facility C'
    },
    transport: {
      vehicle_number: 'D-9012-DEF',
      driver_name: 'Eko Prasetyo',
      departure_time: '2024-11-06T07:00:00Z',
      arrival_time: '2024-11-06T10:45:00Z',
      transport_company: 'West Java Transport Co.'
    },
    photos: ['/photos/delivery5.jpg'],
    documents: {
      delivery_note: '/docs/delivery_f3.pdf',
      quality_certificate: '/certs/quality3.pdf'
    },
    status: 'in_transit',
    inspection: {
      inspected_by: 'Dra. Ratna Sari',
      inspection_date: '2024-11-06T11:00:00Z',
      notes: 'High moisture content detected. Requires drying before processing.',
      recommendations: ['Immediate drying required', 'Quality check after drying process']
    },
    batch_number: 'BATCH-2024-1106-003',
    storage_location: 'In Transit'
  },
  {
    id: 'f4',
    supplierId: '3',
    date: '2024-11-05',
    volume: 2800,
    feedstockType: 'palm_mill_effluent',
    quality: {
      moisture: 75,
      purity: 92,
      contamination: 1,
      size_distribution: 'Liquid form',
      calorific_value: 1200,
      ash_content: 8.2
    },
    location: {
      name: 'Surabaya Collection Point',
      coordinates: { lat: -7.2575, lng: 112.7521 },
      storage_facility: 'Surabaya Treatment Facility D'
    },
    transport: {
      vehicle_number: 'L-3456-GHI',
      driver_name: 'Sukarno',
      departure_time: '2024-11-05T04:00:00Z',
      arrival_time: '2024-11-05T08:20:00Z',
      transport_company: 'East Java Liquid Transport'
    },
    photos: ['/photos/delivery6.jpg', '/photos/delivery7.jpg'],
    documents: {
      delivery_note: '/docs/delivery_f4.pdf',
      quality_certificate: '/certs/quality4.pdf',
      weigh_bridge_ticket: '/docs/weight_f4.pdf'
    },
    status: 'stored',
    inspection: {
      inspected_by: 'Ir. Hendra Wijaya',
      inspection_date: '2024-11-05T09:30:00Z',
      notes: 'Standard liquid effluent quality. Suitable for biogas production.',
      recommendations: ['Monitor pH levels regularly', 'Consider concentration process for higher yield']
    },
    certificateUrl: '/certs/quality4.pdf',
    batch_number: 'BATCH-2024-1105-004',
    storage_location: 'Treatment Tank A',
    expiry_date: '2024-12-05'
  },
  {
    id: 'f5',
    supplierId: '2',
    date: '2024-11-04',
    volume: 1500,
    feedstockType: 'shells',
    quality: {
      moisture: 8,
      purity: 96,
      contamination: 1.5,
      size_distribution: '90% 5-10mm',
      calorific_value: 4500,
      ash_content: 2.8
    },
    location: {
      name: 'Medan Collection Point',
      coordinates: { lat: 3.5952, lng: 98.6722 },
      storage_facility: 'Medan Storage Facility E'
    },
    transport: {
      vehicle_number: 'BK-7890-JKL',
      driver_name: 'Rajiv Singh',
      departure_time: '2024-11-04T06:30:00Z',
      arrival_time: '2024-11-04T11:00:00Z',
      transport_company: 'Sumatra Transport Solutions'
    },
    photos: ['/photos/delivery8.jpg'],
    documents: {
      delivery_note: '/docs/delivery_f5.pdf',
      quality_certificate: '/certs/quality5.pdf'
    },
    status: 'stored',
    inspection: {
      inspected_by: 'Dr. Siti Nurhaliza',
      inspection_date: '2024-11-04T12:00:00Z',
      notes: 'Excellent quality. High calorific value. Ready for immediate use.',
      recommendations: ['No special treatment required', 'Suitable for direct combustion']
    },
    certificateUrl: '/certs/quality5.pdf',
    batch_number: 'BATCH-2024-1104-005',
    storage_location: 'Premium Storage Section',
    expiry_date: '2025-05-04'
  }
];

export const mockFeedstockInventory: FeedstockInventory[] = [
  {
    id: 'inv-1',
    feedstockType: 'palm_kernel_shell',
    totalVolume: 8500,
    availableVolume: 8500,
    allocatedVolume: 0,
    qualityAverage: 92,
    location: 'Jakarta Storage Facility A',
    lastUpdated: '2024-11-08T09:00:00Z',
    batches: [mockFeedstockRecords[0]]
  },
  {
    id: 'inv-2',
    feedstockType: 'empty_fruit_bunch',
    totalVolume: 3200,
    availableVolume: 0,
    allocatedVolume: 3200,
    qualityAverage: 88,
    location: 'Bali Storage Facility B',
    lastUpdated: '2024-11-07T10:00:00Z',
    batches: [mockFeedstockRecords[1]]
  },
  {
    id: 'inv-3',
    feedstockType: 'mesocarp_fiber',
    totalVolume: 5000,
    availableVolume: 0,
    allocatedVolume: 2000,
    qualityAverage: 85,
    location: 'Bandung Storage Facility C',
    lastUpdated: '2024-11-06T11:00:00Z',
    batches: [mockFeedstockRecords[2]]
  },
  {
    id: 'inv-4',
    feedstockType: 'palm_mill_effluent',
    totalVolume: 2800,
    availableVolume: 1500,
    allocatedVolume: 1300,
    qualityAverage: 90,
    location: 'Surabaya Treatment Facility D',
    lastUpdated: '2024-11-05T09:30:00Z',
    batches: [mockFeedstockRecords[3]]
  },
  {
    id: 'inv-5',
    feedstockType: 'shells',
    totalVolume: 1500,
    availableVolume: 1200,
    allocatedVolume: 300,
    qualityAverage: 95,
    location: 'Medan Storage Facility E',
    lastUpdated: '2024-11-04T12:00:00Z',
    batches: [mockFeedstockRecords[4]]
  }
];

export const mockProcessingPlans: ProcessingPlan[] = [
  {
    id: 'plan-1',
    name: 'Palm Kernel Shell Standard Drying',
    feedstockType: 'palm_kernel_shell',
    processingMethod: 'drying',
    steps: [
      {
        id: 'step-1',
        name: 'Pre-cleaning',
        description: 'Remove large debris and foreign materials',
        duration: 30,
        equipment: 'Pre-cleaner Unit A',
        parameters: { vibration_frequency: 50, screen_size: '20mm' },
        qualityChecks: ['visual_inspection', 'debris_check'],
        temperature: undefined,
        pressure: undefined
      },
      {
        id: 'step-2',
        name: 'Drying Process',
        description: 'Reduce moisture content to acceptable levels',
        duration: 120,
        temperature: 105,
        equipment: 'Rotary Dryer A',
        parameters: { air_flow: 2000, rotation_speed: 5 },
        qualityChecks: ['moisture_content', 'temperature_log'],
        pressure: 0.1
      },
      {
        id: 'step-3',
        name: 'Cooling',
        description: 'Cool down the dried material to ambient temperature',
        duration: 60,
        temperature: 25,
        equipment: 'Cooling Conveyor',
        parameters: { conveyor_speed: 2, cooling_time: 60 },
        qualityChecks: ['temperature_check', 'moisture_verification'],
        pressure: undefined
      },
      {
        id: 'step-4',
        name: 'Quality Check',
        description: 'Final quality verification and documentation',
        duration: 45,
        equipment: 'QC Station',
        parameters: { sampling_rate: '5%', tests: ['moisture', 'purity', 'size'] },
        qualityChecks: ['final_moisture', 'purity_test', 'size_distribution'],
        temperature: undefined,
        pressure: undefined
      }
    ],
    estimatedDuration: 255,
    capacityPerBatch: 5000,
    qualityTargets: {
      moistureMax: 12,
      purityMin: 90,
      contaminationMax: 3,
      calorificValueMin: 4000,
      ashContentMax: 5
    },
    requiredEquipment: ['Pre-cleaner Unit A', 'Rotary Dryer A', 'Cooling Conveyor', 'QC Station'],
    requiredPersonnel: ['Operator', 'QC Technician', 'Supervisor'],
    safetyRequirements: ['PPE mandatory', 'Heat protection', 'Dust control'],
    environmentalControls: ['Dust collection', 'Temperature monitoring', 'Air filtration'],
    costPerTon: 45
  },
  {
    id: 'plan-2',
    name: 'EFB Size Reduction',
    feedstockType: 'empty_fruit_bunch',
    processingMethod: 'grinding',
    steps: [
      {
        id: 'step-5',
        name: 'Size Reduction',
        description: 'Shred EFB to uniform size',
        duration: 90,
        equipment: 'Industrial Shredder B',
        parameters: { screen_size: '10mm', throughput: 200 },
        qualityChecks: ['size_verification', 'moisture_check'],
        temperature: undefined,
        pressure: undefined
      },
      {
        id: 'step-6',
        name: 'Particle Separation',
        description: 'Separate fine particles from coarse material',
        duration: 60,
        equipment: 'Vibrating Screen B',
        parameters: { vibration_amplitude: 10, tilt_angle: 15 },
        qualityChecks: ['particle_distribution', 'separation_efficiency'],
        temperature: undefined,
        pressure: undefined
      }
    ],
    estimatedDuration: 150,
    capacityPerBatch: 3000,
    qualityTargets: {
      moistureMax: 15,
      purityMin: 85,
      contaminationMax: 4,
      ashContentMax: 6
    },
    requiredEquipment: ['Industrial Shredder B', 'Vibrating Screen B'],
    requiredPersonnel: ['Operator', 'Maintenance'],
    safetyRequirements: ['PPE mandatory', 'Machine guarding', 'Noise protection'],
    environmentalControls: ['Noise reduction', 'Dust suppression'],
    costPerTon: 35
  }
];

export const mockProcessingBatches: ProcessingBatch[] = [
  {
    id: 'batch-1',
    feedstockRecordId: 'f1',
    batchNumber: 'PROC-BATCH-2024-1109-001',
    processingPlanId: 'plan-1',
    startDate: '2024-11-09T08:00:00Z',
    expectedEndDate: '2024-11-09T12:15:00Z',
    actualEndDate: '2024-11-09T12:30:00Z',
    priority: 'high',
    status: 'completed',
    steps: [
      {
        id: 'step-1',
        name: 'Pre-cleaning',
        description: 'Remove large debris and foreign materials',
        duration: 30,
        equipment: 'Pre-cleaner Unit A',
        parameters: { vibration_frequency: 50, screen_size: '20mm' },
        qualityChecks: ['visual_inspection', 'debris_check'],
        status: 'completed',
        startTime: '2024-11-09T08:00:00Z',
        endTime: '2024-11-09T08:32:00Z',
        operator: 'Ahmad Fadli',
        notes: 'Normal operation, minimal debris found'
      },
      {
        id: 'step-2',
        name: 'Drying Process',
        description: 'Reduce moisture content to acceptable levels',
        duration: 120,
        temperature: 105,
        equipment: 'Rotary Dryer A',
        parameters: { air_flow: 2000, rotation_speed: 5 },
        qualityChecks: ['moisture_content', 'temperature_log'],
        status: 'completed',
        startTime: '2024-11-09T08:35:00Z',
        endTime: '2024-11-09T10:38:00Z',
        operator: 'John Smith',
        notes: 'Temperature maintained within tolerance'
      },
      {
        id: 'step-3',
        name: 'Cooling',
        description: 'Cool down the dried material to ambient temperature',
        duration: 60,
        temperature: 25,
        equipment: 'Cooling Conveyor',
        parameters: { conveyor_speed: 2, cooling_time: 60 },
        qualityChecks: ['temperature_check', 'moisture_verification'],
        status: 'completed',
        startTime: '2024-11-09T10:40:00Z',
        endTime: '2024-11-09T11:43:00Z',
        operator: 'Maria Rodriguez',
        notes: 'Cooling process completed successfully'
      },
      {
        id: 'step-4',
        name: 'Quality Check',
        description: 'Final quality verification and documentation',
        duration: 45,
        equipment: 'QC Station',
        parameters: { sampling_rate: '5%', tests: ['moisture', 'purity', 'size'] },
        qualityChecks: ['final_moisture', 'purity_test', 'size_distribution'],
        status: 'completed',
        startTime: '2024-11-09T11:45:00Z',
        endTime: '2024-11-09T12:30:00Z',
        operator: 'Dr. Budi Santoso',
        notes: 'All quality parameters within specification'
      }
    ],
    currentStepIndex: 4,
    inputVolume: 2000,
    expectedOutputVolume: 1800,
    actualOutputVolume: 1820,
    yieldPercentage: 91,
    qualityMetrics: {
      moistureBefore: 12,
      moistureAfter: 8,
      purityBefore: 94,
      purityAfter: 95,
      sizeDistributionBefore: '85% 6-12mm',
      sizeDistributionAfter: '88% 6-12mm',
      calorificValueBefore: 4200,
      calorificValueAfter: 4350
    },
    costBreakdown: {
      labor: 1800,
      energy: 2200,
      equipment: 1500,
      materials: 300,
      overhead: 1200
    },
    assignedTo: 'John Smith',
    supervisedBy: 'Ir. Hendra Wijaya',
    notes: [
      'Processing completed within expected timeframe',
      'Slightly higher yield due to optimal drying conditions',
      'Quality improvement observed after processing'
    ],
    deviations: ['15 minutes delay in cooling step due to temperature sensor calibration'],
    qualityInspections: ['qi-1', 'qi-2']
  },
  {
    id: 'batch-2',
    feedstockRecordId: 'f3',
    batchNumber: 'PROC-BATCH-2024-1109-002',
    processingPlanId: 'plan-1',
    startDate: '2024-11-09T14:00:00Z',
    expectedEndDate: '2024-11-09T18:15:00Z',
    priority: 'medium',
    status: 'in_progress',
    steps: [
      {
        id: 'step-1',
        name: 'Pre-cleaning',
        description: 'Remove large debris and foreign materials',
        duration: 30,
        equipment: 'Pre-cleaner Unit A',
        parameters: { vibration_frequency: 50, screen_size: '20mm' },
        qualityChecks: ['visual_inspection', 'debris_check'],
        status: 'completed',
        startTime: '2024-11-09T14:00:00Z',
        endTime: '2024-11-09T14:35:00Z',
        operator: 'Ahmad Fadli',
        notes: 'Higher than usual debris content'
      },
      {
        id: 'step-2',
        name: 'Drying Process',
        description: 'Reduce moisture content to acceptable levels',
        duration: 120,
        temperature: 105,
        equipment: 'Rotary Dryer A',
        parameters: { air_flow: 2000, rotation_speed: 5 },
        qualityChecks: ['moisture_content', 'temperature_log'],
        status: 'in_progress',
        startTime: '2024-11-09T14:40:00Z',
        operator: 'John Smith',
        notes: 'Drying in progress, moisture content decreasing steadily'
      }
    ],
    currentStepIndex: 1,
    inputVolume: 1500,
    expectedOutputVolume: 1350,
    qualityMetrics: {
      moistureBefore: 18,
      moistureAfter: 0,
      purityBefore: 87,
      purityAfter: 0,
      sizeDistributionBefore: '60% fine fiber',
      sizeDistributionAfter: '',
      calorificValueBefore: 3600
    },
    costBreakdown: {
      labor: 1350,
      energy: 1650,
      equipment: 1125,
      materials: 225,
      overhead: 900
    },
    assignedTo: 'John Smith',
    supervisedBy: 'Ir. Hendra Wijaya',
    notes: [
      'Processing started on schedule',
      'Initial quality parameters within expected range'
    ],
    deviations: [],
    qualityInspections: ['qi-3']
  }
];

export const mockQualityInspections: QualityInspection[] = [
  {
    id: 'qi-1',
    feedstockRecordId: 'f1',
    inspectionType: 'incoming',
    inspectorName: 'Dr. Budi Santoso',
    inspectorId: 'insp-001',
    inspectionDate: '2024-11-08T09:00:00Z',
    location: 'Jakarta Collection Point',
    tests: [
      {
        id: 'test-1',
        name: 'Moisture Content',
        method: 'Oven Dry Method',
        standard: 'SNI 01-4441-2006',
        unit: '%',
        minAcceptance: 0,
        maxAcceptance: 15,
        measuredValue: 12,
        result: 'pass',
        testedBy: 'Dr. Budi Santoso',
        testDate: '2024-11-08T09:15:00Z',
        equipment: 'Moisture Analyzer MA-50',
        notes: 'Moisture content within acceptable range'
      },
      {
        id: 'test-2',
        name: 'Purity Test',
        method: 'Manual Separation',
        standard: 'Internal QC-001',
        unit: '%',
        minAcceptance: 85,
        maxAcceptance: 100,
        measuredValue: 94,
        result: 'pass',
        testedBy: 'Dr. Budi Santoso',
        testDate: '2024-11-08T09:45:00Z',
        notes: 'High purity level achieved'
      },
      {
        id: 'test-3',
        name: 'Contamination Analysis',
        method: 'Visual Inspection',
        standard: 'Internal QC-002',
        unit: '%',
        minAcceptance: 0,
        maxAcceptance: 5,
        measuredValue: 2,
        result: 'pass',
        testedBy: 'Dr. Budi Santoso',
        testDate: '2024-11-08T10:00:00Z',
        notes: 'Minimal contamination detected'
      }
    ],
    overallResult: 'pass',
    totalScore: 92,
    maxScore: 100,
    recommendations: ['Monitor moisture levels during storage', 'Consider additional screening for size uniformity'],
    nonConformities: [],
    correctiveActions: [],
    followUpRequired: false,
    certificateUrl: '/certs/qi-1-certificate.pdf',
    photos: ['/photos/qi-1-1.jpg', '/photos/qi-1-2.jpg'],
    approvedBy: 'Ir. Hendra Wijaya',
    approvedDate: '2024-11-08T11:00:00Z'
  },
  {
    id: 'qi-2',
    feedstockRecordId: 'f1',
    inspectionType: 'final',
    inspectorName: 'Dr. Budi Santoso',
    inspectorId: 'insp-001',
    inspectionDate: '2024-11-09T12:30:00Z',
    location: 'Processing QC Station',
    tests: [
      {
        id: 'test-4',
        name: 'Final Moisture Content',
        method: 'Oven Dry Method',
        standard: 'SNI 01-4441-2006',
        unit: '%',
        minAcceptance: 0,
        maxAcceptance: 12,
        measuredValue: 8,
        result: 'pass',
        testedBy: 'Dr. Budi Santoso',
        testDate: '2024-11-09T12:45:00Z',
        equipment: 'Moisture Analyzer MA-50',
        notes: 'Excellent moisture reduction achieved'
      },
      {
        id: 'test-5',
        name: 'Calorific Value',
        method: 'Bomb Calorimetry',
        standard: 'ASTM D5865',
        unit: 'kcal/kg',
        minAcceptance: 4000,
        maxAcceptance: 5000,
        measuredValue: 4350,
        result: 'pass',
        testedBy: 'Dr. Budi Santoso',
        testDate: '2024-11-09T13:00:00Z',
        equipment: 'Calorimeter C-200',
        notes: 'High calorific value suitable for energy production'
      }
    ],
    overallResult: 'pass',
    totalScore: 95,
    maxScore: 100,
    recommendations: ['Material ready for immediate use', 'Maintain storage conditions'],
    nonConformities: [],
    correctiveActions: [],
    followUpRequired: false,
    certificateUrl: '/certs/qi-2-certificate.pdf',
    photos: ['/photos/qi-2-1.jpg'],
    approvedBy: 'Ir. Hendra Wijaya',
    approvedDate: '2024-11-09T13:30:00Z'
  },
  {
    id: 'qi-3',
    feedstockRecordId: 'f3',
    inspectionType: 'incoming',
    inspectorName: 'Ir. Nyoman Sutrisno',
    inspectorId: 'insp-002',
    inspectionDate: '2024-11-09T14:30:00Z',
    location: 'Processing QC Station',
    tests: [
      {
        id: 'test-6',
        name: 'Moisture Content',
        method: 'Oven Dry Method',
        standard: 'SNI 01-4441-2006',
        unit: '%',
        minAcceptance: 0,
        maxAcceptance: 20,
        measuredValue: 18,
        result: 'pass',
        testedBy: 'Ir. Nyoman Sutrisno',
        testDate: '2024-11-09T14:45:00Z',
        equipment: 'Moisture Analyzer MA-50',
        notes: 'High moisture content but within acceptable range'
      },
      {
        id: 'test-7',
        name: 'Contamination Level',
        method: 'Laboratory Analysis',
        standard: 'Internal QC-003',
        unit: '%',
        minAcceptance: 0,
        maxAcceptance: 3,
        measuredValue: 4,
        result: 'fail',
        testedBy: 'Ir. Nyoman Sutrisno',
        testDate: '2024-11-09T15:15:00Z',
        equipment: 'Lab Analyzer LA-100',
        notes: 'Contamination level exceeds standard, requires additional cleaning'
      }
    ],
    overallResult: 'conditional_pass',
    totalScore: 78,
    maxScore: 100,
    recommendations: ['Additional cleaning required before processing', 'Monitor contamination sources at supplier level'],
    nonConformities: ['Contamination level 4% exceeds maximum 3%'],
    correctiveActions: ['Implement additional screening step', 'Review supplier quality control procedures'],
    followUpRequired: true,
    followUpDate: '2024-11-10T10:00:00Z',
    photos: ['/photos/qi-3-1.jpg', '/photos/qi-3-2.jpg'],
    approvedBy: undefined,
    approvedDate: undefined
  }
];

export const mockFeedstockProcessing: FeedstockProcessing[] = [
  {
    id: 'proc-1',
    batchId: 'f1',
    feedstockType: 'palm_kernel_shell',
    processingDate: '2024-11-09',
    inputVolume: 2000,
    outputVolume: 1820,
    processingMethod: 'drying',
    qualityBefore: {
      moisture: 12,
      purity: 94,
      contamination: 2,
      size_distribution: '85% 6-12mm',
      calorific_value: 4200,
      ash_content: 3.2
    },
    qualityAfter: {
      moisture: 8,
      purity: 95,
      contamination: 1.8,
      size_distribution: '88% 6-12mm',
      calorific_value: 4350,
      ash_content: 3.0
    },
    processingUnit: 'Dryer Unit A',
    operator: 'John Smith',
    status: 'completed',
    processingBatchId: 'batch-1',
    yieldPercentage: 91,
    downtimeMinutes: 15,
    energyConsumption: 450,
    qualityScore: 95
  },
  {
    id: 'proc-2',
    batchId: 'f3',
    feedstockType: 'mesocarp_fiber',
    processingDate: '2024-11-09',
    inputVolume: 1500,
    outputVolume: 0,
    processingMethod: 'drying',
    qualityBefore: {
      moisture: 18,
      purity: 87,
      contamination: 4,
      size_distribution: '60% fine fiber',
      calorific_value: 3600,
      ash_content: 5.5
    },
    qualityAfter: {
      moisture: 0,
      purity: 0,
      contamination: 0,
      size_distribution: '',
      calorific_value: 0,
      ash_content: 0
    },
    processingUnit: 'Dryer Unit A',
    operator: 'John Smith',
    status: 'in_progress',
    processingBatchId: 'batch-2',
    downtimeMinutes: 0,
    energyConsumption: 280
  },
  {
    id: 'proc-3',
    batchId: 'f5',
    feedstockType: 'shells',
    processingDate: '2024-11-10',
    inputVolume: 500,
    outputVolume: 0,
    processingMethod: 'screening',
    qualityBefore: {
      moisture: 8,
      purity: 96,
      contamination: 1.5,
      size_distribution: '90% 5-10mm',
      calorific_value: 4500,
      ash_content: 2.8
    },
    qualityAfter: {
      moisture: 0,
      purity: 0,
      contamination: 0,
      size_distribution: '',
      calorific_value: 0,
      ash_content: 0
    },
    processingUnit: 'Screening Unit C',
    operator: 'Li Wei',
    status: 'scheduled',
    downtimeMinutes: 0,
    energyConsumption: 0
  }
];

export const mockDashboardStats: DashboardStats = {
  totalSuppliers: 145,
  totalFarmers: 2840,
  activeSuppliers: 132,
  totalVolume: 2450000,
  averageQuality: 89.5,
  pendingRegistrations: 12,
  recentActivity: [
    {
      id: 'a1',
      type: 'delivery',
      description: 'New delivery received from PT. Agro Lestari',
      timestamp: '2024-11-08T10:30:00Z',
      entityId: '1',
      entityName: 'PT. Agro Lestari'
    },
    {
      id: 'a2',
      type: 'registration',
      description: 'New supplier registration: CV. Harvest Indonesia',
      timestamp: '2024-11-08T09:15:00Z',
      entityId: '3',
      entityName: 'CV. Harvest Indonesia'
    },
    {
      id: 'a3',
      type: 'quality_check',
      description: 'Quality check completed for Santo Farmer Group',
      timestamp: '2024-11-07T15:45:00Z',
      entityId: '2',
      entityName: 'Santo Farmer Group'
    }
  ]
};