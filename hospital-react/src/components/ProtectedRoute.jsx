import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authTokenManager from '../api/auth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // User not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated but lacks required role
  if (requiredRole && user.userType !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboards = {
      admin: '/admin-dashboard',
      doctor: '/doctor-dashboard',
      patient: '/patient',
    };

    const targetDashboard = dashboards[user.userType] || '/login';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
