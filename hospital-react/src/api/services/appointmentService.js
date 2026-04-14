/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

const appointmentService = {
  /**
   * Get all appointments (Admin only)
   * @param {Object} params - Query parameters
   */
  getAllAppointments: async (params = {}) => {
    try {
      const response = await apiClient.get(config.endpoints.appointments.list, { params });
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
   * Get patient's appointments
   * @param {string} patientId - Patient ID
   * @param {Object} params - Query parameters
   */
  getPatientAppointments: async (patientId, params = {}) => {
    try {
      const url = config.endpoints.appointments.getPatientAppointments.replace(':patientId', patientId);
      const response = await apiClient.get(url, { params });
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
        message: error.response?.data?.message || 'Failed to fetch patient appointments',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get doctor's appointments
   * @param {string} doctorId - Doctor ID
   * @param {Object} params - Query parameters
   */
  getDoctorAppointments: async (doctorId, params = {}) => {
    try {
      const url = config.endpoints.appointments.getDoctorAppointments.replace(':doctorId', doctorId);
      const response = await apiClient.get(url, { params });
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
        message: error.response?.data?.message || 'Failed to fetch doctor appointments',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get a specific appointment by ID
   * @param {string} id - Appointment ID
   */
  getAppointmentById: async (id) => {
    try {
      const url = config.endpoints.appointments.getById.replace(':id', id);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointment',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Book a new appointment
   * @param {Object} appointmentData - Appointment details
   */
  bookAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post(
        config.endpoints.appointments.create,
        appointmentData
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Appointment booked successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to book appointment',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Update appointment status
   * @param {string} id - Appointment ID
   * @param {string} status - New status
   */
  updateAppointmentStatus: async (id, status) => {
    try {
      const url = config.endpoints.appointments.updateStatus.replace(':id', id);
      const response = await apiClient.put(url, { status });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || `Appointment marked as ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update appointment status',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Add medical notes to appointment
   * @param {string} id - Appointment ID
   * @param {Object} medicalNotesData - Diagnosis, prescription, notes
   */
  addMedicalNotes: async (id, medicalNotesData) => {
    try {
      const url = config.endpoints.appointments.addMedicalNotes.replace(':id', id);
      const response = await apiClient.post(url, medicalNotesData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Medical notes added successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add medical notes',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Reschedule an appointment
   * @param {string} id - Appointment ID
   * @param {Object} rescheduleData - New date and time
   */
  rescheduleAppointment: async (id, rescheduleData) => {
    try {
      const url = config.endpoints.appointments.reschedule.replace(':id', id);
      const response = await apiClient.put(url, rescheduleData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Appointment rescheduled successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reschedule appointment',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Cancel an appointment
   * @param {string} id - Appointment ID
   */
  cancelAppointment: async (id) => {
    try {
      const url = config.endpoints.appointments.cancel.replace(':id', id);
      const response = await apiClient.put(url);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Appointment cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel appointment',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get current authenticated patient's appointments
   * Uses the /appointments/patient/me endpoint (requires user to be authenticated)
   * @param {Object} params - Query parameters (status, date range, etc.)
   */
  getMyAppointments: async (params = {}) => {
    try {
      // Try the /me endpoint first, fallback to getting from user context
      const response = await apiClient.get(`${config.endpoints.appointments.list}/me`, { params });
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
        message: error.response?.data?.message || 'Failed to fetch your appointments',
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get appointment statistics
   */
  getAppointmentStats: async () => {
    try {
      const response = await apiClient.get(config.endpoints.appointments.stats);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointment statistics',
        error: error.response?.data?.error,
      };
    }
  },
};

export default appointmentService;
