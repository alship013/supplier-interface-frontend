import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Upload, MapPin, Calendar, FileText, Camera, AlertTriangle, CheckCircle, Save, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supplierApiService, type SupplierData, type UploadedFile } from '@/services/supplierApiAdapter';
const format = (date: Date, fmt: string) => {
  return date.toISOString().split('T')[0]; // Simple date formatting for YYYY-MM-DD
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// High-quality image processing function
const processImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Only process if image is extremely large (>4000px) to maintain quality
      const maxDimension = 4000;

      if (width <= maxDimension && height <= maxDimension && file.size <= 8 * 1024 * 1024) {
        // Return original if it's already good quality
        resolve(file);
        return;
      }

      // Smart resizing only for very large images
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // High-quality rendering
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }));
          } else {
            // Return original if processing doesn't improve quality or size
            resolve(file);
          }
        },
        file.type,
        0.95 // Very high quality (95%)
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

interface SupplierSurveyFormProps {
  supplierId?: string; // For editing existing supplier
  onSave?: (supplier: SupplierData) => void;
  onCancel?: () => void;
}

const SupplierSurveyForm: React.FC<SupplierSurveyFormProps> = ({ supplierId, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Generate truly unique IDs
  const generateFormId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `FORM-${timestamp}-${random}`;
  };

  const generateSupplierId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `SUP-${timestamp}-${random}`;
  };

  const [formData, setFormData] = useState<Partial<SupplierData>>({
    formId: generateFormId(),
    uniqueSupplierId: generateSupplierId(),
    surveyDate: format(new Date(), 'yyyy-MM-dd'),
    dateVerified: format(new Date(), 'yyyy-MM-dd'),
    type: 'supplier',
    product: '',
    plots: [{ id: '1', identifier: 'Plot 1', size: 0, gpsCoordinates: '' }],
    observedRedFlags: [],
    fertilizerMonths: [],
    proofOfOwnership: [],
    previousLandUse: [],
    environmentalPractices: [],
    healthSafetyChecklist: [],
    workerRights: [],
    recordKeeping: [],
    laborType: [],

    // Photos - using new structured format
    photos: {},
    proofPhotos: {},

    // Digital Consent and OTP
    consentGiven: false,
    consentTimestamp: '',
    tncVersion: '1.0',
    otpCode: '',
    userEnteredOtp: '',
    otpRequested: false,
    otpVerified: false,
    ipAddress: '',
    verificationTimestamp: ''
  });

  // Photo categories configuration
  const photoCategories = [
    { key: 'supplier', label: 'Supplier' },
    { key: 'cropSample', label: 'Crop Sample' },
    { key: 'plantation', label: 'Plantation' },
    { key: 'landTitle', label: 'Land Title/Docs' },
    { key: 'roadAccess', label: 'Road Access' }
  ];

  const [lastSaved, setLastSaved] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Utility functions
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const parseFormattedNumber = (formatted: string): number => {
    const unformatted = formatted.replace(/,/g, '');
    return parseFloat(unformatted) || 0;
  };

  // GPS coordinate validation function
  const validateGPSCoordinates = (coord: string) => {
    if (!coord || coord.trim() === '') {
      return { valid: false, reason: 'empty' };
    }

    const trimmed = coord.trim();

    // Check for obvious non-numeric content
    if (trimmed.toLowerCase().includes('not') ||
        trimmed.toLowerCase().includes('n/a') ||
        trimmed.toLowerCase().includes('none') ||
        trimmed.toLowerCase().includes('unknown') ||
        trimmed.toLowerCase().includes('pending')) {
      return { valid: false, reason: 'not_provided' };
    }

    // Try to parse decimal degrees format: "latitude,longitude"
    if (trimmed.includes(',')) {
      try {
        const [lat, lng] = trimmed.split(',').map(s => parseFloat(s.trim()));

        if (isNaN(lat) || isNaN(lng)) {
          return { valid: false, reason: 'invalid_format' };
        }

        // Validate coordinate ranges
        if (lat < -90 || lat > 90) {
          return { valid: false, reason: 'invalid_latitude' };
        }

        if (lng < -180 || lng > 180) {
          return { valid: false, reason: 'invalid_longitude' };
        }

        return { valid: true, reason: 'success' };
      } catch (error) {
        return { valid: false, reason: 'parse_error' };
      }
    }

    return { valid: false, reason: 'unrecognized_format' };
  };

  // Field validation helper
  const isFieldValid = (field: keyof SupplierData): boolean => {
    const value = formData[field];
    if (typeof value === 'string') {
      return value.trim() !== '';
    } else if (typeof value === 'boolean') {
      return value;
    } else if (Array.isArray(value)) {
      return value.length > 0;
    } else if (typeof value === 'number') {
      return value > 0;
    }
    return false;
  };

  // OTP functions
  const generateOTP = () => {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const getClientIP = async () => {
    try {
      // For development/testing, we'll use a mock IP
      // In production, you could use a service like https://api.ipify.org or your backend
      const mockIP = '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
      return mockIP;
    } catch (error) {
      return 'Unknown';
    }
  };

  const requestOTP = async () => {
    const otp = generateOTP();
    const phoneNumber = formData.phoneNumber;

    // Generate client IP
    const ipAddress = await getClientIP();

    // Update form with OTP data
    setFormData(prev => ({
      ...prev,
      otpCode: otp,
      otpRequested: true,
      ipAddress: ipAddress,
      verificationTimestamp: new Date().toISOString()
    }));

    // Show the OTP to user (mock SMS service)
    alert(`🔐 Your OTP Verification Code\n\nCode: ${otp}\n\nThis would be sent to: ${phoneNumber}\nYour IP: ${ipAddress}`);
  };

  const verifyOTP = () => {
    if (formData.userEnteredOtp === formData.otpCode) {
      setFormData(prev => ({
        ...prev,
        otpVerified: true
      }));
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const clearOTP = () => {
    setFormData(prev => ({
      ...prev,
      otpCode: '',
      userEnteredOtp: '',
      otpRequested: false,
      otpVerified: false
    }));
  };

  // File validation function (matches reference implementation)
  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP files are allowed';
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  // Photo upload functions (matches reference implementation)
  const handleFileUpload = async (photoType: keyof SupplierData['photos'], file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    try {
      // Create preview
      const preview = URL.createObjectURL(file);

      // Process the image with high quality preservation
      const processedFile = await processImage(file);

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        preview,
        compressedFile: processedFile
      };

      // Update form data with new structure
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [photoType]: uploadedFile
        }
      }));
    } catch (error) {
      alert('Failed to process image');
    }
  };

  const removePhoto = (photoType: keyof SupplierData['photos']) => {
    setFormData(prev => {
      const updatedPhotos = { ...prev.photos };
      if (updatedPhotos[photoType]?.preview) {
        URL.revokeObjectURL(updatedPhotos[photoType].preview);
      }
      delete updatedPhotos[photoType];
      return {
        ...prev,
        photos: updatedPhotos
      };
    });
  };

  const handleFileChange = (photoType: keyof SupplierData['photos']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(photoType, file);
    }
    // Reset input value to allow uploading the same file again if removed
    e.target.value = '';
  };

  // Proof photo functions (for land ownership documents)
  const handleProofPhotoUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    try {
      // Create preview
      const preview = URL.createObjectURL(file);

      // Process the image with high quality preservation
      const processedFile = await processImage(file);

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        preview,
        compressedFile: processedFile
      };

      // Update form data
      setFormData(prev => ({
        ...prev,
        proofPhotos: {
          ...prev.proofPhotos,
          ownership: uploadedFile
        }
      }));
    } catch (error) {
      alert('Failed to process photo');
    }
  };

  const removeProofPhoto = () => {
    setFormData(prev => {
      const updatedProofPhotos = { ...prev.proofPhotos };
      if (updatedProofPhotos.ownership?.preview) {
        URL.revokeObjectURL(updatedProofPhotos.ownership.preview);
      }
      updatedProofPhotos.ownership = undefined;
      return {
        ...prev,
        proofPhotos: updatedProofPhotos
      };
    });
  };

  // Get field border class based on validity
  const getFieldBorderClass = (field: keyof SupplierData): string => {
    return isFieldValid(field)
      ? 'border-green-300 focus:border-green-400'
      : 'border-red-200 focus:border-red-300';
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!supplierId) return; // Only auto-save for existing suppliers

    setIsSaving(true);
    setAutoSaveStatus('saving');

    try {
      await supplierApiService.updateSupplier(supplierId, formData as SupplierData);
      setAutoSaveStatus('saved');
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [formData, supplierId]);

  // Update formData with auto-save
  const updateFormData = (field: keyof SupplierData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Ensure proofPhotos is never undefined
      proofPhotos: field === 'proofPhotos' && value === undefined ? {} : (field === 'proofPhotos' ? value : prev.proofPhotos || {}),
      // Ensure photos is never undefined
      photos: field === 'photos' && value === undefined ? {} : (field === 'photos' ? value : prev.photos || {})
    }));

    // Trigger auto-save for existing suppliers
    if (supplierId) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout to save after 2 seconds of inactivity
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 2000);

      setAutoSaveStatus('idle');
    }
  };

  // Load existing supplier data if editing
  useEffect(() => {
    const loadSupplier = async () => {
      if (supplierId) {
        try {
          const supplier = await supplierApiService.getSupplierById(supplierId);
          if (supplier) {
            setFormData(supplier);
          }
        } catch (err) {
          setError('Failed to load supplier data');
          console.error('Load supplier error:', err);
        }
      }
    };

    loadSupplier();
  }, [supplierId]);

  const addPlot = () => {
    const newPlot: PlotData = {
      id: Date.now().toString(),
      identifier: `Plot ${formData.plots?.length || 0 + 1}`,
      size: 0,
      gpsCoordinates: ''
    };
    setFormData(prev => ({
      ...prev,
      plots: [...(prev.plots || []), newPlot]
    }));
  };

  const updatePlot = (plotId: string, field: keyof PlotData, value: any) => {
    setFormData(prev => ({
      ...prev,
      plots: prev.plots?.map(plot =>
        plot.id === plotId ? { ...plot, [field]: value } : plot
      )
    }));
  };

  const removePlot = (plotId: string) => {
    setFormData(prev => ({
      ...prev,
      plots: prev.plots?.filter(plot => plot.id !== plotId)
    }));
  };

  
  const toggleArrayItem = (field: keyof SupplierData, item: string) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const getProgress = () => {
    // Define required fields for each section
    const basicFields = [
      'supplierName', 'contactPerson', 'phoneNumber', 'email', 'plantationAddress'
    ];

    const landFields = [
      'ownershipType', 'legalStatusOfLand'
    ];

    const eudrFields = [
      'hasDeforestation'
    ];

    const isccFields = [
      'isccLandUse'
    ];

    const plantationFields = [
      'mainCropType', 'totalLandSize'
    ];

    const reviewFields = [
      'declaration', 'surveyorSignature', 'supplierSignature', 'dateVerified'
    ];

    // Count filled fields in each section
    const getSectionProgress = (fields: string[]) => {
      const filledCount = fields.filter(field => {
        const value = formData[field as keyof SupplierData];
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'boolean') {
          return value;
        } else if (Array.isArray(value)) {
          return value.length > 0;
        } else if (typeof value === 'number') {
          return value > 0;
        }
        return false;
      }).length;
      return (filledCount / fields.length) * 100;
    };

    // Calculate progress for each section
    const basicProgress = getSectionProgress(basicFields);
    const landProgress = getSectionProgress(landFields);
    const eudrProgress = getSectionProgress(eudrFields);
    const isccProgress = getSectionProgress(isccFields);
    const plantationProgress = getSectionProgress(plantationFields);
    const reviewProgress = getSectionProgress(reviewFields);

    // Calculate overall progress
    const sections = [basicProgress, landProgress, eudrProgress, isccProgress, plantationProgress, reviewProgress];
    const overallProgress = sections.reduce((sum, progress) => sum + progress, 0) / sections.length;

    // Get current section progress for detailed view
    const getCurrentSectionProgress = () => {
      switch (currentTab) {
        case 'basic': return basicProgress;
        case 'land': return landProgress;
        case 'eudr': return eudrProgress;
        case 'iscc': return isccProgress;
        case 'plantation': return plantationProgress;
        case 'review': return reviewProgress;
        default: return 0;
      }
    };

    return {
      overall: Math.round(overallProgress),
      current: Math.round(getCurrentSectionProgress()),
      sections: {
        basic: Math.round(basicProgress),
        land: Math.round(landProgress),
        eudr: Math.round(eudrProgress),
        iscc: Math.round(isccProgress),
        plantation: Math.round(plantationProgress),
        review: Math.round(reviewProgress)
      }
    };
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.supplierName?.trim()) {
        alert('Supplier name is required');
        setCurrentTab('basic');
        return;
      }

      if (!formData.email?.trim()) {
        alert('Email is required');
        setCurrentTab('basic');
        return;
      }

      if (!formData.phoneNumber?.trim()) {
        alert('Phone number is required');
        setCurrentTab('basic');
        return;
      }

      if (!formData.consentGiven) {
        alert('Please accept the Terms and Conditions to submit the form');
        setCurrentTab('review');
        return;
      }

      if (!formData.otpVerified) {
        alert('Please complete OTP verification to submit the form');
        setCurrentTab('review');
        return;
      }

      // Prepare supplier data
      const supplierData: Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData as SupplierData,
        status: formData.status || 'pending',
        type: formData.type || 'supplier',
        consentTimestamp: new Date().toISOString(),
        // Generate new unique IDs only for new suppliers, not when editing
        ...(supplierId ? {} : {
          formId: generateFormId(),
          uniqueSupplierId: generateSupplierId()
        })
      };

      let savedSupplier: SupplierData;

      if (supplierId) {
        // Update existing supplier
        savedSupplier = await supplierApiService.updateSupplier(supplierId, supplierData)!;
        alert('Supplier updated successfully!');
      } else {
        // Create new supplier
        savedSupplier = await supplierApiService.createSupplier(supplierData);
        alert('Supplier created successfully!');
      }

      console.log('Form submitted:', savedSupplier);

      // Call onSave callback if provided
      if (onSave) {
        onSave(savedSupplier);
      }

      // Reset form if creating new supplier
      if (!supplierId) {
        resetForm();
      }

    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      formId: generateFormId(),
      uniqueSupplierId: generateSupplierId(),
      surveyDate: format(new Date(), 'yyyy-MM-dd'),
      dateVerified: format(new Date(), 'yyyy-MM-dd'),
      type: 'supplier',
      product: '',
      plots: [{ id: '1', identifier: 'Plot 1', size: 0, gpsCoordinates: '' }],
      observedRedFlags: [],
      fertilizerMonths: [],
      proofOfOwnership: [],
      previousLandUse: [],
      environmentalPractices: [],
      healthSafetyChecklist: [],
      workerRights: [],
      recordKeeping: [],
      laborType: [],

      // Digital Consent and OTP
      consentGiven: false,
      consentTimestamp: '',
      tncVersion: '1.0',
      otpCode: '',
      userEnteredOtp: '',
      otpRequested: false,
      otpVerified: false,
      ipAddress: '',
      verificationTimestamp: ''
    });
    setCurrentTab('basic');
    setUploadedFiles({});
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Supplier & Plantation Survey Form
            </div>
            {supplierId && (
              <div className="flex items-center gap-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved {lastSaved}</span>
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Save failed</span>
                  </div>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Comprehensive supplier evaluation and compliance assessment
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Form Progress</span>
              <span>{getProgress().overall}%</span>
            </div>
            <Progress value={getProgress().overall} className="w-full mb-4" />

            {/* Section Progress Details */}
            <div className="grid grid-cols-6 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium mb-1">Basic Info</div>
                <Progress value={getProgress().sections.basic} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.basic}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">Land Status</div>
                <Progress value={getProgress().sections.land} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.land}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">EUDR</div>
                <Progress value={getProgress().sections.eudr} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.eudr}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">ISCC</div>
                <Progress value={getProgress().sections.iscc} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.iscc}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">Plantation</div>
                <Progress value={getProgress().sections.plantation} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.plantation}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium mb-1">Review</div>
                <Progress value={getProgress().sections.review} className="h-2" />
                <div className="mt-1 text-muted-foreground">{getProgress().sections.review}%</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
          <TabsTrigger value="land">2. Land Status</TabsTrigger>
          <TabsTrigger value="eudr">3. EUDR</TabsTrigger>
          <TabsTrigger value="iscc">4. ISCC</TabsTrigger>
          <TabsTrigger value="plantation">5. Plantation</TabsTrigger>
          <TabsTrigger value="review">6. Review</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General supplier and contact information (* Required fields)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="formId">Form ID</Label>
                <Input id="formId" value={formData.formId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniqueSupplierId">Unique Supplier ID</Label>
                <Input id="uniqueSupplierId" value={formData.uniqueSupplierId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surveyDate">Survey Date</Label>
                <Input
                  id="surveyDate"
                  type="date"
                  value={formData.surveyDate}
                  onChange={(e) => updateFormData('surveyDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Input
                  id="supplierName"
                  placeholder={t('supplierForm.enterSupplierName')}
                  value={formData.supplierName || ''}
                  onChange={(e) => updateFormData('supplierName', e.target.value)}
                  className={getFieldBorderClass('supplierName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder={t('supplierForm.enterContactPerson')}
                  value={formData.contactPerson || ''}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  className={getFieldBorderClass('contactPerson')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder={t('supplierForm.enterPhoneNumber')}
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className={getFieldBorderClass('phoneNumber')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('supplierForm.enterEmailAddress')}
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={getFieldBorderClass('email')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Supplier Type *</Label>
                <Select value={formData.type || ''} onValueChange={(value) => updateFormData('type', value as 'supplier' | 'farmer')}>
                  <SelectTrigger className={getFieldBorderClass('type')}>
                    <SelectValue placeholder="Select supplier type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="farmer">Farmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Primary Product *</Label>
                <Select value={formData.product || ''} onValueChange={(value) => updateFormData('product', value)}>
                  <SelectTrigger className={getFieldBorderClass('product')}>
                    <SelectValue placeholder="Select primary product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rubber Seed">Rubber Seed</SelectItem>
                    <SelectItem value="Copra">Copra</SelectItem>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="POME">POME (Palm Oil Mill Effluent)</SelectItem>
                    <SelectItem value="Enzyme">Enzyme</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Select the main product supplied by this entity</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpsCoordinate">GPS Coordinates</Label>
                <Input
                  id="gpsCoordinate"
                  placeholder="Example: -7.743331, 110.405178"
                  value={formData.gpsCoordinate || ''}
                  onChange={(e) => updateFormData('gpsCoordinate', e.target.value)}
                  className={formData.gpsCoordinate && validateGPSCoordinates(formData.gpsCoordinate).valid ? 'border-green-300 focus:border-green-500' : ''}
                />
                <p className="text-xs text-gray-500">
                  Format: latitude, longitude in decimal degrees
                  <br />
                  Examples: -7.743331, 110.405178 (Yogyakarta) • 1.3521, 103.8198 (Singapore)
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="plantationAddress">Plantation Address *</Label>
                <Textarea
                  id="plantationAddress"
                  placeholder="Enter complete plantation address"
                  rows={3}
                  value={formData.plantationAddress || ''}
                  onChange={(e) => updateFormData('plantationAddress', e.target.value)}
                  className={getFieldBorderClass('plantationAddress')}
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Interactive Map Placeholder</span>
                  <Badge variant="outline">GPS: {formData.gpsCoordinate || 'Not set'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Land Status and Legality */}
        <TabsContent value="land" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Land Status and Legality</CardTitle>
              <CardDescription>Land ownership, legal documentation, and compliance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ownership Type</Label>
                  <Select value={formData.ownershipType || ''} onValueChange={(value) => updateFormData('ownershipType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="customary">Customary</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Legal Status of Land</Label>
                  <Select value={formData.legalStatusOfLand || ''} onValueChange={(value) => updateFormData('legalStatusOfLand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="in_process">In Process</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Ownership</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['SHM', 'HGB', 'HGU', 'HP', 'Girik', 'Adat', 'Other'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`proof-${type}`}
                        checked={formData.proofOfOwnership?.includes(type) || false}
                        onCheckedChange={() => toggleArrayItem('proofOfOwnership', type)}
                      />
                      <Label htmlFor={`proof-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input
                    id="certificateNumber"
                    placeholder="Enter certificate number"
                    value={formData.certificateNumber || ''}
                    onChange={(e) => updateFormData('certificateNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Buyer (Competitor)</Label>
                  <Select value={formData.currentBuyer || ''} onValueChange={(value) => updateFormData('currentBuyer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select buyer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="middleman">Middleman</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Proof of Ownership Photos</Label>
                <p className="text-sm text-gray-600 mb-4">Upload high-quality photos of your land ownership documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'ownership', label: 'Ownership Document' }
                  ].map((photo) => (
                    <div key={photo.key} className="border rounded-lg p-4">
                      <Label className="text-sm font-medium">{photo.label}</Label>

                      {formData.proofPhotos && formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos] ? (
                        // Show uploaded file preview
                        (() => {
                          const currentPhoto = formData.proofPhotos![photo.key as keyof typeof formData.proofPhotos];
                          return (
                            <div className="mt-2">
                              <div className="relative group">
                                <img
                                  src={currentPhoto?.preview}
                                  alt={photo.label}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={removeProofPhoto}
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {currentPhoto?.compressedFile?.name || 'File processed'}
                              </p>
                              <p className="text-xs text-green-600">
                                {(currentPhoto?.compressedFile?.size || 0) < 1024
                                  ? `${Math.round((currentPhoto?.compressedFile?.size || 0))} bytes`
                                  : `${Math.round(((currentPhoto?.compressedFile?.size || 0)) / 1024)} KB`
                                } (high quality)
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        // Show upload prompt
                        <div className="mt-2">
                          <input
                            type="file"
                            id={`proof-upload-${photo.key}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleProofPhotoUpload(file);
                              }
                              // Reset input value
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`proof-upload-${photo.key}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                              <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 10MB)</p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-700">
                    💡 <strong>High Quality Tips:</strong> Take photos in good lighting with the entire document visible. Ensure text is readable for verification purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: EUDR Compliance */}
        <TabsContent value="eudr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>EUDR Compliance</CardTitle>
              <CardDescription>European Union Deforestation Regulation compliance assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Has deforestation occurred since Dec 31, 2020?</Label>
                <RadioGroup value={formData.hasDeforestation || ''} onValueChange={(value) => updateFormData('hasDeforestation', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="deforest-yes" />
                    <Label htmlFor="deforest-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="deforest-no" />
                    <Label htmlFor="deforest-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidenceNoDeforest">Evidence of no deforestation</Label>
                <Textarea
                  id="evidenceNoDeforest"
                  placeholder="Provide evidence or notes about no deforestation"
                  rows={3}
                  value={formData.evidenceOfNoDeforestation || ''}
                  onChange={(e) => updateFormData('evidenceOfNoDeforestation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>EUDR Legality Checklist</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Land rights and use title verified and documented',
                    'No deforestation occurred after December 31, 2020',
                    'Legal land acquisition process followed',
                    'Required environmental permits obtained and valid',
                    'Social impact assessment conducted (if applicable)',
                    'Free, prior, and informed consent obtained (if applicable)',
                    'No conflicts with customary land rights',
                    'Compliance with national and local forestry laws'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`legality-${item.replace(/\s+/g, '_').substring(0, 30)}`}
                        checked={formData.legalityChecklist?.includes(item) || false}
                        onCheckedChange={() => toggleArrayItem('legalityChecklist', item)}
                      />
                      <Label htmlFor={`legality-${item.replace(/\s+/g, '_').substring(0, 30)}`} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Proximity to Indigenous/local communities</Label>
                  <RadioGroup value={formData.proximityToIndigenous || ''} onValueChange={(value) => updateFormData('proximityToIndigenous', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="indig-yes" />
                      <Label htmlFor="indig-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="indig-no" />
                      <Label htmlFor="indig-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="indig-unsure" />
                      <Label htmlFor="indig-unsure">Unsure</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Known land conflicts/disputes</Label>
                  <RadioGroup value={formData.landConflicts || ''} onValueChange={(value) => updateFormData('landConflicts', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="conflict-yes" />
                      <Label htmlFor="conflict-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="conflict-no" />
                      <Label htmlFor="conflict-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="conflict-unsure" />
                      <Label htmlFor="conflict-unsure">Unsure</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="harvestStart">Harvest Date Start</Label>
                  <Input
                    id="harvestStart"
                    type="date"
                    value={formData.harvestDateStart || ''}
                    onChange={(e) => updateFormData('harvestDateStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestEnd">Harvest Date End</Label>
                  <Input
                    id="harvestEnd"
                    type="date"
                    value={formData.harvestDateEnd || ''}
                    onChange={(e) => updateFormData('harvestDateEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstPointOfSale">First Point of Sale/Aggregation</Label>
                <Input
                  id="firstPointOfSale"
                  placeholder="Enter first point of sale"
                  value={formData.firstPointOfSale || ''}
                  onChange={(e) => updateFormData('firstPointOfSale', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">Plots of Land</Label>
                  <Button onClick={addPlot} variant="outline" size="sm">
                    Add Plot
                  </Button>
                </div>

                {formData.plots?.map((plot) => (
                  <Card key={plot.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Input
                        value={plot.identifier}
                        onChange={(e) => updatePlot(plot.id, 'identifier', e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        onClick={() => removePlot(plot.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plot Size (Ha)</Label>
                        <Input
                          type="number"
                          value={plot.size}
                          onChange={(e) => updatePlot(plot.id, 'size', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPS Coordinates (polygon)</Label>
                        <Input
                          placeholder="Polygon coordinates"
                          value={plot.gpsCoordinates}
                          onChange={(e) => updatePlot(plot.id, 'gpsCoordinates', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-muted rounded text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Interactive map tool placeholder
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: ISCC Self Assessment */}
        <TabsContent value="iscc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ISCC Self Assessment</CardTitle>
              <CardDescription>International Sustainability and Carbon Certification evaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 1: Land Use</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>ISCC Land Use Check: conversion after Jan 1, 2008?</Label>
                    <RadioGroup value={formData.isccLandUse || ''} onValueChange={(value) => updateFormData('isccLandUse', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="iscc-yes" />
                        <Label htmlFor="iscc-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="iscc-no" />
                        <Label htmlFor="iscc-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unknown" id="iscc-unknown" />
                        <Label htmlFor="iscc-unknown">Unknown</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Land Use (ISCC Definition)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['primary forest', 'peatland', 'HBD', 'HCS'].map((use) => (
                        <div key={use} className="flex items-center space-x-2">
                          <Checkbox
                            id={`use-${use}`}
                            checked={formData.previousLandUse?.includes(use) || false}
                            onCheckedChange={() => toggleArrayItem('previousLandUse', use)}
                          />
                          <Label htmlFor={`use-${use}`} className="text-sm capitalize">{use}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 2: Environmental Management</h3>
                <div className="space-y-2">
                  <Label>Environmental Practices in Place</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Environmental impact assessment conducted',
                      'Waste management system implemented',
                      'Water conservation measures in place',
                      'Soil erosion prevention program',
                      'Biodiversity conservation plan',
                      'Pesticide and fertilizer management plan',
                      'Emergency response procedures established'
                    ].map((practice) => (
                      <div key={practice} className="flex items-center space-x-2">
                        <Checkbox
                          id={`env-${practice.replace(/\s+/g, '_').substring(0, 20)}`}
                          checked={formData.environmentalPractices?.includes(practice) || false}
                          onCheckedChange={() => toggleArrayItem('environmentalPractices', practice)}
                        />
                        <Label htmlFor={`env-${practice.replace(/\s+/g, '_').substring(0, 20)}`} className="text-sm">{practice}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 3: Health, Safety and Labor</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Health & Safety Checklist</Label>
                    <div className="space-y-2">
                      {[
                        'Personal protective equipment (PPE) provided',
                        'Regular safety training conducted',
                        'First aid facilities available',
                        'Emergency evacuation procedures in place',
                        'Fire safety equipment installed',
                        'Chemical safety procedures implemented',
                        'Regular workplace inspections conducted'
                      ].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={`hs-${item.replace(/\s+/g, '_').substring(0, 15)}`}
                            checked={formData.healthSafetyChecklist?.includes(item) || false}
                            onCheckedChange={() => toggleArrayItem('healthSafetyChecklist', item)}
                          />
                          <Label htmlFor={`hs-${item.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Worker Rights</Label>
                    <div className="space-y-2">
                      {[
                        'Fair wages and timely payment',
                        'No forced or child labor',
                        'Freedom of association respected',
                        'Working hours comply with legal limits',
                        'Safe and healthy working conditions',
                        'Equal opportunity employment practices',
                        'Right to collective bargaining'
                      ].map((right) => (
                        <div key={right} className="flex items-center space-x-2">
                          <Checkbox
                            id={`right-${right.replace(/\s+/g, '_').substring(0, 15)}`}
                            checked={formData.workerRights?.includes(right) || false}
                            onCheckedChange={() => toggleArrayItem('workerRights', right)}
                          />
                          <Label htmlFor={`right-${right.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{right}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Grievance mechanism available?</Label>
                    <RadioGroup value={formData.grievanceMechanism || ''} onValueChange={(value) => updateFormData('grievanceMechanism', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="grievance-yes" />
                        <Label htmlFor="grievance-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="grievance-no" />
                        <Label htmlFor="grievance-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Freedom of association respected?</Label>
                    <RadioGroup value={formData.freedomOfAssociation || ''} onValueChange={(value) => updateFormData('freedomOfAssociation', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="assoc-yes" />
                        <Label htmlFor="assoc-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="assoc-no" />
                        <Label htmlFor="assoc-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principle 4&5: Management & Traceability</h3>
                <div className="space-y-2">
                  <Label>Record Keeping System</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Procurement records maintained',
                      'Production records tracked',
                      'Quality control results documented',
                      'Sales and distribution records',
                      'Training records maintained',
                      'Environmental monitoring records',
                      'Compliance audit documentation',
                      'Traceability records complete'
                    ].map((record) => (
                      <div key={record} className="flex items-center space-x-2">
                        <Checkbox
                          id={`record-${record.replace(/\s+/g, '_').substring(0, 15)}`}
                          checked={formData.recordKeeping?.includes(record) || false}
                          onCheckedChange={() => toggleArrayItem('recordKeeping', record)}
                        />
                        <Label htmlFor={`record-${record.replace(/\s+/g, '_').substring(0, 15)}`} className="text-sm">{record}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Participated in GAP training?</Label>
                  <RadioGroup value={formData.gapTraining || ''} onValueChange={(value) => updateFormData('gapTraining', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="gap-yes" />
                      <Label htmlFor="gap-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="gap-no" />
                      <Label htmlFor="gap-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Plantation Profile */}
        <TabsContent value="plantation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantation Profile</CardTitle>
              <CardDescription>Detailed farm and operational information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Profile</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainCrop">Main Crop Type</Label>
                    <Input
                      id="mainCrop"
                      placeholder="e.g., Oil Palm"
                      value={formData.mainCropType || ''}
                      onChange={(e) => updateFormData('mainCropType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantingYear">Planting Year (average)</Label>
                    <Input
                      id="plantingYear"
                      type="number"
                      placeholder="e.g., 2015"
                      value={formData.plantingYear || ''}
                      onChange={(e) => updateFormData('plantingYear', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageOfTrees">Age of Trees (Years)</Label>
                    <Input
                      id="ageOfTrees"
                      type="number"
                      placeholder="e.g., 8"
                      value={formData.ageOfTrees || ''}
                      onChange={(e) => updateFormData('ageOfTrees', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLandSize">Total Land Size (Ha)</Label>
                    <Input
                      id="totalLandSize"
                      type="text"
                      placeholder="e.g., 50"
                      value={formData.totalLandSize ? formatNumber(formData.totalLandSize) : ''}
                      onChange={(e) => updateFormData('totalLandSize', parseFormattedNumber(e.target.value))}
                      className={getFieldBorderClass('totalLandSize')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedYield">Estimated Yield (kg/Ha)</Label>
                    <Input
                      id="estimatedYield"
                      type="text"
                      placeholder="e.g., 20,000"
                      value={formData.estimatedYield ? formatNumber(formData.estimatedYield) : ''}
                      onChange={(e) => updateFormData('estimatedYield', parseFormattedNumber(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                      id="soilType"
                      placeholder="e.g., Clay loam"
                      value={formData.soilType || ''}
                      onChange={(e) => updateFormData('soilType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topography">Topography</Label>
                    <Select value={formData.topography || ''} onValueChange={(value) => updateFormData('topography', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topography" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="gently_sloping">Gently Sloping</SelectItem>
                        <SelectItem value="moderately_sloping">Moderately Sloping</SelectItem>
                        <SelectItem value="steep">Steep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Farming System</Label>
                    <RadioGroup value={formData.farmingSystem || ''} onValueChange={(value) => updateFormData('farmingSystem', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monoculture" id="mono" />
                        <Label htmlFor="mono">Monoculture</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intercropped" id="inter" />
                        <Label htmlFor="inter">Intercropped</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Labor</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Labor Type</Label>
                    <div className="space-y-2">
                      {['Family', 'Hired', 'Local', 'Migrant'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`labor-${type}`}
                            checked={formData.laborType?.includes(type) || false}
                            onCheckedChange={() => toggleArrayItem('laborType', type)}
                          />
                          <Label htmlFor={`labor-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentWorkers">Number of Workers (Permanent)</Label>
                      <Input
                        id="permanentWorkers"
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.permanentWorkers || ''}
                        onChange={(e) => updateFormData('permanentWorkers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seasonalWorkers">Number of Workers (Seasonal)</Label>
                      <Input
                        id="seasonalWorkers"
                        type="number"
                        placeholder="e.g., 25"
                        value={formData.seasonalWorkers || ''}
                        onChange={(e) => updateFormData('seasonalWorkers', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access and Logistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Road Condition</Label>
                    <Select value={formData.roadCondition || ''} onValueChange={(value) => updateFormData('roadCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select road condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paved">Paved</SelectItem>
                        <SelectItem value="semi_paved">Semi-paved</SelectItem>
                        <SelectItem value="no_road">No road</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.distance || ''}
                      onChange={(e) => updateFormData('distance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Category</Label>
                    <RadioGroup value={formData.accessCategory || ''} onValueChange={(value) => updateFormData('accessCategory', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="access-easy" />
                        <Label htmlFor="access-easy">Easy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="access-moderate" />
                        <Label htmlFor="access-moderate">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="access-hard" />
                        <Label htmlFor="access-hard">Hard</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Farming Practices & Costs</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="waterSource">Water Source</Label>
                    <Input
                      id="waterSource"
                      placeholder="e.g., River, well, irrigation"
                      value={formData.waterSource || ''}
                      onChange={(e) => updateFormData('waterSource', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pestControl">Pest Control Method</Label>
                    <Input
                      id="pestControl"
                      placeholder="e.g., Integrated pest management"
                      value={formData.pestControlMethod || ''}
                      onChange={(e) => updateFormData('pestControlMethod', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantitySpecs">Quantity Specs</Label>
                    <Input
                      id="quantitySpecs"
                      placeholder="e.g., Fertilizer amounts"
                      value={formData.quantitySpecs || ''}
                      onChange={(e) => updateFormData('quantitySpecs', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fertilizerUse">Fertilizer Use</Label>
                    <Input
                      id="fertilizerUse"
                      placeholder="e.g., NPK application rates"
                      value={formData.fertilizerUse || ''}
                      onChange={(e) => updateFormData('fertilizerUse', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fertilizer Usage Type</Label>
                    <Select value={formData.fertilizerUsageType || ''} onValueChange={(value) => updateFormData('fertilizerUsageType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fertilizer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chemical">Chemical</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="mix">Mix</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fertilizerDetails">Fertilizer Brand/Type Details</Label>
                    <Textarea
                      id="fertilizerDetails"
                      placeholder="Enter fertilizer brand and type details"
                      rows={2}
                      value={formData.fertilizerBrandDetails || ''}
                      onChange={(e) => updateFormData('fertilizerBrandDetails', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fertilizer Application Months</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                      <div key={month} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fert-${month}`}
                          checked={formData.fertilizerMonths?.includes(month) || false}
                          onCheckedChange={() => toggleArrayItem('fertilizerMonths', month)}
                        />
                        <Label htmlFor={`fert-${month}`} className="text-sm">{month}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="costFertilizer">Cost: Fertilizer (IDR/year)</Label>
                    <Input
                      id="costFertilizer"
                      type="text"
                      placeholder="e.g., 5,000,000"
                      value={formData.costFertilizer ? formatNumber(formData.costFertilizer) : ''}
                      onChange={(e) => updateFormData('costFertilizer', parseFormattedNumber(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costLabor">Cost: Labor (IDR/year)</Label>
                    <Input
                      id="costLabor"
                      type="text"
                      placeholder="e.g., 120,000,000"
                      value={formData.costLabor ? formatNumber(formData.costLabor) : ''}
                      onChange={(e) => updateFormData('costLabor', parseFormattedNumber(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costTransport">Cost: Transport (IDR/shipment)</Label>
                    <Input
                      id="costTransport"
                      type="text"
                      placeholder="e.g., 1,500,000"
                      value={formData.costTransport ? formatNumber(formData.costTransport) : ''}
                      onChange={(e) => updateFormData('costTransport', parseFormattedNumber(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seasonality</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Peak Season</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.peakSeasonStart || ''} onValueChange={(value) => updateFormData('peakSeasonStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.peakSeasonEnd || ''} onValueChange={(value) => updateFormData('peakSeasonEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Seed Collection</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.seedCollectionStart || ''} onValueChange={(value) => updateFormData('seedCollectionStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.seedCollectionEnd || ''} onValueChange={(value) => updateFormData('seedCollectionEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Fruit Development</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={formData.fruitDevelopmentStart || ''} onValueChange={(value) => updateFormData('fruitDevelopmentStart', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.fruitDevelopmentEnd || ''} onValueChange={(value) => updateFormData('fruitDevelopmentEnd', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="End month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Review and Submit */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription>Final review, documentation, and submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Summary</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Supplier:</strong> {formData.supplierName || 'Not provided'}<br />
                    <strong>Contact Person:</strong> {formData.contactPerson || 'Not provided'}<br />
                    <strong>Crop Type:</strong> {formData.mainCropType || 'Not provided'}<br />
                    <strong>Total Land Size:</strong> {formData.totalLandSize || 'Not provided'} Ha
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalNotes">Final Survey Details: Notes</Label>
                <Textarea
                  id="finalNotes"
                  placeholder="Enter any additional notes or observations"
                  rows={4}
                  value={formData.finalNotes || ''}
                  onChange={(e) => updateFormData('finalNotes', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Observed Red Flags</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Evidence of burning', 'Child labor', 'Encroachment on protected land'].map((flag) => (
                    <div key={flag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`flag-${flag}`}
                        checked={formData.observedRedFlags?.includes(flag) || false}
                        onCheckedChange={() => toggleArrayItem('observedRedFlags', flag)}
                      />
                      <Label htmlFor={`flag-${flag}`} className="text-sm">{flag}</Label>
                    </div>
                  ))}
                </div>
                {formData.observedRedFlags && formData.observedRedFlags.length > 0 && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {formData.observedRedFlags.length} red flag(s) identified
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Photos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoCategories.map((photo) => (
                    <div key={photo.key} className="border rounded-lg p-4">
                      <Label className="text-sm font-medium">{photo.label}</Label>

                      {formData.photos && formData.photos[photo.key as keyof SupplierData['photos']] ? (
                        // Show uploaded file preview
                        (() => {
                          const currentPhoto = formData.photos![photo.key as keyof SupplierData['photos']];
                          return (
                            <div className="mt-2">
                              <div className="relative group">
                                <img
                                  src={currentPhoto?.preview}
                                  alt={photo.label}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(photo.key as keyof SupplierData['photos'])}
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {currentPhoto?.compressedFile?.name || 'File processed'}
                              </p>
                              <p className="text-xs text-green-600">
                                {(currentPhoto?.compressedFile?.size || 0) < 1024
                                  ? `${Math.round((currentPhoto?.compressedFile?.size || 0))} bytes`
                                  : `${Math.round(((currentPhoto?.compressedFile?.size || 0)) / 1024)} KB`
                                } (optimized)
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        // Show upload prompt
                        <div className="mt-2">
                          <input
                            type="file"
                            id={`file-upload-${photo.key}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange(photo.key as keyof SupplierData['photos'])}
                            className="hidden"
                          />
                          <label
                            htmlFor={`file-upload-${photo.key}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                              <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 10MB)</p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Recommended Follow-Up Action</Label>
                  <RadioGroup value={formData.recommendedAction || ''} onValueChange={(value) => updateFormData('recommendedAction', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="do_not_follow_up" id="follow-none" />
                      <Label htmlFor="follow-none">Do not follow up</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="require_verification" id="follow-verify" />
                      <Label htmlFor="follow-verify">Require verification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="do_not_engage" id="follow-no" />
                      <Label htmlFor="follow-no">Do not engage</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for selected action"
                    rows={3}
                    value={formData.reason || ''}
                    onChange={(e) => updateFormData('reason', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-blue-900">Digital Consent and Verification</h3>

                <div className="mb-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="text-primary-600 hover:text-primary-800 underline text-sm font-medium">
                        Read Genco Supplier Data - Terms and Conditions
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <AlertDialogHeader>
                        <div className="flex items-center justify-between">
                          <AlertDialogTitle>Genco Supplier Data - Terms and Conditions</AlertDialogTitle>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                              aria-label="Close"
                            >
                              <svg
                                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </AlertDialogTrigger>
                        </div>
                        <AlertDialogDescription>
                          <div className="text-left space-y-4 text-sm">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                              <span className="font-semibold">Effective Date:</span>
                              <span>{getCurrentDate()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                              <span className="font-semibold">Version:</span>
                              <span>1.0</span>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-base">1. Introduction</h4>
                              <p>
                                By checking the box and submitting this form, you ("the Supplier") are providing information
                                to Genco ("the Company") and agree to the terms outlined below regarding the collection,
                                use, and protection of your data.
                              </p>

                              <h4 className="font-semibold text-base">2. Purpose of Data Collection</h4>
                              <p>
                                The Company collects the information provided in this survey for the following specific purposes:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>To conduct due diligence and verify your eligibility as a supplier.</li>
                                <li>To ensure compliance with international sustainability standards, including but not limited
                                to ISCC (International Sustainability and Carbon Certification) and EUDR (EU Deforestation Regulation).</li>
                                <li>To manage our supply chain and maintain traceability of raw materials from source to final product.</li>
                                <li>For internal record-keeping, operational planning, and communication related to our business relationship.</li>
                              </ul>

                              <h4 className="font-semibold text-base">3. Data Usage and Confidentiality</h4>
                              <p>
                                Genco provides the following guarantee regarding your data:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>
                                  <strong>Internal Use Only:</strong> Your data will be used exclusively for the internal
                                  business purposes of the Company as described above.
                                </li>
                                <li>
                                  <strong>No Sale of Data:</strong> We will <strong>never</strong> sell, rent, or lease
                                  your personal or operational data to any third party for marketing or any other purpose.
                                </li>
                                <li>
                                  <strong>Limited Sharing:</strong> Your data may be shared with trusted third parties
                                  only when strictly necessary for our business operations. This includes:
                                  <ul className="list-disc pl-6 mt-1">
                                    <li><strong>Auditors:</strong> Third-party auditors verifying our compliance with sustainability certifications.</li>
                                    <li><strong>Regulatory Bodies:</strong> Government or regulatory agencies as required by law.</li>
                                  </ul>
                                </li>
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">
                                These parties are also bound by strict confidentiality agreements.
                              </p>

                              <h4 className="font-semibold text-base">4. Data Security</h4>
                              <p>
                                We are committed to ensuring that your information is secure. We have implemented suitable
                                physical, electronic, and managerial procedures to safeguard and secure the information we collect.
                              </p>

                              <h4 className="font-semibold text-base">5. Consent and Declaration</h4>
                              <p>
                                By checking the "I Agree" box, you declare that:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>You are authorized to provide this information on behalf of the supplier/plantation.</li>
                                <li>The information provided is true, accurate, and complete to the best of your knowledge.</li>
                                <li>You have read, understood, and agree to these Terms and Conditions regarding the use of your data.</li>
                              </ul>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-3">Digital Agreement Details</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    By checking the box below and completing the verification process, you confirm the following:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5 mb-4">
                    <li>You have read, understood, and agree to the <strong>Genco Supplier Data Terms and Conditions</strong>.</li>
                    <li>You certify that you are authorized to provide this information on behalf of the supplier/plantation.</li>
                    <li>You declare that all information provided is true, accurate, and complete to the best of your knowledge.</li>
                  </ul>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    Your agreement will be recorded digitally. For verification purposes, we will capture your <strong>IP Address</strong>,
                    the <strong>Date and Time</strong> of submission, and validate your identity by sending a <strong>One-Time Password (OTP)</strong>
                    to the provided phone number. This digital record will serve as your binding confirmation.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentGiven || false}
                      onChange={(e) => updateFormData('consentGiven', e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-blue-800">
                      I have read, understood, and agree to the Genco Supplier Data Terms and Conditions.
                      I certify that I am authorized to provide this information and that all information
                      provided is true, accurate, and complete to the best of my knowledge.
                    </span>
                  </label>
                </div>
              </div>

              {/* OTP Verification Section */}
              {formData.consentGiven && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-green-900">🔐 OTP Verification</h3>

                  {!formData.otpRequested ? (
                    // Request OTP
                    <div>
                      <p className="text-sm text-gray-700 mb-4">
                        We need to verify your identity before submission. A One-Time Password (OTP) will be sent to:
                      </p>
                      <div className="bg-white p-3 rounded border mb-4">
                        <p className="font-medium">{formData.phoneNumber}</p>
                        <p className="text-xs text-gray-500">Phone number on record</p>
                      </div>
                      <Button
                        type="button"
                        onClick={requestOTP}
                        disabled={!formData.phoneNumber}
                        className="w-full md:w-auto"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Send OTP Code
                      </Button>
                    </div>
                  ) : !formData.otpVerified ? (
                    // Verify OTP
                    <div>
                      <p className="text-sm text-gray-700 mb-4">
                        Enter the 6-digit OTP code that was sent to your phone:
                      </p>
                      <div className="flex gap-3 mb-4">
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          value={formData.userEnteredOtp || ''}
                          onChange={(e) => updateFormData('userEnteredOtp', e.target.value)}
                          className="text-center text-lg font-mono"
                        />
                        <Button
                          type="button"
                          onClick={verifyOTP}
                          disabled={formData.userEnteredOtp?.length !== 6}
                        >
                          Verify OTP
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearOTP}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                        <p className="text-xs text-yellow-800">
                          💡 For testing: The OTP was displayed in the popup message when you clicked "Send OTP Code".
                          In production, this would be sent via SMS to your phone.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={requestOTP}
                          className="text-xs"
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // OTP Verified
                    <div className="bg-green-100 border border-green-300 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="font-medium text-green-800">✅ Verification Successful</p>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Phone Verified:</strong> {formData.phoneNumber}</p>
                        <p><strong>IP Address:</strong> {formData.ipAddress}</p>
                        <p><strong>Verification Time:</strong> {new Date(formData.verificationTimestamp || '').toLocaleString()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearOTP}
                        className="mt-3"
                      >
                        Reset Verification
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dateVerified">Date Verified</Label>
                <Input
                  id="dateVerified"
                  type="date"
                  value={formData.dateVerified || ''}
                  onChange={(e) => updateFormData('dateVerified', e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentTab('plantation')}>
                  Previous Section
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.consentGiven || !formData.otpVerified}
                  className="px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Survey Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const tabs = ['basic', 'land', 'eudr', 'iscc', 'plantation', 'review'];
              const currentIndex = tabs.indexOf(currentTab);
              if (currentIndex > 0) {
                setCurrentTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={currentTab === 'basic'}
          >
            Previous
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        <Button
          onClick={() => {
            const tabs = ['basic', 'land', 'eudr', 'iscc', 'plantation', 'review'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={currentTab === 'review'}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SupplierSurveyForm;