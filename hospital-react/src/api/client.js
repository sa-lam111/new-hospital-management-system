/**
 * Axios API Client
 * Configured with interceptors for request/response handling and error management
 */

import axios from 'axios';
import config from './config.js';
import errorHandler from './errorHandler.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: config.api.headers,
  withCredentials: true,
});

/**
 * Request Interceptor
 * Add authentication token to all requests
 */
apiClient.interceptors.request.use(
  (requestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem(config.storage.token);

    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for logging
    requestConfig.metadata = { startTime: Date.now() };

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${requestConfig.method.toUpperCase()} ${requestConfig.url}`);
    }

    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle successful responses and refresh token on 401
 */
apiClient.interceptors.response.use(
  (response) => {
    // Add response time to headers
    if (response.config.metadata) {
      response.duration = Date.now() - response.config.metadata.startTime;
    }

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url} (${response.duration}ms)`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(config.storage.refreshToken);

        if (refreshToken) {
          const response = await axios.post(
            `${config.api.baseURL}${config.endpoints.auth.refreshToken}`,
            { refreshToken }
          );

          if (response.data.token) {
            // Store new token
            localStorage.setItem(config.storage.token, response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

            // Retry original request
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(config.storage.token);
        localStorage.removeItem(config.storage.refreshToken);
        localStorage.removeItem(config.storage.user);

        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error] Token refresh failed, redirecting to login');
        }

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access Forbidden:', error.response.data);
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[API Error] ${error.response?.status || 'Network'} ${error.config?.url}`,
        error.response?.data || error.message
      );
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        originalError: error,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
