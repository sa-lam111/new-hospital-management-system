/**
 * useApi Hook
 * Custom hook for managing API calls with loading, error, and data states
 */

import { useState, useCallback } from 'react';
import { formatError, logError } from '../utils/errorHandler.js';

/**
 * useApi Hook
 * @param {Function} apiFunction - API function to call
 * @param {boolean} executeImmediately - Whether to execute on mount
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, executeImmediately = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeImmediately);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const formattedError = formatError(err);
        setError(formattedError);
        logError('useApi', err);
        throw formattedError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // Execute immediately if requested
  if (executeImmediately && !loading && !data && !error) {
    execute();
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: !!error,
  };
};

export default useApi;
