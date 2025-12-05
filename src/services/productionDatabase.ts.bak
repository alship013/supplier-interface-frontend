import {
  RMTank,
  FPTank,
  ProductionBatch,
  InventoryUnit,
  ReceivingRecord,
  ProductionRecord,
  MassBalanceResult,
  ProductionStats,
  TankStatus,
  BatchStatus,
  InventoryType,
  InventoryStatus,
  RMReceivingInput,
  ProductionStartInput,
  InventoryUnitInput,
  SupplierComposition,
  ProductionReport
} from '@/types/production';
import { SupplierData } from '@/services/supplierDatabase';

class ProductionDatabaseService {
  private readonly DB_NAME = 'genco_production_db';
  private readonly RM_TANKS_KEY = 'rm_tanks';
  private readonly FP_TANKS_KEY = 'fp_tanks';
  private readonly BATCHES_KEY = 'production_batches';
  private readonly INVENTORY_KEY = 'inventory_units';
  private readonly RECEIVING_RECORDS_KEY = 'receiving_records';
  private readonly PRODUCTION_RECORDS_KEY = 'production_records';

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const keys = [
      this.RM_TANKS_KEY,
      this.FP_TANKS_KEY,
      this.BATCHES_KEY,
      this.INVENTORY_KEY,
      this.RECEIVING_RECORDS_KEY,
      this.PRODUCTION_RECORDS_KEY
    ];

    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    // Initialize with sample tanks if no data exists
    if (this.getAllRMTanks().length === 0) {
      this.initializeSampleData();
    }
  }

  private initializeSampleData(): void {
    // Sample RM Tanks
    const sampleRMTanks: RMTank[] = [
      {
        id: 'rm_tank_1',
        tankCode: 'RM-A',
        name: 'Raw Material Tank A',
        description: 'Main storage for Rubber Seed',
        maxCapacity: 10000, // 10 tons
        currentWeight: 2500,
        productType: 'Rubber Seed',
        status: TankStatus.ACTIVE,
        activeSuppliers: [
          {
            supplierId: 'supplier_1',
            supplierName: 'PT. Rubber Indonesia',
            percentage: 60,
            weight: 1500,
            productType: 'Rubber Seed'
          },
          {
            supplierId: 'supplier_2',
            supplierName: 'CV. Agro Mandiri',
            percentage: 40,
            weight: 1000,
            productType: 'Rubber Seed'
          }
        ],
        lastUpdated: new Date().toISOString(),
        location: 'Warehouse A',
        qualityMetrics: {
          ffa: 2.5,
          moisture: 8.2,
          purity: 92.5,
          contamination: 1.8,
          lastTestDate: new Date().toISOString(),
          testMethod: 'AOAC Official Method'
        }
      },
      {
        id: 'rm_tank_2',
        tankCode: 'RM-B',
        name: 'Raw Material Tank B',
        description: 'Secondary storage for Rubber Seed',
        maxCapacity: 8000,
        currentWeight: 1200,
        productType: 'Rubber Seed',
        status: TankStatus.ACTIVE,
        activeSuppliers: [
          {
            supplierId: 'supplier_3',
            supplierName: 'PT. Jaya Abadi',
            percentage: 100,
            weight: 1200,
            productType: 'Rubber Seed'
          }
        ],
        lastUpdated: new Date().toISOString(),
        location: 'Warehouse B',
        qualityMetrics: {
          ffa: 3.1,
          moisture: 7.8,
          purity: 91.2,
          contamination: 2.1,
          lastTestDate: new Date().toISOString(),
          testMethod: 'AOAC Official Method'
        }
      }
    ];

    // Sample FP Tanks
    const sampleFPTanks: FPTank[] = [
      {
        id: 'fp_tank_1',
        tankCode: 'FP-01',
        name: 'RTSO Oil Storage Tank 1',
        description: 'Finished product oil storage',
        maxCapacity: 5000,
        currentWeight: 1800,
        productType: 'RTSO Oil',
        status: TankStatus.ACTIVE,
        sourceBatchIds: ['batch_1', 'batch_2'],
        lastUpdated: new Date().toISOString(),
        location: 'Finished Goods Warehouse',
        qualityMetrics: {
          ffa: 1.2,
          moisture: 0.3,
          purity: 98.5,
          contamination: 0.2,
          lastTestDate: new Date().toISOString(),
          testMethod: 'AOAC Official Method'
        }
      },
      {
        id: 'fp_tank_2',
        tankCode: 'FP-02',
        name: 'RTSO Cake Storage Tank 1',
        description: 'Finished product cake storage',
        maxCapacity: 3000,
        currentWeight: 800,
        productType: 'RTSO Cake',
        status: TankStatus.ACTIVE,
        sourceBatchIds: ['batch_1'],
        lastUpdated: new Date().toISOString(),
        location: 'Finished Goods Warehouse',
        qualityMetrics: {
          ffa: 8.5,
          moisture: 12.3,
          purity: 85.2,
          contamination: 3.1,
          lastTestDate: new Date().toISOString(),
          testMethod: 'AOAC Official Method'
        }
      }
    ];

    this.saveRMTanks(sampleRMTanks);
    this.saveFPTanks(sampleFPTanks);
  }

  // Helper methods
  private saveRMTanks(tanks: RMTank[]): void {
    localStorage.setItem(this.RM_TANKS_KEY, JSON.stringify(tanks));
  }

  private saveFPTanks(tanks: FPTank[]): void {
    localStorage.setItem(this.FP_TANKS_KEY, JSON.stringify(tanks));
  }

  private saveBatches(batches: ProductionBatch[]): void {
    localStorage.setItem(this.BATCHES_KEY, JSON.stringify(batches));
  }

  private saveInventory(units: InventoryUnit[]): void {
    localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(units));
  }

  private saveReceivingRecords(records: ReceivingRecord[]): void {
    localStorage.setItem(this.RECEIVING_RECORDS_KEY, JSON.stringify(records));
  }

  private saveProductionRecords(records: ProductionRecord[]): void {
    localStorage.setItem(this.PRODUCTION_RECORDS_KEY, JSON.stringify(records));
  }

  // RM Tanks CRUD operations
  getAllRMTanks(): RMTank[] {
    try {
      const tanksJson = localStorage.getItem(this.RM_TANKS_KEY);
      return tanksJson ? JSON.parse(tanksJson) : [];
    } catch (error) {
      console.error('Error reading RM tanks:', error);
      return [];
    }
  }

  getRMTankById(id: string): RMTank | null {
    const tanks = this.getAllRMTanks();
    return tanks.find(tank => tank.id === id) || null;
  }

  getRMTankByCode(tankCode: string): RMTank | null {
    const tanks = this.getAllRMTanks();
    return tanks.find(tank => tank.tankCode === tankCode) || null;
  }

  createRMTank(tankData: Omit<RMTank, 'id' | 'lastUpdated'>): RMTank {
    const tanks = this.getAllRMTanks();
    const newTank: RMTank = {
      ...tankData,
      id: `rm_tank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString()
    };

    tanks.push(newTank);
    this.saveRMTanks(tanks);
    return newTank;
  }

  updateRMTank(id: string, updates: Partial<RMTank>): RMTank | null {
    const tanks = this.getAllRMTanks();
    const index = tanks.findIndex(tank => tank.id === id);

    if (index === -1) return null;

    tanks[index] = {
      ...tanks[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    this.saveRMTanks(tanks);
    return tanks[index];
  }

  // FP Tanks CRUD operations
  getAllFPTanks(): FPTank[] {
    try {
      const tanksJson = localStorage.getItem(this.FP_TANKS_KEY);
      return tanksJson ? JSON.parse(tanksJson) : [];
    } catch (error) {
      console.error('Error reading FP tanks:', error);
      return [];
    }
  }

  getFPTankById(id: string): FPTank | null {
    const tanks = this.getAllFPTanks();
    return tanks.find(tank => tank.id === id) || null;
  }

  createFPTank(tankData: Omit<FPTank, 'id' | 'lastUpdated'>): FPTank {
    const tanks = this.getAllFPTanks();
    const newTank: FPTank = {
      ...tankData,
      id: `fp_tank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString()
    };

    tanks.push(newTank);
    this.saveFPTanks(tanks);
    return newTank;
  }

  updateFPTank(id: string, updates: Partial<FPTank>): FPTank | null {
    const tanks = this.getAllFPTanks();
    const index = tanks.findIndex(tank => tank.id === id);

    if (index === -1) return null;

    tanks[index] = {
      ...tanks[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    this.saveFPTanks(tanks);
    return tanks[index];
  }

  deleteRMTank(id: string): boolean {
    const tanks = this.getAllRMTanks();
    const index = tanks.findIndex(tank => tank.id === id);

    if (index === -1) return false;

    // Check if tank has any inventory
    if (tanks[index].currentWeight > 0) {
      throw new Error('Cannot delete tank with remaining inventory. Please transfer or consume all inventory first.');
    }

    tanks.splice(index, 1);
    this.saveRMTanks(tanks);
    return true;
  }

  deleteFPTank(id: string): boolean {
    const tanks = this.getAllFPTanks();
    const index = tanks.findIndex(tank => tank.id === id);

    if (index === -1) return false;

    // Check if tank has any inventory
    if (tanks[index].currentWeight > 0) {
      throw new Error('Cannot delete tank with remaining inventory. Please transfer or consume all inventory first.');
    }

    tanks.splice(index, 1);
    this.saveFPTanks(tanks);
    return true;
  }

  // Production Batches CRUD operations
  getAllBatches(): ProductionBatch[] {
    try {
      const batchesJson = localStorage.getItem(this.BATCHES_KEY);
      return batchesJson ? JSON.parse(batchesJson) : [];
    } catch (error) {
      console.error('Error reading batches:', error);
      return [];
    }
  }

  getBatchById(id: string): ProductionBatch | null {
    const batches = this.getAllBatches();
    return batches.find(batch => batch.id === id) || null;
  }

  getBatchByNumber(batchNumber: string): ProductionBatch | null {
    const batches = this.getAllBatches();
    return batches.find(batch => batch.batchNumber === batchNumber) || null;
  }

  createBatch(batchData: Omit<ProductionBatch, 'id' | 'batchNumber' | 'createdAt' | 'updatedAt' | 'status' | 'isFinalized' | 'inventoryUnits'>): ProductionBatch {
    const batches = this.getAllBatches();
    const batchCount = batches.length + 1;
    const year = new Date().getFullYear();

    const newBatch: ProductionBatch = {
      ...batchData,
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      batchNumber: `BATCH-${year}-${batchCount.toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: BatchStatus.INITIATED,
      isFinalized: false,
      inventoryUnits: []
    };

    batches.push(newBatch);
    this.saveBatches(batches);

    // Create production record
    this.createProductionRecord({
      batchId: newBatch.id,
      batchNumber: newBatch.batchNumber,
      operation: 'start_production',
      timestamp: new Date().toISOString(),
      operatorId: batchData.operatorId || 'unknown',
      operatorName: batchData.operatorName || 'Unknown Operator',
      details: {
        sourceTank: batchData.sourceTankCode,
        inputWeight: batchData.inputWeight
      }
    });

    return newBatch;
  }

  updateBatch(id: string, updates: Partial<ProductionBatch>): ProductionBatch | null {
    const batches = this.getAllBatches();
    const index = batches.findIndex(batch => batch.id === id);

    if (index === -1) return null;

    batches[index] = {
      ...batches[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveBatches(batches);
    return batches[index];
  }

  finalizeBatch(id: string): ProductionBatch | null {
    return this.updateBatch(id, {
      status: BatchStatus.FINALIZED,
      isFinalized: true,
      endTime: new Date().toISOString()
    });
  }

  // Inventory Units CRUD operations
  getAllInventory(): InventoryUnit[] {
    try {
      const inventoryJson = localStorage.getItem(this.INVENTORY_KEY);
      return inventoryJson ? JSON.parse(inventoryJson) : [];
    } catch (error) {
      console.error('Error reading inventory:', error);
      return [];
    }
  }

  getInventoryById(id: string): InventoryUnit | null {
    const inventory = this.getAllInventory();
    return inventory.find(unit => unit.id === id) || null;
  }

  getInventoryByUnitId(unitId: string): InventoryUnit | null {
    const inventory = this.getAllInventory();
    return inventory.find(unit => unit.unitId === unitId) || null;
  }

  getInventoryByBatchId(batchId: string): InventoryUnit[] {
    const inventory = this.getAllInventory();
    return inventory.filter(unit => unit.batchId === batchId);
  }

  createInventoryUnit(unitData: Omit<InventoryUnit, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentLocation' | 'locationHistory'>): InventoryUnit {
    const inventory = this.getAllInventory();
    const newUnit: InventoryUnit = {
      ...unitData,
      id: `inventory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: InventoryStatus.ACTIVE,
      currentLocation: 'Production Line',
      locationHistory: [
        {
          location: 'Production Line',
          timestamp: new Date().toISOString(),
          movedBy: unitData.createdBy,
          purpose: 'Initial creation'
        }
      ]
    };

    inventory.push(newUnit);
    this.saveInventory(inventory);
    return newUnit;
  }

  updateInventoryUnit(id: string, updates: Partial<InventoryUnit>): InventoryUnit | null {
    const inventory = this.getAllInventory();
    const index = inventory.findIndex(unit => unit.id === id);

    if (index === -1) return null;

    inventory[index] = {
      ...inventory[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveInventory(inventory);
    return inventory[index];
  }

  // Production Operations
  receiveRawMaterial(input: RMReceivingInput, supplierData: SupplierData): ReceivingRecord {
    const records = this.getReceivingRecords();
    const recordNumber = `REC-${Date.now()}`;

    const record: ReceivingRecord = {
      id: `receiving_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recordNumber,
      destinationTankId: input.destinationTankId,
      destinationTankCode: this.getRMTankById(input.destinationTankId)?.tankCode || 'UNKNOWN',
      supplierId: input.supplierId,
      supplierName: supplierData.supplierName,
      productType: input.productType,
      weight: input.weight,
      qrCodes: input.qrCodes,
      receivingDate: new Date().toISOString(),
      receivedBy: 'Current User', // This should come from authentication context
      qualityCheck: input.qualityCheck ? {
        passed: true,
        ffa: input.qualityCheck.ffa,
        moisture: input.qualityCheck.moisture
      } : undefined,
      createdAt: new Date().toISOString()
    };

    records.push(record);
    this.saveReceivingRecords(records);

    // Update RM Tank
    const tank = this.getRMTankById(input.destinationTankId);
    if (tank) {
      const updatedSuppliers = [...tank.activeSuppliers];
      const existingSupplierIndex = updatedSuppliers.findIndex(s => s.supplierId === input.supplierId);

      if (existingSupplierIndex >= 0) {
        // Update existing supplier contribution
        updatedSuppliers[existingSupplierIndex].weight += input.weight;
        updatedSuppliers[existingSupplierIndex].percentage =
          (updatedSuppliers[existingSupplierIndex].weight / (tank.currentWeight + input.weight)) * 100;
      } else {
        // Add new supplier contribution
        const newSupplierWeight = input.weight;
        updatedSuppliers.push({
          supplierId: input.supplierId,
          supplierName: supplierData.supplierName,
          percentage: (newSupplierWeight / (tank.currentWeight + input.weight)) * 100,
          weight: newSupplierWeight,
          productType: input.productType,
          sourceQuality: input.qualityCheck ? {
            ffa: input.qualityCheck.ffa,
            moisture: input.qualityCheck.moisture
          } : undefined
        });

        // Recalculate all percentages
        const totalWeight = tank.currentWeight + input.weight;
        updatedSuppliers.forEach(supplier => {
          supplier.percentage = (supplier.weight / totalWeight) * 100;
        });
      }

      this.updateRMTank(input.destinationTankId, {
        currentWeight: tank.currentWeight + input.weight,
        activeSuppliers: updatedSuppliers,
        qualityMetrics: input.qualityCheck ? {
          ...tank.qualityMetrics!,
          ffa: input.qualityCheck.ffa,
          moisture: input.qualityCheck.moisture,
          lastTestDate: new Date().toISOString()
        } : tank.qualityMetrics
      });
    }

    return record;
  }

  startProduction(input: ProductionStartInput): ProductionBatch | null {
    const sourceTank = this.getRMTankById(input.sourceTankId);
    if (!sourceTank || sourceTank.currentWeight < input.inputWeight) {
      throw new Error('Insufficient material in source tank');
    }

    // Create batch with supplier composition from source tank
    const batchData = {
      sourceTankId: input.sourceTankId,
      sourceTankCode: sourceTank.tankCode,
      inputWeight: input.inputWeight,
      totalOutputWeight: 0,
      lossPercentage: 0,
      lossWeight: 0,
      startTime: new Date().toISOString(),
      operatorId: 'operator_1', // This should come from auth context
      operatorName: input.operatorName || 'Current Operator',
      ffa: sourceTank.qualityMetrics?.ffa || 0,
      moisture: sourceTank.qualityMetrics?.moisture || 0,
      qualityGrade: 'A',
      supplierComposition: sourceTank.activeSuppliers.map(supplier => ({
        ...supplier,
        weight: (supplier.percentage / 100) * input.inputWeight,
        percentage: supplier.percentage
      })),
      createdBy: 'Current User'
    };

    const newBatch = this.createBatch(batchData);

    // Update source tank (decrease inventory)
    this.updateRMTank(input.sourceTankId, {
      currentWeight: sourceTank.currentWeight - input.inputWeight
    });

    return newBatch;
  }

  addInventoryUnit(input: InventoryUnitInput, batchId: string): InventoryUnit {
    const batch = this.getBatchById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }

    const unitData = {
      unitId: input.unitId,
      type: input.type,
      weight: input.weight,
      batchId: batchId,
      batchNumber: batch.batchNumber,
      qualityMetrics: input.qualityMetrics ? {
        ffa: input.qualityMetrics.ffa,
        moisture: input.qualityMetrics.moisture,
        purity: 100 - input.qualityMetrics.moisture,
        contamination: Math.random() * 2, // Mock contamination
        testDate: new Date().toISOString(),
        testedBy: 'QC Operator',
        testMethod: 'Standard Test Method',
        grade: input.qualityMetrics.ffa < 2 ? 'A' : input.qualityMetrics.ffa < 4 ? 'B' : 'C'
      } : undefined,
      createdBy: 'Current User'
    };

    const newUnit = this.createInventoryUnit(unitData);

    // Update batch with new inventory unit and recalculate mass balance
    const currentUnits = this.getInventoryByBatchId(batchId);
    const allUnits = [...currentUnits, newUnit];

    const totalOutput = allUnits.reduce((sum, unit) => sum + unit.weight, 0);
    const lossWeight = batch.inputWeight - totalOutput;
    const lossPercentage = batch.inputWeight > 0 ? (lossWeight / batch.inputWeight) * 100 : 0;

    this.updateBatch(batchId, {
      totalOutputWeight: totalOutput,
      lossWeight: lossWeight,
      lossPercentage: lossPercentage,
      inventoryUnits: allUnits.map(unit => unit.id)
    });

    // Create production record
    this.createProductionRecord({
      batchId: batchId,
      batchNumber: batch.batchNumber,
      operation: 'add_inventory',
      timestamp: new Date().toISOString(),
      operatorId: 'operator_1',
      operatorName: 'Current Operator',
      details: {
        unitId: input.unitId,
        type: input.type,
        weight: input.weight
      }
    });

    return newUnit;
  }

  // Utility methods
  getReceivingRecords(): ReceivingRecord[] {
    try {
      const recordsJson = localStorage.getItem(this.RECEIVING_RECORDS_KEY);
      return recordsJson ? JSON.parse(recordsJson) : [];
    } catch (error) {
      console.error('Error reading receiving records:', error);
      return [];
    }
  }

  getProductionRecords(): ProductionRecord[] {
    try {
      const recordsJson = localStorage.getItem(this.PRODUCTION_RECORDS_KEY);
      return recordsJson ? JSON.parse(recordsJson) : [];
    } catch (error) {
      console.error('Error reading production records:', error);
      return [];
    }
  }

  private createProductionRecord(record: Omit<ProductionRecord, 'id' | 'createdAt'>): ProductionRecord {
    const records = this.getProductionRecords();
    const newRecord: ProductionRecord = {
      ...record,
      id: `production_record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    records.push(newRecord);
    this.saveProductionRecords(records);
    return newRecord;
  }

  calculateMassBalance(batchId: string): MassBalanceResult | null {
    const batch = this.getBatchById(batchId);
    if (!batch) return null;

    const inventoryUnits = this.getInventoryByBatchId(batchId);
    const totalOutput = inventoryUnits.reduce((sum, unit) => sum + unit.weight, 0);
    const lossWeight = batch.inputWeight - totalOutput;
    const lossPercentage = batch.inputWeight > 0 ? (lossWeight / batch.inputWeight) * 100 : 0;

    // Separate oil and cake outputs
    const oilUnits = inventoryUnits.filter(unit => unit.type === InventoryType.BARREL || unit.type === InventoryType.DRUM);
    const cakeUnits = inventoryUnits.filter(unit => unit.type === InventoryType.BAG);

    const oilOutput = oilUnits.reduce((sum, unit) => sum + unit.weight, 0);
    const cakeOutput = cakeUnits.reduce((sum, unit) => sum + unit.weight, 0);

    const efficiency = batch.inputWeight > 0 ? (totalOutput / batch.inputWeight) * 100 : 0;
    const isAcceptableLoss = lossPercentage <= 10;

    return {
      batchId: batch.id,
      inputWeight: batch.inputWeight,
      totalOutputWeight: totalOutput,
      lossWeight: lossWeight,
      lossPercentage: lossPercentage,
      oilOutput: oilOutput,
      cakeOutput: cakeOutput,
      efficiency: efficiency,
      isAcceptableLoss: isAcceptableLoss,
      warningMessage: lossPercentage > 10 ? `High loss detected: ${lossPercentage.toFixed(2)}%` : undefined
    };
  }

  getProductionStats(): ProductionStats {
    const rmTanks = this.getAllRMTanks();
    const fpTanks = this.getAllFPTanks();
    const batches = this.getAllBatches();
    const inventory = this.getAllInventory();

    const activeRMTanks = rmTanks.filter(tank => tank.status === TankStatus.ACTIVE).length;
    const activeFPTanks = fpTanks.filter(tank => tank.status === TankStatus.ACTIVE).length;
    const activeBatches = batches.filter(batch => batch.status === BatchStatus.IN_PROGRESS).length;
    const shippedUnits = inventory.filter(unit => unit.status === InventoryStatus.SHIPPED).length;

    // Calculate average loss percentage
    const completedBatches = batches.filter(batch => batch.status === BatchStatus.COMPLETED || batch.status === BatchStatus.FINALIZED);
    const averageLossPercentage = completedBatches.length > 0
      ? completedBatches.reduce((sum, batch) => sum + batch.lossPercentage, 0) / completedBatches.length
      : 0;

    // Calculate quality metrics
    const averageFFA = batches.reduce((sum, batch) => sum + batch.ffa, 0) / batches.length || 0;
    const averageMoisture = batches.reduce((sum, batch) => sum + batch.moisture, 0) / batches.length || 0;

    const gradeDistribution = inventory.reduce((acc, unit) => {
      const grade = unit.qualityMetrics?.grade || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Today's production (simplified - in real app would filter by date)
    const todayProduction = batches
      .filter(batch => new Date(batch.createdAt).toDateString() === new Date().toDateString())
      .reduce((sum, batch) => sum + batch.totalOutputWeight, 0);

    return {
      totalRMTanks: rmTanks.length,
      activeRMTanks,
      totalFPTanks: fpTanks.length,
      activeFPTanks,
      totalBatches: batches.length,
      activeBatches,
      totalInventoryUnits: inventory.length,
      shippedUnits,
      averageLossPercentage,
      totalProductionToday: todayProduction,
      qualityMetrics: {
        averageFFA,
        averageMoisture,
        gradeDistribution
      }
    };
  }

  updateTank(tank: RMTank | FPTank): void {
    if ('activeSuppliers' in tank) {
      // It's an RM Tank
      const rmTanks = this.getAllRMTanks();
      const index = rmTanks.findIndex(t => t.id === tank.id);
      if (index !== -1) {
        rmTanks[index] = {
          ...tank,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.RM_TANKS_KEY, JSON.stringify(rmTanks));
      }
    } else {
      // It's an FP Tank
      const fpTanks = this.getAllFPTanks();
      const index = fpTanks.findIndex(t => t.id === tank.id);
      if (index !== -1) {
        fpTanks[index] = {
          ...tank,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.FP_TANKS_KEY, JSON.stringify(fpTanks));
      }
    }
  }
}

// Export singleton instance
export const productionDb = new ProductionDatabaseService();

// Export types for convenience
export type {
  RMTank,
  FPTank,
  ProductionBatch,
  InventoryUnit,
  ReceivingRecord,
  ProductionRecord,
  MassBalanceResult,
  ProductionStats,
  RMReceivingInput,
  ProductionStartInput,
  InventoryUnitInput,
  SupplierComposition,
  ProductionReport
};