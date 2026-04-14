/**
 * API Error Handler Utility
 * Provides standardized error handling and user-friendly error messages
 */

/**
 * API Error Class
 * Custom error class for API errors with additional metadata
 */
export class APIError extends Error {
  constructor(message, status = null, data = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error Handler Utility
 * Handles and normalizes API errors
 */
const errorHandler = {
  /**
   * Convert various error types to standardized error response
   * @param {Error|AxiosError} error - Error object
   * @returns {Object} Standardized error object
   */
  handleError(error) {
    // Handle Axios errors
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || this.getStatusMessage(error.response.status),
        details: error.response.data?.details || error.response.data,
        timestamp: new Date().toISOString(),
      };
    }

    // Handle network errors
    if (error.request) {
      return {
        success: false,
        status: 0,
        message: 'Network error. Please check your internet connection.',
        type: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };
    }

    // Handle other errors
    return {
      success: false,
      status: null,
      message: error.message || 'An unexpected error occurred',
      type: 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Get user-friendly error message based on HTTP status code
   * @param {number} status - HTTP status code
   * @returns {string} User-friendly error message
   */
  getStatusMessage(status) {
    const statusMessages = {
      400: 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'You do not have permission to access this resource.',
      404: 'The requested resource was not found.',
      409: 'Conflict. This resource already exists.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Bad gateway. Please try again later.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. Please try again later.',
    };

    return statusMessages[status] || 'An unexpected error occurred.';
  },

  /**
   * Extract error message from various error formats
   * @param {Error|Object} error - Error object
   * @returns {string} Error message
   */
  getUserMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred.';
  },

  /**
   * Log error with context for debugging
   * @param {string} context - Where the error occurred
   * @param {Error} error - Error object
   * @param {Object} additionalData - Additional context data
   */
  logError(context, error, additionalData = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      additionalData,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorLog);
    }

    // Could be sent to error tracking service (e.g., Sentry)
    // captureException(errorLog);
  },

  /**
   * Check if error is due to authentication failure
   * @param {Error} error - Error object
   * @returns {boolean}
   */
  isAuthError(error) {
    return error.response?.status === 401 || error.response?.status === 403;
  },

  /**
   * Check if error is due to validation failure
   * @param {Error} error - Error object
   * @returns {boolean}
   */
  isValidationError(error) {
    return error.response?.status === 400 || error.response?.status === 422;
  },

  /**
   * Check if error is a network error
   * @param {Error} error - Error object
   * @returns {boolean}
   */
  isNetworkError(error) {
    return !error.response && !error.message;
  },

  /**
   * Check if error is a server error (5xx)
   * @param {Error} error - Error object
   * @returns {boolean}
   */
  isServerError(error) {
    const status = error.response?.status;
    return status >= 500 && status < 600;
  },

  /**
   * Check if error is a client error (4xx)
   * @param {Error} error - Error object
   * @returns {boolean}
   */
  isClientError(error) {
    const status = error.response?.status;
    return status >= 400 && status < 500;
  },
};

export default errorHandler;
