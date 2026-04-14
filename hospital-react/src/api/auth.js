/**
 * Authentication Utility Module
 * Provides JWT token management and validation
 */

import config from './config.js';

/**
 * JWT Token Manager
 * Handles all JWT token operations including storage, retrieval, and validation
 */
const authTokenManager = {
  /**
   * Store authentication tokens in localStorage
   * @param {string} token - Access token
   * @param {string|null} refreshToken - Refresh token
   * @param {Object|null} user - User data
   */
  setTokens(token, refreshToken = null, user = null) {
    if (token) {
      localStorage.setItem(config.storage.token, token);
    }
    if (refreshToken) {
      localStorage.setItem(config.storage.refreshToken, refreshToken);
    }
    if (user) {
      localStorage.setItem(config.storage.user, JSON.stringify(user));
    }
  },

  /**
   * Get access token from storage
   * @returns {string|null}
   */
  getAccessToken() {
    return localStorage.getItem(config.storage.token);
  },

  /**
   * Get refresh token from storage
   * @returns {string|null}
   */
  getRefreshToken() {
    return localStorage.getItem(config.storage.refreshToken);
  },

  /**
   * Get user data from storage
   * @returns {Object|null}
   */
  getUser() {
    const user = localStorage.getItem(config.storage.user);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Update stored user data
   * @param {Object} userData - Updated user data
   */
  updateUser(userData) {
    if (userData) {
      localStorage.setItem(config.storage.user, JSON.stringify(userData));
    }
  },

  /**
   * Clear all authentication data
   */
  clearTokens() {
    localStorage.removeItem(config.storage.token);
    localStorage.removeItem(config.storage.refreshToken);
    localStorage.removeItem(config.storage.user);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  /**
   * Get Authorization header value
   * @returns {string|null}
   */
  getAuthorizationHeader() {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  },

  /**
   * Decode JWT token (basic decoding without verification)
   * Note: For security-critical operations, verify token on backend
   * @param {string} token - JWT token to decode
   * @returns {Object|null}
   */
  decodeToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (second part)
      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );

      return decoded;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // Check if token expires within next 5 minutes
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    return expirationTime - currentTime < bufferTime;
  },

  /**
   * Get time until token expiration (in seconds)
   * @param {string} token - JWT token
   * @returns {number|null}
   */
  getTokenExpiresIn(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return Math.max(0, (expirationTime - currentTime) / 1000);
  },

  /**
   * Get user role from token
   * @returns {string|null}
   */
  getUserRole() {
    const user = this.getUser();
    return user?.userType || null;
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    return this.getUserRole() === role;
  },

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles
   * @returns {boolean}
   */
  hasAnyRole(roles) {
    return roles.includes(this.getUserRole());
  },
};

export default authTokenManager;
