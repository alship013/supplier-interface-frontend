import { supplierApi, ApiError } from './api';
import { type SupplierData, type UploadedFile } from './supplierDatabase';

// Field mapping functions between frontend (camelCase) and backend (snake_case)
const mapFrontendToBackend = (supplierData: Partial<SupplierData>) => {
  const mappedData: any = {};

  // Map basic fields
  if (supplierData.uniqueSupplierId) mappedData.unique_supplier_id = supplierData.uniqueSupplierId;
  if (supplierData.formId) mappedData.form_id = supplierData.formId;
  if (supplierData.supplierName) mappedData.supplier_name = supplierData.supplierName;
  if (supplierData.contactPerson) mappedData.contact_person = supplierData.contactPerson;
  if (supplierData.phoneNumber) mappedData.phone_number = supplierData.phoneNumber;
  if (supplierData.email) mappedData.email = supplierData.email;
  if (supplierData.plantationAddress) mappedData.address = supplierData.plantationAddress;
  if (supplierData.gpsCoordinate) mappedData.gps_coordinates = supplierData.gpsCoordinate;
  if (supplierData.totalLandSize !== undefined) mappedData.total_land_size = supplierData.totalLandSize;
  if (supplierData.permanentWorkers !== undefined) mappedData.permanent_workers = supplierData.permanentWorkers;
  if (supplierData.seasonalWorkers !== undefined) mappedData.seasonal_workers = supplierData.seasonalWorkers;
  if (supplierData.otpCode) mappedData.otp_code = supplierData.otpCode;
  if (supplierData.otpRequested !== undefined) mappedData.otp_requested = supplierData.otpRequested;
  if (supplierData.otpVerified !== undefined) mappedData.otp_verified = supplierData.otpVerified;
  if (supplierData.ipAddress) mappedData.ip_address = supplierData.ipAddress;
  if (supplierData.type) mappedData.type = supplierData.type;
  if (supplierData.status) mappedData.status = supplierData.status;

  // Handle nested objects
  if (supplierData.photos) {
    // Store photos as JSON string or handle separately as needed
    mappedData.photos_json = JSON.stringify(supplierData.photos);
  }

  // Store complex nested data as JSON strings
  const complexFields = [
    'ownershipType', 'proofOfOwnership', 'certificateNumber', 'legalStatusOfLand', 'currentBuyer',
    'hasDeforestation', 'evidenceOfNoDeforestation', 'legalityChecklist', 'proximityToIndigenous',
    'landConflicts', 'harvestDateStart', 'harvestDateEnd', 'firstPointOfSale', 'plots',
    'isccLandUse', 'previousLandUse', 'environmentalPractices', 'healthSafetyChecklist',
    'workerRights', 'grievanceMechanism', 'freedomOfAssociation', 'recordKeeping', 'gapTraining',
    'mainCropType', 'plantingYear', 'ageOfTrees', 'estimatedYield', 'soilType', 'topography',
    'farmingSystem', 'laborType', 'roadCondition', 'distance', 'accessCategory', 'waterSource',
    'pestControlMethod', 'quantitySpecs', 'fertilizerUse', 'fertilizerUsageType', 'fertilizerBrandDetails',
    'fertilizerMonths', 'costFertilizer', 'costLabor', 'costTransport', 'peakSeasonStart', 'peakSeasonEnd',
    'seedCollectionStart', 'seedCollectionEnd', 'fruitDevelopmentStart', 'fruitDevelopmentEnd',
    'finalNotes', 'observedRedFlags', 'recommendedAction', 'reason', 'dateVerified',
    'consentGiven', 'consentTimestamp', 'tncVersion', 'userEnteredOtp', 'verificationTimestamp',
    // Additional fields for survey data
    'product', 'village', 'district', 'regency', 'province', 'latitude', 'longitude',
    'is_ispo_certified', 'is_rspo_certified'
  ];

  complexFields.forEach(field => {
    if (supplierData[field as keyof SupplierData] !== undefined) {
      mappedData[field] = JSON.stringify(supplierData[field as keyof SupplierData]);
    }
  });

  return mappedData;
};

const mapBackendToFrontend = (backendData: any): SupplierData => {
  const frontendData: Partial<SupplierData> = {};

  // Map basic fields
  frontendData.id = backendData.id || backendData.unique_supplier_id;
  frontendData.uniqueSupplierId = backendData.unique_supplier_id;
  frontendData.formId = backendData.form_id;
  frontendData.supplierName = backendData.supplier_name;
  frontendData.contactPerson = backendData.contact_person;
  frontendData.phoneNumber = backendData.phone_number;
  frontendData.email = backendData.email;
  frontendData.plantationAddress = backendData.address || backendData.plantation_address;
  frontendData.gpsCoordinate = backendData.gps_coordinates;
  frontendData.totalLandSize = backendData.total_land_size;
  frontendData.permanentWorkers = backendData.permanent_workers;
  frontendData.seasonalWorkers = backendData.seasonal_workers;
  frontendData.otpCode = backendData.otp_code;
  frontendData.otpRequested = backendData.otp_requested;
  frontendData.otpVerified = backendData.otp_verified;
  frontendData.ipAddress = backendData.ip_address;
  frontendData.type = backendData.type;
  frontendData.status = backendData.status;
  frontendData.createdAt = backendData.created_at;
  frontendData.updatedAt = backendData.updated_at;
  frontendData.verificationTimestamp = backendData.verification_timestamp;

  // Additional mapping for location data
  if (backendData.latitude || backendData.longitude) {
    frontendData.gpsCoordinate = `${backendData.latitude || 0}, ${backendData.longitude || 0}`;
  }

  // Parse JSON fields if they exist
  try {
    if (backendData.photos_json) {
      frontendData.photos = JSON.parse(backendData.photos_json);
    }
  } catch (e) {
    console.warn('Failed to parse photos_json:', e);
  }

  // Parse complex fields
  const jsonFields = [
    'ownershipType', 'proofOfOwnership', 'certificateNumber', 'legalStatusOfLand', 'currentBuyer',
    'hasDeforestation', 'evidenceOfNoDeforestation', 'legalityChecklist', 'proximityToIndigenous',
    'landConflicts', 'harvestDateStart', 'harvestDateEnd', 'firstPointOfSale', 'plots',
    'isccLandUse', 'previousLandUse', 'environmentalPractices', 'healthSafetyChecklist',
    'workerRights', 'grievanceMechanism', 'freedomOfAssociation', 'recordKeeping', 'gapTraining',
    'mainCropType', 'plantingYear', 'ageOfTrees', 'estimatedYield', 'soilType', 'topography',
    'farmingSystem', 'laborType', 'roadCondition', 'distance', 'accessCategory', 'waterSource',
    'pestControlMethod', 'quantitySpecs', 'fertilizerUse', 'fertilizerUsageType', 'fertilizerBrandDetails',
    'fertilizerMonths', 'costFertilizer', 'costLabor', 'costTransport', 'peakSeasonStart', 'peakSeasonEnd',
    'seedCollectionStart', 'seedCollectionEnd', 'fruitDevelopmentStart', 'fruitDevelopmentEnd',
    'finalNotes', 'observedRedFlags', 'recommendedAction', 'reason', 'dateVerified',
    'consentGiven', 'consentTimestamp', 'tncVersion', 'userEnteredOtp', 'verificationTimestamp',
    // Additional fields
    'product', 'village', 'district', 'regency', 'province', 'latitude', 'longitude',
    'is_ispo_certified', 'is_rspo_certified'
  ];

  jsonFields.forEach(field => {
    if (backendData[field] && typeof backendData[field] === 'string') {
      try {
        frontendData[field as keyof SupplierData] = JSON.parse(backendData[field]);
      } catch (e) {
        // If it's not JSON, keep as is
        frontendData[field as keyof SupplierData] = backendData[field];
      }
    } else if (backendData[field] !== undefined) {
      frontendData[field as keyof SupplierData] = backendData[field];
    }
  });

  return frontendData as SupplierData;
};

