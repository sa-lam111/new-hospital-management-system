/**
 * Billing Service
 * Handles all billing and payment-related API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

class BillingService {
  /**
   * Get all bills with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getBills(params = {}) {
    try {
      const response = await apiClient.get(config.endpoints.billing.list, {
        params,
      });
      return {
        success: true,
        data: response.data.bills || response.data,
        total: response.data.total,
        message: 'Bills retrieved successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get a specific bill by ID
   * @param {string} id - Bill ID
   * @returns {Promise}
   */
  async getBillById(id) {
    try {
      const url = config.endpoints.billing.getById.replace(':id', id);
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Bill retrieved successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Process payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise}
   */
  async processPayment(paymentData) {
    try {
      const response = await apiClient.post(config.endpoints.billing.payment, paymentData);
      return {
        success: true,
        data: response.data,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get payment history
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getPaymentHistory(params = {}) {
    try {
      const response = await apiClient.get(config.endpoints.billing.paymentHistory, {
        params,
      });
      return {
        success: true,
        data: response.data.payments || response.data,
        total: response.data.total,
        message: 'Payment history retrieved successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get bill summary (total amount due, paid, etc.)
   * @returns {Promise}
   */
  async getBillSummary() {
    try {
      const response = await apiClient.get(`${config.endpoints.billing.list}/summary`);
      return {
        success: true,
        data: response.data,
        message: 'Bill summary retrieved successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Handle API errors
   * @private
   */
  _handleError(error) {
    const errorResponse = {
      success: false,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'An error occurred',
      data: error.response?.data,
    };

    return errorResponse;
  }
}

export default new BillingService();
