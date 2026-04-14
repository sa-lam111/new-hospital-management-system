/**
 * Admin API Service
 * Handles all admin dashboard and management API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get(config.endpoints.admin.dashboard);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get all users
   * @param {Object} params - Query parameters
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.admin.users, { params });
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
        message: error.response?.data?.message || 'Failed to fetch users',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(
        config.endpoints.admin.deleteUser.replace(':id', userId)
      );
      return {
        success: true,
        message: response.data.message || 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get all patients
   * @param {Object} params - Query parameters
   */
  getAllPatients: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.admin.patients, { params });
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
   * Get all doctors
   * @param {Object} params - Query parameters
   */
  getAllDoctors: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.admin.doctors, { params });
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
        message: error.response?.data?.message || 'Failed to fetch doctors',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get all appointments
   * @param {Object} params - Query parameters
   */
  getAllAppointments: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.admin.appointments, { params });
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
        message: error.response?.data?.message || 'Failed to fetch appointments',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get patient medical records
   * @param {string} patientId - Patient ID
   * @param {Object} params - Query parameters
   */
  getPatientMedicalRecords: async (patientId, params = {}) => {
    try {
      const response = await apiClient.get(
        config.endpoints.admin.medicalRecords.replace(':patientId', patientId),
        { params }
      );
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
        message: error.response?.data?.message || 'Failed to fetch medical records',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Generate report
   * @param {string} reportType - Type of report (appointments, patients, doctors)
   * @param {Object} params - Query parameters
   */
  generateReport: async (reportType, params = {}) => {
    try {
      const response = await apiClient.get(
        config.endpoints.admin.reports.replace(':type', reportType),
        { params }
      );
      return {
        success: true,
        data: response.data.data,
        reportType: response.data.reportType,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error: error.response?.data?.error,
      };
    }
  },
};

export default adminService;
