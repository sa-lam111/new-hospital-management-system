import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import errorHandler from '../api/errorHandler';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export default function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });
  const navigate = useNavigate();
  const { login, loading, error: authError, user } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('patient');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      handleRoleBasedRedirect(user.userType);
    }
  }, [user]);

  /**
   * Handle role-based redirection
   */
  const handleRoleBasedRedirect = (userType) => {
    switch (userType) {
      case 'admin':
        navigate('/admin-dashboard', { replace: true });
        break;
      case 'doctor':
        navigate('/doctor-dashboard', { replace: true });
        break;
      case 'patient':
      default:
        navigate('/patient', { replace: true });
    }
  };

  const onSubmit = async (data) => {
    setLoginError('');
    setNeedsVerification(false);
    
    try {
      const response = await login(data.email, data.password, userType);
      
      if (response.success && response.data?.user) {
        // Get user role from stored user data
        const userType = response.data.user.userType || 'patient';
        
        // Token is already stored by authService.login() and authTokenManager
        handleRoleBasedRedirect(userType);
      }
    } catch (err) {
      // Check if email verification is needed
      const errorMsg = err.message || err?.response?.data?.message || 'Login failed';
      
      if (errorMsg.toLowerCase().includes('verify') || errorMsg.toLowerCase().includes('verification')) {
        setNeedsVerification(true);
        setVerificationEmail(data.email);
      }
      
      setLoginError(errorMsg);
      errorHandler.logError('Login', err, { email: data.email, userType });
    }
  };

  const handleDemoLogin = async (demoType) => {
    // Demo credentials for testing
    const demoCredentials = {
      patient: { email: 'patient@demo.com', password: 'password123' },
      doctor: { email: 'doctor@demo.com', password: 'password123' },
      admin: { email: 'admin@demo.com', password: 'password123' },
    };

    const credentials = demoCredentials[demoType];
    if (credentials) {
      reset(credentials);
      setUserType(demoType);
      // Trigger form submission after a small delay to ensure form state updates
      setTimeout(() => {
        document.querySelector('form')?.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full text-white mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital System</h1>
          <p className="text-gray-600 mt-2">Professional Healthcare Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
          <p className="text-sm text-gray-600 -mt-3">
            Access your dashboard, appointments, and health records securely.
          </p>
          
          {/* Email Verification Alert */}
          {needsVerification && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Email verification required
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please verify your email first. Check your inbox for the verification link.
                  </p>
                  <Link 
                    to={`/verify-email?email=${encodeURIComponent(verificationEmail)}`}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-500 mt-2 inline-block"
                  >
                    Go to verification →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(loginError || authError) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {loginError || authError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                Login As
              </label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                {...register("email")}
                id="email"
                type="email" 
                autoComplete="username"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input 
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <span className="text-gray-400">Password reset coming soon</span>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Login Section */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient')}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Patient Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Doctor Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="border-t pt-6 text-center">
            <p className="text-gray-600">
              Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Safe & Secure. Your data is encrypted and protected.
        </p>
      </div>
    </div>
  );
}