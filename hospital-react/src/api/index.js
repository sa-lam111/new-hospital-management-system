/**
 * API Module Export Index
 * Centralized export of all API utilities and services
 */

// API Utilities
export { default as apiClient } from './client.js';
export { default as config } from './config.js';
export { default as authTokenManager } from './auth.js';
export { default as errorHandler, APIError } from './errorHandler.js';
export { default as requestHandler } from './requestHandler.js';

// API Services
export {
  authService,
  patientService,
  doctorService,
  appointmentService,
  adminService,
  billingService,
} from './services/index.js';
