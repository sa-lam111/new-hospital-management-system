/**
 * Error Handling Utilities
 * Centralized error handling and formatting
 */

/**
 * HTTP Status Codes and Messages
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Error Types
 */
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Format API error response
 * @param {Object|Error} error - Error object from API or network
 * @returns {Object} - Formatted error object
 */
export const formatError = (error) => {
  // Handle axios error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    return {
      status,
      type: getErrorType(status),
      message: data?.message || getErrorMessage(status),
      errors: data?.errors || [],
      details: data?.details || null,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle network error
  if (error.request && !error.response) {
    return {
      status: 0,
      type: ERROR_TYPES.NETWORK_ERROR,
      message: 'Network error. Please check your connection.',
      errors: [],
      details: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle other errors
  return {
    status: 0,
    type: ERROR_TYPES.UNKNOWN_ERROR,
    message: error.message || 'An unknown error occurred',
    errors: [],
    details: null,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Get error type from HTTP status
 * @param {number} status - HTTP status code
 * @returns {string} - Error type
 */
export const getErrorType = (status) => {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return ERROR_TYPES.VALIDATION_ERROR;
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_TYPES.AUTHENTICATION_ERROR;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_TYPES.AUTHORIZATION_ERROR;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_TYPES.NOT_FOUND_ERROR;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return ERROR_TYPES.UNKNOWN_ERROR;
  }
};

/**
 * Get user-friendly error message from HTTP status
 * @param {number} status - HTTP status code
 * @returns {string} - Error message
 */
export const getErrorMessage = (status) => {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Invalid request. Please check your input.';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Session expired. Please log in again.';
    case HTTP_STATUS.FORBIDDEN:
      return 'You do not have permission to perform this action.';
    case HTTP_STATUS.NOT_FOUND:
      return 'The requested resource was not found.';
    case HTTP_STATUS.CONFLICT:
      return 'This resource already exists.';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return 'Invalid data provided.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return 'Service is temporarily unavailable. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

/**
 * Log error to console with proper formatting
 * @param {string} context - Where the error occurred
 * @param {Object|Error} error - Error object
 */
export const logError = (context, error) => {
  const formattedError = formatError(error);
  
  console.error(`[${context}]`, {
    status: formattedError.status,
    type: formattedError.type,
    message: formattedError.message,
    details: formattedError.details,
    timestamp: formattedError.timestamp,
  });
};

/**
 * Create a user-friendly error message
 * @param {Object} error - Formatted error object
 * @returns {string} - User-friendly message
 */
export const getUserErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }

  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0];
  }

  return 'An error occurred. Please try again.';
};

/**
 * Extract field errors from validation error
 * @param {Object} error - Error object with field-level errors
 * @returns {Object} - Map of field names to error messages
 */
export const extractFieldErrors = (error) => {
  const fieldErrors = {};

  if (error.errors && typeof error.errors === 'object') {
    Object.keys(error.errors).forEach((field) => {
      fieldErrors[field] = error.errors[field];
    });
  }

  return fieldErrors;
};

export default {
  formatError,
  getErrorType,
  getErrorMessage,
  logError,
  getUserErrorMessage,
  extractFieldErrors,
  HTTP_STATUS,
  ERROR_TYPES,
};
