/**
 * API Request Handler Utility
 * Provides standardized methods for making API calls with consistent response handling
 */

import apiClient from './client.js';
import errorHandler from './errorHandler.js';

/**
 * Request Handler
 * Abstracts common API request patterns
 */
const requestHandler = {
  /**
   * Make a GET request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options (params, etc.)
   * @returns {Promise<Object>} Standardized response
   */
  async get(url, options = {}) {
    try {
      const response = await apiClient.get(url, options);
      return {
        success: true,
        data: response.data.data || response.data,
        meta: this.extractMeta(response.data),
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Make a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Standardized response
   */
  async post(url, data = {}, options = {}) {
    try {
      const response = await apiClient.post(url, data, options);
      return {
        success: true,
        data: response.data.data || response.data,
        meta: this.extractMeta(response.data),
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Make a PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Standardized response
   */
  async put(url, data = {}, options = {}) {
    try {
      const response = await apiClient.put(url, data, options);
      return {
        success: true,
        data: response.data.data || response.data,
        meta: this.extractMeta(response.data),
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Make a PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Standardized response
   */
  async patch(url, data = {}, options = {}) {
    try {
      const response = await apiClient.patch(url, data, options);
      return {
        success: true,
        data: response.data.data || response.data,
        meta: this.extractMeta(response.data),
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Make a DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Standardized response
   */
  async delete(url, options = {}) {
    try {
      const response = await apiClient.delete(url, options);
      return {
        success: true,
        data: response.data.data || response.data,
        meta: this.extractMeta(response.data),
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Extract metadata from response
   * @param {Object} responseData - Response data
   * @returns {Object} Metadata
   */
  extractMeta(responseData) {
    const meta = {};

    if (responseData.total) {
      meta.total = responseData.total;
    }
    if (responseData.page) {
      meta.page = responseData.page;
    }
    if (responseData.limit) {
      meta.limit = responseData.limit;
    }
    if (responseData.pages) {
      meta.pages = responseData.pages;
    }
    if (responseData.count) {
      meta.count = responseData.count;
    }
    if (responseData.hasMore !== undefined) {
      meta.hasMore = responseData.hasMore;
    }

    return Object.keys(meta).length > 0 ? meta : null;
  },

  /**
   * Handle error and return standardized error response
   * @param {Error} error - Error object
   * @returns {Object} Standardized error response
   */
  handleError(error) {
    const errorResponse = errorHandler.handleError(error);
    return {
      success: false,
      ...errorResponse,
      data: null,
    };
  },

  /**
   * Retry failed request with exponential backoff
   * @param {Function} requestFn - Function that makes the request
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Initial delay in milliseconds
   * @returns {Promise<Object>} Response or error
   */
  async retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry on 4xx errors (client errors)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }

        // Calculate exponential backoff delay
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  },

  /**
   * Batch multiple requests
   * @param {Array<Function>} requests - Array of request functions
   * @returns {Promise<Array>} Array of responses
   */
  async batch(requests) {
    try {
      const results = await Promise.all(requests.map((req) => req()));
      return {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  },

  /**
   * Batch multiple requests with partial failure tolerance
   * @param {Array<Function>} requests - Array of request functions
   * @returns {Promise<Object>} Batch response with successes and failures
   */
  async batchWithTolerance(requests) {
    const results = await Promise.allSettled(requests.map((req) => req()));

    const successes = [];
    const failures = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successes.push(result.value);
      } else {
        failures.push({
          index,
          error: result.reason,
        });
      }
    });

    return {
      success: failures.length === 0,
      data: successes,
      failures,
      timestamp: new Date().toISOString(),
    };
  },
};

export default requestHandler;
