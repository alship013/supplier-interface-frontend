import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Eye, MapPin, Mail, Phone, Calendar, TrendingUp, FileText, FileSignature, Trash2, Loader2, AlertCircle } from 'lucide-react';
import SupplierSurveyForm from '@/components/SupplierSurveyForm';
import ContractCreationForm from '@/components/ContractCreationForm';
import { supplierApiService, type SupplierData } from '@/services/supplierApiAdapter';
import { mockContracts } from '@/data/mockContracts';
import { ContractStatus, ContractType } from '@/types/contract';
import { useLanguage } from '@/contexts/LanguageContext';

// Utility function to safely render values and prevent React object rendering errors
const safeRender = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // If it's an object or anything else, return fallback to prevent React rendering errors
  return fallback;
};

const SuppliersPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'supplier' | 'farmer'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [selectedSupplierForContract, setSelectedSupplierForContract] = useState<SupplierData | null>(null);
  const [isUnifiedFormOpen, setIsUnifiedFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierData | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load suppliers from API
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allSuppliers = await supplierApiService.getAllSuppliers();
      setSuppliers(allSuppliers);
    } catch (err) {
      setError('Failed to load suppliers');
      console.error('Load suppliers error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to suppliers (client-side filtering)
  const filteredSuppliers = suppliers.filter(supplier => {
    // Type filter
    if (filterType !== 'all' && supplier.type !== filterType) {
      return false;
    }

    // Status filter
    if (filterStatus !== 'all' && supplier.status !== filterStatus) {
      return false;
    }

    // Product filter
    if (filterProduct !== 'all' && supplier.product !== filterProduct) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      return (
        supplier.supplierName?.toLowerCase().includes(searchLower) ||
        supplier.email?.toLowerCase().includes(searchLower) ||
        supplier.contactPerson?.toLowerCase().includes(searchLower) ||
        supplier.phoneNumber?.includes(searchTerm)
      );
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    };
    const statusText = {
      active: t('suppliers.active'),
      inactive: t('suppliers.inactive'),
      pending: t('suppliers.pending')
    };
    return <Badge variant={variants[status] || 'outline'}>{statusText[status as keyof typeof statusText] || status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeText = {
      supplier: t('suppliers.supplier'),
      farmer: t('suppliers.farmer')
    };
    return <Badge variant={type === 'supplier' ? 'default' : 'secondary'}>{typeText[type as keyof typeof typeText] || type}</Badge>;
  };

  const getContractStatusBadge = (status: ContractStatus) => {
    const statusConfig = {
      [ContractStatus.DRAFT]: { variant: 'secondary' as const, color: 'text-gray-600' },
      [ContractStatus.PENDING_REVIEW]: { variant: 'outline' as const, color: 'text-yellow-600' },
      [ContractStatus.PENDING_SIGNATURE]: { variant: 'outline' as const, color: 'text-orange-600' },
      [ContractStatus.ACTIVE]: { variant: 'default' as const, color: 'text-green-600' },
      [ContractStatus.SUSPENDED]: { variant: 'secondary' as const, color: 'text-red-600' },
      [ContractStatus.EXPIRED]: { variant: 'secondary' as const, color: 'text-gray-600' },
      [ContractStatus.TERMINATED]: { variant: 'destructive' as const, color: 'text-red-600' },
      [ContractStatus.RENEWED]: { variant: 'default' as const, color: 'text-blue-600' }
    };

    const config = statusConfig[status] || statusConfig[ContractStatus.DRAFT];
    return <Badge variant={config.variant}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getSupplierContracts = (supplierId: string) => {
    return mockContracts.filter(contract => contract.supplierId === supplierId);
  };

  // CRUD Functions
  const handleAddSupplier = () => {
    setIsUnifiedFormOpen(true);
  };

  const handleViewSupplier = (supplier: SupplierData) => {
    navigate(`/suppliers/${supplier.id}`);
  };

  const handleEditSupplier = (supplier: SupplierData) => {
    navigate(`/suppliers/edit/${supplier.id}`);
  };

  const handleDeleteSupplier = (supplier: SupplierData) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (supplierToDelete) {
      setIsLoading(true);
      setError(null);
      try {
        await supplierApiService.deleteSupplier(supplierToDelete.id);
        await loadSuppliers(); // Refresh the list
        setDeleteDialogOpen(false);
        setSupplierToDelete(null);
      } catch (err) {
        setError('Failed to delete supplier');
        console.error('Delete supplier error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateContract = (supplier: SupplierData) => {
    setSelectedSupplierForContract(supplier);
    setIsContractFormOpen(true);
  };

  const handleSaveSupplier = async (supplier: SupplierData) => {
    setIsLoading(true);
    setError(null);
    try {
      await loadSuppliers(); // Refresh the list
      setIsUnifiedFormOpen(false);
      // Navigate to supplier detail page after creating
      if (!supplier.id) {
        // Find the newly created supplier (may need to search by formId or name)
        const allSuppliers = await supplierApiService.getAllSuppliers();
        const newSupplier = allSuppliers.find(s => s.formId === supplier.formId || s.supplierName === supplier.supplierName);
        if (newSupplier) {
          navigate(`/suppliers/${newSupplier.id}`);
        }
      }
    } catch (err) {
      setError('Failed to save supplier');
      console.error('Save supplier error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSupplier = () => {
    setIsUnifiedFormOpen(false);
  };

  
  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('suppliers.title')}</h1>
          <p className="text-muted-foreground">Manage your supplier and farmer network</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => loadSuppliers()}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Refresh
          </Button>
          <Dialog open={isUnifiedFormOpen} onOpenChange={setIsUnifiedFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddSupplier} disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Suppliers
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogTitle className="text-xl">Add New Supplier with Comprehensive Survey</DialogTitle>
              <SupplierSurveyForm
                onSave={handleSaveSupplier}
                onCancel={handleCancelSupplier}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="supplier">Suppliers</SelectItem>
            <SelectItem value="farmer">Farmers</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProduct} onValueChange={(value: string) => setFilterProduct(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="Rubber Seed">Rubber Seed</SelectItem>
            <SelectItem value="Copra">Copra</SelectItem>
            <SelectItem value="Plastic">Plastic</SelectItem>
            <SelectItem value="POME">POME</SelectItem>
            <SelectItem value="Enzyme">Enzyme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading suppliers...
              </span>
            ) : (
              `${filteredSuppliers.length} ${filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} found`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Land Info</TableHead>
                <TableHead>Survey Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading suppliers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => {
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{safeRender(supplier.supplierName, 'Invalid supplier name')}</TableCell>
                      <TableCell>{getTypeBadge(supplier.type)}</TableCell>
                      <TableCell>
                        {supplier.product ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {safeRender(supplier.product, 'Not specified')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{safeRender(supplier.email, 'Invalid email')}</div>
                        <div>{safeRender(supplier.phoneNumber, 'Invalid phone')}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{safeRender(supplier.plantationAddress, 'Invalid address')}</div>
                        <div className="text-muted-foreground">GPS: {safeRender(supplier.gpsCoordinate, 'N/A')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{(typeof supplier.totalLandSize === 'number' ? supplier.totalLandSize.toLocaleString('en-US') : '0')} Ha</div>
                        <div className="text-sm text-muted-foreground">Crop: {safeRender(supplier.mainCropType, 'N/A')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="w-12">Survey:</span>
                            <span className={`font-medium ${
                              supplier.hasDeforestation === 'no' ? 'text-green-600' :
                              supplier.hasDeforestation === 'yes' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {supplier.hasDeforestation === 'no' ? 'Clear' :
                               supplier.hasDeforestation === 'yes' ? 'Risk' : 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-12">Plots:</span>
                            <span className="font-medium">{supplier.plots?.length || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSupplier(supplier)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateContract(supplier)}
                            title="Create Contract"
                          >
                            <FileSignature className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSupplier(supplier)}
                            title="Edit Supplier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSupplier(supplier)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Supplier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Contract Dialog */}
      {selectedSupplierForContract && (
        <Dialog open={isContractFormOpen} onOpenChange={setIsContractFormOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Create Contract</DialogTitle>
              </VisuallyHidden>
              <DialogDescription>
                Create a new contract for {selectedSupplierForContract.supplierName}
              </DialogDescription>
            </DialogHeader>
            <ContractCreationForm
              supplierId={selectedSupplierForContract.id}
              supplierName={selectedSupplierForContract.supplierName}
              onContractCreated={(contract) => {
                console.log('Contract created:', contract);
                setIsContractFormOpen(false);
                setSelectedSupplierForContract(null);
              }}
              onCancel={() => {
                setIsContractFormOpen(false);
                setSelectedSupplierForContract(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {supplierToDelete && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the supplier "{supplierToDelete.supplierName}" and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default SuppliersPage;