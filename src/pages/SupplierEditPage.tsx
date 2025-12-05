import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supplierApiService, type SupplierData } from '@/services/supplierApiAdapter';
import SupplierSurveyForm from '@/components/SupplierSurveyForm';

const SupplierEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSupplier = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const supplierData = await supplierApiService.getSupplierById(id);
          setSupplier(supplierData);
        } catch (err) {
          setError('Failed to load supplier for editing');
          console.error('Load supplier error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSupplier();
  }, [id]);

  const handleSave = (savedSupplier: SupplierData) => {
    console.log('Supplier updated successfully:', savedSupplier);
    navigate(`/suppliers/${savedSupplier.id}`);
  };

  const handleCancel = () => {
    if (supplier) {
      navigate(`/suppliers/${supplier.id}`);
    } else {
      navigate('/suppliers');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading supplier for editing...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-2xl font-semibold">Error</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Supplier Not Found</h2>
          <Button onClick={() => navigate('/suppliers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Suppliers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/suppliers/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Supplier Details
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Supplier</h1>
            <p className="text-muted-foreground">Update supplier information and survey data</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Supplier:</span>
          <span className="font-medium">{supplier.supplierName}</span>
          <span className="text-sm text-muted-foreground">ID: {supplier.uniqueSupplierId}</span>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardContent className="p-0">
          <SupplierSurveyForm
            supplierId={id}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierEditPage;