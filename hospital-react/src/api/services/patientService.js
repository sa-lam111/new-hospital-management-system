/**
 * Patient API Service
 * Handles all patient-related API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

const patientService = {
  /**
   * Get all patients (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status
   */
  getAllPatients: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.patients.list, { params });
      return {
        success: true,
        data: response.data.data,
        total: response.data.total,
        pages: response.data.pages,
        currentPage: response.data.currentPage,
        count: response.data.count,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patients',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get current patient profile
   */
  getMyProfile: async () => {
    try {
      const response = await apiClient.get(config.endpoints.patients.getMe);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient profile',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get patient by ID
   * @param {string} patientId - Patient ID
   */
  getPatientById: async (patientId) => {
    try {
      const response = await apiClient.get(
        config.endpoints.patients.getById.replace(':id', patientId)
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Create new patient
   * @param {Object} patientData - Patient information
   */
  createPatient: async (patientData) => {
    try {
      const response = await apiClient.post(config.endpoints.patients.create, patientData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Patient created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create patient',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Update patient information
   * @param {string} patientId - Patient ID
   * @param {Object} updateData - Updated patient data
   */
  updatePatient: async (patientId, updateData) => {
    try {
      const response = await apiClient.put(
        config.endpoints.patients.update.replace(':id', patientId),
        updateData
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Patient updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update patient',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Delete patient (Admin only)
   * @param {string} patientId - Patient ID
   */
  deletePatient: async (patientId) => {
    try {
      const response = await apiClient.delete(
        config.endpoints.patients.delete.replace(':id', patientId)
      );
      return {
        success: true,
        message: response.data.message || 'Patient deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete patient',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Add medical history to patient
   * @param {string} patientId - Patient ID
   * @param {string} condition - Medical condition
   */
  addMedicalHistory: async (patientId, condition) => {
    try {
      const response = await apiClient.post(
        config.endpoints.patients.addMedicalHistory.replace(':id', patientId),
        { condition }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Medical history added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add medical history',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get patient statistics (Admin only)
   */
  getPatientStats: async () => {
    try {
      const response = await apiClient.get(config.endpoints.patients.stats);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient statistics',
        error: error.response?.data?.error,
      };
    }
  },
};

export default patientService;