// API-only adapter class - no offline functionality
class SupplierApiAdapter {
  /**
   * Create a new supplier
   */
  async createSupplier(supplierData: Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierData> {
    // Map frontend data to backend format
    const backendData = mapFrontendToBackend(supplierData);
    const result = await supplierApi.createSupplier(backendData);

    // Convert API response to match frontend format
    return mapBackendToFrontend(result);
  }

  /**
   * Get all suppliers
   */
  async getAllSuppliers(): Promise<SupplierData[]> {
    const result = await supplierApi.getSuppliers();

    // Convert API response to match frontend format
    return result.suppliers.map(supplier => mapBackendToFrontend(supplier));
  }

  /**
   * Get supplier by ID
   */
  async getSupplierById(id: string): Promise<SupplierData | null> {
    const supplier = await supplierApi.getSupplierById(id);

    if (!supplier) {
      return null;
    }

    // Convert API response to match frontend format
    return mapBackendToFrontend(supplier);
  }

  /**
   * Update supplier
   */
  async updateSupplier(id: string, supplierData: Partial<SupplierData>): Promise<SupplierData | null> {
    // Map frontend data to backend format
    const backendData = mapFrontendToBackend(supplierData);
    const result = await supplierApi.updateSupplier(id, backendData);

    // Convert API response to match frontend format
    return mapBackendToFrontend(result);
  }

  /**
   * Delete supplier
   */
  async deleteSupplier(id: string): Promise<boolean> {
    await supplierApi.deleteSupplier(id);
    return true;
  }

  /**
   * Get supplier statistics
   */
  async getSupplierStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    const stats = await supplierApi.getSupplierStats();

    return {
      total: stats.totalSuppliers || 0,
      active: stats.activeSuppliers || 0,
      inactive: 0, // Backend doesn't provide inactive count
      pending: stats.pendingSuppliers || 0
    };
  }

  /**
   * Verify supplier with OTP
   */
  async verifySupplier(id: string, otp: string): Promise<{ success: boolean; verificationTimestamp?: string }> {
    const result = await supplierApi.verifySupplier(id, otp);
    return {
      success: result.verified,
      verificationTimestamp: result.verification_timestamp
    };
  }

  /**
   * Resend OTP
   */
  async resendOTP(id: string): Promise<{ success: boolean; phoneNumber?: string; email?: string }> {
    const result = await supplierApi.resendOTP(id);
    return {
      success: true,
      phoneNumber: result.phoneNumber,
      email: result.email
    };
  }

  /**
   * Search suppliers
   */
  async searchSuppliers(query: string): Promise<SupplierData[]> {
    const result = await supplierApi.getSuppliers({ search: query });

    return result.suppliers.map(supplier => mapBackendToFrontend(supplier));
  }

  /**
   * Get suppliers by status
   */
  async getSuppliersByStatus(status: string): Promise<SupplierData[]> {
    const result = await supplierApi.getSuppliers({ status });

    return result.suppliers.map(supplier => mapBackendToFrontend(supplier));
  }

  /**
   * Get suppliers by type
   */
  async getSuppliersByType(type: string): Promise<SupplierData[]> {
    const result = await supplierApi.getSuppliers({ type });

    return result.suppliers.map(supplier => mapBackendToFrontend(supplier));
  }
}

// Export singleton instance
export const supplierApiAdapter = new SupplierApiAdapter();

// Export the adapter class for dependency injection or testing
export { SupplierApiAdapter };

// Export a compatibility object that matches the old IndexedDB service interface
export const supplierApiService = {
  // Database-like methods
  createSupplier: (data: Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>) =>
    supplierApiAdapter.createSupplier(data),

  getAllSuppliers: () =>
    supplierApiAdapter.getAllSuppliers(),

  getSupplierById: (id: string) =>
    supplierApiAdapter.getSupplierById(id),

  updateSupplier: (id: string, data: Partial<SupplierData>) =>
    supplierApiAdapter.updateSupplier(id, data),

  deleteSupplier: (id: string) =>
    supplierApiAdapter.deleteSupplier(id),

  getSupplierStats: () =>
    supplierApiAdapter.getSupplierStats(),

  // Additional API-specific methods
  verifySupplier: (id: string, otp: string) =>
    supplierApiAdapter.verifySupplier(id, otp),

  resendOTP: (id: string) =>
    supplierApiAdapter.resendOTP(id),

  searchSuppliers: (query: string) =>
    supplierApiAdapter.searchSuppliers(query),

  getSuppliersByStatus: (status: string) =>
    supplierApiAdapter.getSuppliersByStatus(status),

  getSuppliersByType: (type: string) =>
    supplierApiAdapter.getSuppliersByType(type)
};

// Always use API - no offline mode
export const supplierService = supplierApiService;