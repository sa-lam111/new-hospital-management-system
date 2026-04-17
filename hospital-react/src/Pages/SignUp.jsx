import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signup, loading, error: authError } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',     
    confirmPassword: '',
    userType: 'patient'
  });
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!form.email || !form.password || !form.name || !form.phone) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      await signup(form.name, form.email, form.phone, form.password, form.confirmPassword, form.userType);
      setSignupEmail(form.email);
      setSubmitted(true);
    } catch (err) {
      setLocalError(err.message || 'Signup failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-gray-100">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Account Created Successfully</h2>
          <p className="text-gray-700 mb-4">
            Welcome, {form.name}. A verification email has been sent to <strong>{signupEmail}</strong>.
          </p>
          <p className="text-gray-600 mb-6">
            Please check your email and click the verification link to activate your account. The link will expire in 24 hours.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or wait a few minutes.
            </p>
            <Link to="/login" className="inline-block text-blue-600 underline hover:text-blue-800">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Create Your Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Join our healthcare portal to manage appointments and access care faster.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Account Type</label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
              Patient
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Doctor registration requires hospital staff approval. Contact admin@hospital.com to request doctor access.
            </p>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Password (min 6 characters)"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Confirm password"
            />
          </div>

          {(localError || authError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2.5 px-4 rounded-lg font-semibold transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
} 