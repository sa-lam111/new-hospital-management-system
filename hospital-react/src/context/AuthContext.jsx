import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services/index.js';
import authTokenManager from '../api/auth.js';
import config from '../api/config.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(config.storage.user);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem(config.storage.token));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      if (token && !user) {
        try {
          const result = await authService.getProfile();
          if (result.success && result.data) {
            setUser(result.data.user || result.data);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          localStorage.removeItem(config.storage.token);
          setToken(null);
        }
      }
    };

    initializeUser();
  }, [token, user]);

  const signup = useCallback(async (name, email, phone, password, confirmPassword, userType = 'patient') => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signup({
        name,
        email,
        phone,
        password,
        confirmPassword,
        userType,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password, userType = 'patient') => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password, userType);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Store tokens using authTokenManager
      authTokenManager.setTokens(
        result.data.token,
        result.data.refreshToken,
        result.data.user
      );

      setToken(result.data.token);
      setUser(result.data.user);

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const result = await authService.getProfile();

      if (result.success && result.data) {
        setUser(result.data.user || result.data);
        return result;
      }

      throw new Error(result.message || 'Failed to fetch profile');
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.updateProfile(profileData);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Update stored user data
      if (result.data.user) {
        authTokenManager.updateUser(result.data.user);
      }

      setUser(result.data.user);

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.changePassword(currentPassword, newPassword);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear all tokens using authTokenManager
      authTokenManager.clearTokens();
      setUser(null);
      setToken(null);
      setError(null);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    // Additional helpers
    userRole: authTokenManager.getUserRole(),
    hasRole: (role) => authTokenManager.hasRole(role),
    hasAnyRole: (roles) => authTokenManager.hasAnyRole(roles),
    isTokenExpired: () => authTokenManager.isTokenExpired(token),
    getTokenExpiresIn: () => authTokenManager.getTokenExpiresIn(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
