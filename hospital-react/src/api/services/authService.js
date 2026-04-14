/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '../client.js';
import config from '../config.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  async signup(userData) {
    try {
      const response = await apiClient.post(config.endpoints.auth.signup, userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise}
   */
  async login(email, password, userType = 'patient') {
    try {
      const response = await apiClient.post(config.endpoints.auth.login, {
        email,
        password,
        userType,
      });

      if (response.data.token) {
        localStorage.setItem(config.storage.token, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(config.storage.refreshToken, response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
        }
      }

      return {
        success: true,
        data: response.data,
        message: 'Login successful',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Logout user
   * @returns {Promise}
   */
  async logout() {
    try {
      // Call logout endpoint
      await apiClient.post(config.endpoints.auth.logout);

      // Clear local storage
      localStorage.removeItem(config.storage.token);
      localStorage.removeItem(config.storage.refreshToken);
      localStorage.removeItem(config.storage.user);

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      // Clear local storage even if request fails
      localStorage.removeItem(config.storage.token);
      localStorage.removeItem(config.storage.refreshToken);
      localStorage.removeItem(config.storage.user);
      throw this._handleError(error);
    }
  }

  /**
   * Get current user profile
   * @returns {Promise}
   */
  async getProfile() {
    try {
      const response = await apiClient.get(config.endpoints.auth.profile);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise}
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(config.endpoints.auth.updateProfile, profileData);
      
      if (response.data.user) {
        localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
      }

      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put(config.endpoints.auth.changePassword, {
        currentPassword,
        newPassword,
      });
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get stored user from localStorage
   * @returns {Object|null}
   */
  getStoredUser() {
    const user = localStorage.getItem(config.storage.user);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get authentication token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(config.storage.token);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
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

export default new AuthService();
