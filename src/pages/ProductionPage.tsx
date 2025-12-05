import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Factory,
  Package,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Scale,
  Clock,
  Target
} from 'lucide-react';
import TankDiagram from '@/components/TankDiagram';
import { useLanguage } from '@/contexts/LanguageContext';
import { productionDb } from '@/services/productionDatabase';
import { supplierDb } from '@/services/supplierDatabase';
import {
  RMTank,
  FPTank,
  ProductionBatch,
  RMReceivingInput,
  ProductionStartInput,
  InventoryUnit,
  InventoryType,
  TankStatus
} from '@/types/production';

const ProductionPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [rmTanks, setRmTanks] = useState<RMTank[]>([]);
  const [fpTanks, setFpTanks] = useState<FPTank[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [suppliers, setSuppliers] = useState(supplierDb.getAllSuppliers());

  // UI states
  const [isReceivingModalOpen, setIsReceivingModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [selectedRMTank, setSelectedRMTank] = useState<RMTank | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  // Tank management states
  const [isAddRMTankModalOpen, setIsAddRMTankModalOpen] = useState(false);
  const [isAddFPTankModalOpen, setIsAddFPTankModalOpen] = useState(false);
  const [isEditTankModalOpen, setIsEditTankModalOpen] = useState(false);
  const [selectedTank, setSelectedTank] = useState<RMTank | FPTank | null>(null);

  // Form states
  const [receivingForm, setReceivingForm] = useState<RMReceivingInput>({
    destinationTankId: '',
    supplierId: '',
    productType: 'Rubber Seed',
    weight: 0,
    qrCodes: [],
    qualityCheck: {
      ffa: 0,
      moisture: 0
    }
  });

  const [productionForm, setProductionForm] = useState<ProductionStartInput>({
    sourceTankId: '',
    inputWeight: 0,
    operatorName: ''
  });

  const [packingForm, setPackingForm] = useState({
    unitId: '',
    type: InventoryType.BARREL,
    weight: 0,
    qualityMetrics: {
      ffa: 0,
      moisture: 0
    }
  });

  // Tank form state
  const [tankForm, setTankForm] = useState({
    tankCode: '',
    name: '',
    tankType: 'rm' as 'rm' | 'fp',
    maxCapacity: 0,
    currentWeight: 0,
    status: TankStatus.ACTIVE,
    productType: '',
    qualityMetrics: {
      ffa: 0,
      moisture: 0
    }
  });

  // Load data on component mount
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = () => {
    setRmTanks(productionDb.getAllRMTanks());
    setFpTanks(productionDb.getAllFPTanks());
    setBatches(productionDb.getAllBatches());
    setSuppliers(supplierDb.getAllSuppliers());
  };

  const handleReceivingSubmit = () => {
    const supplier = suppliers.find(s => s.id === receivingForm.supplierId);
    if (!supplier) return;

    try {
      productionDb.receiveRawMaterial(receivingForm, supplier);
      loadProductionData();
      setIsReceivingModalOpen(false);
      resetReceivingForm();
    } catch (error) {
      console.error('Error receiving raw material:', error);
    }
  };

  const handleProductionStart = () => {
    try {
      productionDb.startProduction(productionForm);
      loadProductionData();
      setIsProductionModalOpen(false);
      resetProductionForm();
    } catch (error) {
      console.error('Error starting production:', error);
    }
  };

  const handlePackingSubmit = () => {
    if (!selectedBatch) return;

    try {
      productionDb.addInventoryUnit({
        unitId: packingForm.unitId,
        type: packingForm.type,
        weight: packingForm.weight,
        batchId: selectedBatch.id,
        qualityMetrics: packingForm.qualityMetrics
      }, selectedBatch.id);

      loadProductionData();

      // Reset packing form but keep the batch selected
      setPackingForm({
        unitId: '',
        type: InventoryType.BARREL,
        weight: 0,
        qualityMetrics: {
          ffa: 0,
          moisture: 0
        }
      });

      // Update selected batch with fresh data
      const updatedBatch = productionDb.getBatchById(selectedBatch.id);
      if (updatedBatch) {
        setSelectedBatch(updatedBatch);
      }
    } catch (error) {
      console.error('Error adding inventory unit:', error);
    }
  };

  const resetReceivingForm = () => {
    setReceivingForm({
      destinationTankId: '',
      supplierId: '',
      productType: 'Rubber Seed',
      weight: 0,
      qrCodes: [],
      qualityCheck: {
        ffa: 0,
        moisture: 0
      }
    });
  };

  const resetProductionForm = () => {
    setProductionForm({
      sourceTankId: '',
      inputWeight: 0,
      operatorName: ''
    });
  };

  // Temporarily disable tank management functions
  const resetTankForm = () => {
    setTankForm({
      tankCode: '',
      name: '',
      tankType: 'rm',
      maxCapacity: 0,
      currentWeight: 0,
      status: TankStatus.ACTIVE,
      productType: '',
      qualityMetrics: {
        ffa: 0,
        moisture: 0
      }
    });
  };

  const handleAddTank = (tankType: 'rm' | 'fp') => {
    resetTankForm();
    setTankForm(prev => ({ ...prev, tankType }));
    if (tankType === 'rm') {
      setIsAddRMTankModalOpen(true);
    } else {
      setIsAddFPTankModalOpen(true);
    }
  };

  const handleEditTank = (tank: RMTank | FPTank) => {
    setSelectedTank(tank);
    setTankForm({
      tankCode: tank.tankCode,
      name: tank.name,
      tankType: 'productType' in tank ? 'fp' : 'rm',
      maxCapacity: tank.maxCapacity,
      currentWeight: tank.currentWeight,
      status: tank.status,
      productType: tank.productType,
      qualityMetrics: tank.qualityMetrics || { ffa: 0, moisture: 0 }
    });
    setIsEditTankModalOpen(true);
  };

  const handleSaveTank = () => {
    try {
      if (selectedTank) {
        // Edit existing tank
        productionDb.updateTank({
          ...selectedTank,
          tankCode: tankForm.tankCode,
          name: tankForm.name,
          maxCapacity: tankForm.maxCapacity,
          currentWeight: tankForm.currentWeight,
          status: tankForm.status,
          productType: tankForm.productType,
          qualityMetrics: tankForm.qualityMetrics
        });
      } else {
        // Add new tank
        if (tankForm.tankType === 'rm') {
          productionDb.createRMTank({
            id: `RM_${tankForm.tankCode}_${Date.now()}`,
            tankCode: tankForm.tankCode,
            name: tankForm.name,
            maxCapacity: tankForm.maxCapacity,
            currentWeight: tankForm.currentWeight,
            status: tankForm.status,
            productType: tankForm.productType,
            qualityMetrics: tankForm.qualityMetrics,
            activeSuppliers: []
          });
        } else {
          productionDb.createFPTank({
            id: `FP_${tankForm.tankCode}_${Date.now()}`,
            tankCode: tankForm.tankCode,
            name: tankForm.name,
            maxCapacity: tankForm.maxCapacity,
            currentWeight: tankForm.currentWeight,
            status: tankForm.status,
            productType: tankForm.productType,
            qualityMetrics: tankForm.qualityMetrics
          });
        }
      }

      loadProductionData();
      setIsAddRMTankModalOpen(false);
      setIsAddFPTankModalOpen(false);
      setIsEditTankModalOpen(false);
      resetTankForm();
    } catch (error) {
      console.error('Error saving tank:', error);
    }
  };

  const getProductionStats = () => {
    const stats = productionDb.getProductionStats();
    return stats;
  };

  const stats = getProductionStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Production & Inventory</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage raw material intake, production batches, and finished product inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsReceivingModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Receive Material
          </Button>
          <Button variant="outline" onClick={() => setIsProductionModalOpen(true)}>
            <Factory className="w-4 h-4 mr-2" />
            Start Production
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">RM Tanks</p>
                <p className="text-2xl font-bold">{stats.activeRMTanks}/{stats.totalRMTanks}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FP Tanks</p>
                <p className="text-2xl font-bold">{stats.activeFPTanks}/{stats.totalFPTanks}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold">{stats.activeBatches}</p>
              </div>
              <Factory className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Loss</p>
                <p className="text-2xl font-bold">{stats.averageLossPercentage.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rm-receiving">Step 1: RM Receiving</TabsTrigger>
          <TabsTrigger value="production">Step 2: Production</TabsTrigger>
          <TabsTrigger value="fp-packing">Step 3: FP Packing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <TankDiagram
              tanks={rmTanks}
              title="Raw Material Tanks"
              onTankClick={(tank) => setSelectedRMTank(tank)}
              onTankSettings={handleEditTank}
              onAddTank={() => handleAddTank('rm')}
              showAddButton={true}
            />

            <TankDiagram
              tanks={fpTanks}
              title="Finished Product Tanks"
              onTankSettings={handleEditTank}
              onAddTank={() => handleAddTank('fp')}
              showAddButton={true}
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Production Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.slice(0, 5).map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Factory className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{batch.batchNumber}</h4>
                        <p className="text-sm text-gray-600">
                          {batch.sourceTankCode} • {batch.inputWeight}kg input
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={batch.status === 'in_progress' ? 'default' : 'secondary'}
                        className={batch.lossPercentage > 10 ? 'bg-red-100 text-red-800' : ''}
                      >
                        {batch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {batch.lossPercentage > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Loss: {batch.lossPercentage.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rm-receiving" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Raw Material Receiving
                <Button onClick={() => setIsReceivingModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Receiving
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Record raw material intake from suppliers and update tank inventory
              </p>
            </CardHeader>
            <CardContent>
              <TankDiagram
                tanks={rmTanks}
                title="Available RM Tanks"
                onTankClick={(tank) => {
                  setReceivingForm(prev => ({ ...prev, destinationTankId: tank.id }));
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Production Terminal
                <Button onClick={() => setIsProductionModalOpen(true)}>
                  <Factory className="w-4 h-4 mr-2" />
                  Start New Batch
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Start production batches and track raw material consumption
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {batches.map((batch) => (
                  <Card key={batch.id} className="relative hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{batch.batchNumber}</CardTitle>
                        <Badge variant={batch.status === 'in_progress' ? 'default' : 'secondary'}>
                          {batch.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Source: {batch.sourceTankCode}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Input:</span>
                          <span className="font-medium">{batch.inputWeight}kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Output:</span>
                          <span className="font-medium">{batch.totalOutputWeight}kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Loss:</span>
                          <span className={`font-medium ${batch.lossPercentage > 10 ? 'text-red-600' : ''}`}>
                            {batch.lossPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span>FFA:</span>
                          <span>{batch.ffa.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Moisture:</span>
                          <span>{batch.moisture.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Grade:</span>
                          <Badge variant="outline">{batch.qualityGrade}</Badge>
                        </div>
                      </div>
                      {batch.lossPercentage > 10 && (
                        <Alert className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            High loss detected: {batch.lossPercentage.toFixed(1)}%
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fp-packing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Finished Product Packing</CardTitle>
              <p className="text-sm text-gray-600">
                Pack finished products into barrels and bags with manual QR code entry
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Batches for Packing */}
                <div>
                  <h3 className="text-lg font-semibold mb-6">Active Batches</h3>
                  <div className="space-y-6">
                    {batches.filter(batch => batch.status === 'in_progress' || batch.status === 'completed').map((batch) => {
                      const massBalance = productionDb.calculateMassBalance(batch.id);
                      return (
                        <Card key={batch.id} className="cursor-pointer hover:shadow-lg transition-shadow p-4"
                              onClick={() => setSelectedBatch(batch)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{batch.batchNumber}</CardTitle>
                              <Badge variant={massBalance?.lossPercentage && massBalance.lossPercentage > 10 ? 'destructive' : 'default'}>
                                {batch.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Input:</span>
                                <div className="font-medium">{batch.inputWeight}kg</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Output:</span>
                                <div className="font-medium">{batch.totalOutputWeight}kg</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Loss:</span>
                                <div className={`font-medium ${massBalance?.lossPercentage && massBalance.lossPercentage > 10 ? 'text-red-600' : ''}`}>
                                  {massBalance?.lossPercentage.toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Units:</span>
                                <div className="font-medium">{productionDb.getInventoryByBatchId(batch.id).length}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Packing Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-6">Add Inventory Unit</h3>
                  {selectedBatch ? (
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Packing for {selectedBatch.batchNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {selectedBatch.inputWeight}kg input • {selectedBatch.totalOutputWeight}kg packed
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6 p-6">
                        <div>
                          <Label htmlFor="unitType">Unit Type</Label>
                          <Select value={packingForm.type} onValueChange={(value: InventoryType) =>
                            setPackingForm(prev => ({ ...prev, type: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={InventoryType.BARREL}>Barrel</SelectItem>
                              <SelectItem value={InventoryType.DRUM}>Drum</SelectItem>
                              <SelectItem value={InventoryType.BAG}>Bag</SelectItem>
                              <SelectItem value={InventoryType.TOTE}>Tote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="qrCode">QR Code / Unit ID</Label>
                          <Input
                            id="qrCode"
                            value={packingForm.unitId}
                            onChange={(e) => setPackingForm(prev => ({
                              ...prev,
                              unitId: e.target.value
                            }))}
                            placeholder="Enter QR code or unit ID"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Note: QR code scanning will be available via external scanner service
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="unitWeight">Net Weight (kg)</Label>
                          <Input
                            id="unitWeight"
                            type="number"
                            step="0.1"
                            value={packingForm.weight}
                            onChange={(e) => setPackingForm(prev => ({
                              ...prev,
                              weight: parseFloat(e.target.value) || 0
                            }))}
                            placeholder="Enter net weight"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ffa">FFA (%)</Label>
                            <Input
                              id="ffa"
                              type="number"
                              step="0.1"
                              value={packingForm.qualityMetrics?.ffa || 0}
                              onChange={(e) => setPackingForm(prev => ({
                                ...prev,
                                qualityMetrics: {
                                  ...prev.qualityMetrics!,
                                  ffa: parseFloat(e.target.value) || 0
                                }
                              }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="moisture">Moisture (%)</Label>
                            <Input
                              id="moisture"
                              type="number"
                              step="0.1"
                              value={packingForm.qualityMetrics?.moisture || 0}
                              onChange={(e) => setPackingForm(prev => ({
                                ...prev,
                                qualityMetrics: {
                                  ...prev.qualityMetrics!,
                                  moisture: parseFloat(e.target.value) || 0
                                }
                              }))}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button onClick={handlePackingSubmit} className="flex-1">
                            <Package className="w-4 h-4 mr-2" />
                            Add Unit
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                            Cancel
                          </Button>
                        </div>

                        {packingForm.weight > 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Mass Balance Preview:</strong>
                            </p>
                            <div className="text-xs text-blue-700 mt-1">
                              <p>Input: {selectedBatch.inputWeight}kg</p>
                              <p>Current Output: {selectedBatch.totalOutputWeight}kg</p>
                              <p>After Adding: {selectedBatch.totalOutputWeight + packingForm.weight}kg</p>
                              <p>Loss: {((selectedBatch.inputWeight - (selectedBatch.totalOutputWeight + packingForm.weight)) / selectedBatch.inputWeight * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <h4 className="font-medium mb-2">Select a Batch</h4>
                      <p className="text-sm">
                        Choose an active batch from the left to start packing
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Units for Selected Batch */}
              {selectedBatch && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Inventory Units for {selectedBatch.batchNumber}
                      <Badge variant="outline">
                        {productionDb.getInventoryByBatchId(selectedBatch.id).length} units
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {productionDb.getInventoryByBatchId(selectedBatch.id).map((unit) => (
                        <Card key={unit.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {unit.type}
                            </Badge>
                            <Badge className={unit.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                              {unit.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{unit.unitId}</h4>
                          <p className="text-lg font-bold mb-2">{unit.weight}kg</p>
                          {unit.qualityMetrics && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>FFA: {unit.qualityMetrics.ffa.toFixed(1)}%</div>
                              <div>M&I: {unit.qualityMetrics.moisture.toFixed(1)}%</div>
                              <div>Grade: <Badge variant="outline" className="text-xs">{unit.qualityMetrics.grade}</Badge></div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>

                    {productionDb.getInventoryByBatchId(selectedBatch.id).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <h4 className="font-medium mb-2">No Units Packed Yet</h4>
                        <p className="text-sm">
                          Add your first inventory unit using the form above
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Receiving Modal */}
      <Dialog open={isReceivingModalOpen} onOpenChange={setIsReceivingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Raw Material</DialogTitle>
            <DialogDescription>
              Record new raw material intake from supplier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="destinationTank">Destination Tank</Label>
              <Select value={receivingForm.destinationTankId} onValueChange={(value) =>
                setReceivingForm(prev => ({ ...prev, destinationTankId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select tank" />
                </SelectTrigger>
                <SelectContent>
                  {rmTanks.filter(tank => tank.status === TankStatus.ACTIVE).map((tank) => (
                    <SelectItem key={tank.id} value={tank.id}>
                      {tank.tankCode} - {tank.name} ({((tank.currentWeight / tank.maxCapacity) * 100).toFixed(0)}% full)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={receivingForm.supplierId} onValueChange={(value) =>
                setReceivingForm(prev => ({ ...prev, supplierId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={receivingForm.weight}
                onChange={(e) => setReceivingForm(prev => ({
                  ...prev,
                  weight: parseFloat(e.target.value) || 0
                }))}
                placeholder="Enter weight"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ffa">FFA (%)</Label>
                <Input
                  id="ffa"
                  type="number"
                  step="0.1"
                  value={receivingForm.qualityCheck?.ffa || 0}
                  onChange={(e) => setReceivingForm(prev => ({
                    ...prev,
                    qualityCheck: {
                      ...prev.qualityCheck!,
                      ffa: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="moisture">Moisture (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  value={receivingForm.qualityCheck?.moisture || 0}
                  onChange={(e) => setReceivingForm(prev => ({
                    ...prev,
                    qualityCheck: {
                      ...prev.qualityCheck!,
                      moisture: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleReceivingSubmit} className="flex-1">
                Receive Material
              </Button>
              <Button variant="outline" onClick={() => setIsReceivingModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Production Modal */}
      <Dialog open={isProductionModalOpen} onOpenChange={setIsProductionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start Production Batch</DialogTitle>
            <DialogDescription>
              Draw raw materials to start a new production batch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sourceTank">Source RM Tank</Label>
              <Select value={productionForm.sourceTankId} onValueChange={(value) =>
                setProductionForm(prev => ({ ...prev, sourceTankId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select source tank" />
                </SelectTrigger>
                <SelectContent>
                  {rmTanks.filter(tank => tank.status === TankStatus.ACTIVE && tank.currentWeight > 0).map((tank) => (
                    <SelectItem key={tank.id} value={tank.id}>
                      {tank.tankCode} - {tank.name} ({tank.currentWeight}kg available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inputWeight">Input Weight (kg)</Label>
              <Input
                id="inputWeight"
                type="number"
                value={productionForm.inputWeight}
                onChange={(e) => setProductionForm(prev => ({
                  ...prev,
                  inputWeight: parseFloat(e.target.value) || 0
                }))}
                placeholder="Enter input weight"
              />
              {productionForm.sourceTankId && (
                <p className="text-xs text-gray-500 mt-1">
                  Available: {rmTanks.find(t => t.id === productionForm.sourceTankId)?.currentWeight || 0}kg
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="operatorName">Operator Name</Label>
              <Input
                id="operatorName"
                value={productionForm.operatorName}
                onChange={(e) => setProductionForm(prev => ({
                  ...prev,
                  operatorName: e.target.value
                }))}
                placeholder="Enter operator name"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleProductionStart} className="flex-1">
                Start Production
              </Button>
              <Button variant="outline" onClick={() => setIsProductionModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tank Management Modal */}
      <Dialog open={isAddRMTankModalOpen || isAddFPTankModalOpen || isEditTankModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddRMTankModalOpen(false);
          setIsAddFPTankModalOpen(false);
          setIsEditTankModalOpen(false);
          setSelectedTank(null);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTank ? 'Edit Tank' : (isAddRMTankModalOpen ? 'Add Raw Material Tank' : 'Add Finished Product Tank')}
            </DialogTitle>
            <DialogDescription>
              {selectedTank ? 'Update tank information and settings' : 'Create a new tank for inventory management'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tankCode">Tank Code</Label>
              <Input
                id="tankCode"
                value={tankForm.tankCode}
                onChange={(e) => setTankForm(prev => ({ ...prev, tankCode: e.target.value }))}
                placeholder="e.g., RM-001, FP-001"
              />
            </div>

            <div>
              <Label htmlFor="tankName">Tank Name</Label>
              <Input
                id="tankName"
                value={tankForm.name}
                onChange={(e) => setTankForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Main Storage Tank A"
              />
            </div>

            <div>
              <Label htmlFor="productType">Product Type</Label>
              <Select value={tankForm.productType} onValueChange={(value) =>
                setTankForm(prev => ({ ...prev, productType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {tankForm.tankType === 'rm' ? (
                    <>
                      <SelectItem value="Rubber Seed">Rubber Seed</SelectItem>
                      <SelectItem value="Palm Kernel Shell">Palm Kernel Shell</SelectItem>
                      <SelectItem value="Empty Fruit Bunch">Empty Fruit Bunch</SelectItem>
                      <SelectItem value="Mesocarp Fiber">Mesocarp Fiber</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="RTSO">RTSO</SelectItem>
                      <SelectItem value="Palm Oil">Palm Oil</SelectItem>
                      <SelectItem value="Kernel Oil">Kernel Oil</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxCapacity">Max Capacity (kg)</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={tankForm.maxCapacity || ''}
                  onChange={(e) => setTankForm(prev => ({
                    ...prev,
                    maxCapacity: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  value={tankForm.currentWeight || ''}
                  onChange={(e) => setTankForm(prev => ({
                    ...prev,
                    currentWeight: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={tankForm.status} onValueChange={(value: TankStatus) =>
                setTankForm(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TankStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={TankStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={TankStatus.MAINTENANCE}>Maintenance</SelectItem>
                  <SelectItem value={TankStatus.CLEANING}>Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ffa">FFA (%)</Label>
                <Input
                  id="ffa"
                  type="number"
                  step="0.1"
                  value={tankForm.qualityMetrics?.ffa || ''}
                  onChange={(e) => setTankForm(prev => ({
                    ...prev,
                    qualityMetrics: {
                      ...prev.qualityMetrics!,
                      ffa: parseFloat(e.target.value) || 0
                    }
                  }))}
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <Label htmlFor="moisture">Moisture (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  value={tankForm.qualityMetrics?.moisture || ''}
                  onChange={(e) => setTankForm(prev => ({
                    ...prev,
                    qualityMetrics: {
                      ...prev.qualityMetrics!,
                      moisture: parseFloat(e.target.value) || 0
                    }
                  }))}
                  placeholder="e.g., 0.2"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveTank} className="flex-1">
                {selectedTank ? 'Update Tank' : 'Add Tank'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddRMTankModalOpen(false);
                  setIsAddFPTankModalOpen(false);
                  setIsEditTankModalOpen(false);
                  setSelectedTank(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionPage;