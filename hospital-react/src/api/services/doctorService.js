/**
 * Doctor Service
 * Handles all doctor-related API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

const doctorService = {
  /**
   * Get all doctors with pagination and filters
   * @param {Object} params - Query parameters (page, limit, specialization, etc.)
   * @returns {Promise}
   */
  getAllDoctors: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.doctors.list, { params });
      return {
        success: true,
        data: response.data.doctors || response.data,
        total: response.data.total,
        message: 'Doctors retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctors',
        error: error.message,
      };
    }
  },

  /**
   * Get current logged-in doctor's profile
   * @returns {Promise}
   */
  getMyProfile: async () => {
    try {
      const response = await apiClient.get(config.endpoints.doctors.getMe);
      return {
        success: true,
        data: response.data.doctor || response.data,
        message: 'Doctor profile retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctor profile',
        error: error.message,
      };
    }
  },

  /**
   * Get a specific doctor by ID
   * @param {string} id - Doctor ID
   * @returns {Promise}
   */
  getDoctorById: async (id) => {
    try {
      const url = config.endpoints.doctors.getById.replace(':id', id);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.doctor || response.data,
        message: 'Doctor retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctor',
        error: error.message,
      };
    }
  },

  /**
   * Get doctors by specialization
   * @param {string} specialization - Doctor specialization
   * @param {Object} params - Additional parameters
   * @returns {Promise}
   */
  getDoctorsBySpecialization: async (specialization, params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.doctors.getBySpecialization, {
        params: { specialization, ...params },
      });
      return {
        success: true,
        data: response.data.doctors || response.data,
        message: 'Doctors retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctors by specialization',
        error: error.message,
      };
    }
  },

  /**
   * Get doctor's appointments
   * @param {string} id - Doctor ID
   * @param {Object} params - Query parameters (status, date range, etc.)
   * @returns {Promise}
   */
  getDoctorAppointments: async (id, params = {}) => {
    try {
      const url = config.endpoints.doctors.getAppointments.replace(':id', id);
      const response = await apiClient.get(url, { params });
      return {
        success: true,
        data: response.data.appointments || response.data,
        total: response.data.total,
        message: 'Appointments retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctor appointments',
        error: error.message,
      };
    }
  },

  /**
   * Get doctor's availability with time slots
   * @param {string} id - Doctor ID
   * @param {Object} params - Query parameters (date, etc.)
   * @returns {Promise}
   */
  getDoctorAvailability: async (id, params = {}) => {
    try {
      const url = config.endpoints.doctors.getAvailability.replace(':id', id);
      const response = await apiClient.get(url, { params });
      return {
        success: true,
        data: response.data.availability || response.data,
        message: 'Availability retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctor availability',
        error: error.message,
      };
    }
  },

  /**
   * Create a new doctor (Admin only)
   * @param {Object} doctorData - Doctor information
   * @returns {Promise}
   */
  createDoctor: async (doctorData) => {
    try {
      const response = await apiClient.post(config.endpoints.doctors.list, doctorData);
      return {
        success: true,
        data: response.data.doctor || response.data,
        message: 'Doctor created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create doctor',
        error: error.message,
      };
    }
  },

  /**
   * Update doctor information
   * @param {string} id - Doctor ID
   * @param {Object} updateData - Updated doctor information
   * @returns {Promise}
   */
  updateDoctor: async (id, updateData) => {
    try {
      const url = config.endpoints.doctors.update.replace(':id', id);
      const response = await apiClient.put(url, updateData);
      return {
        success: true,
        data: response.data.doctor || response.data,
        message: 'Doctor updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update doctor',
        error: error.message,
      };
    }
  },

  /**
   * Get doctor statistics and analytics
   * @param {string} id - Doctor ID (optional, if included get specific doctor stats)
   * @returns {Promise}
   */
  getDoctorStats: async (id = null) => {
    try {
      const url = id
        ? config.endpoints.doctors.stats.replace(':id', id)
        : config.endpoints.doctors.stats;
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.stats || response.data,
        message: 'Doctor statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch doctor statistics',
        error: error.message,
      };
    }
  },
};

export default doctorService;
