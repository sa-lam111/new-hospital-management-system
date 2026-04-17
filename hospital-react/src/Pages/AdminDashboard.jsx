import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../api/services/index.js';
import errorHandler from '../api/errorHandler';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Admin user info
  const admin = {
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@hospital.com',
    role: 'System Administrator',
    memberSince: user?.createdAt || '2026-01-01',
    profilePicture: user?.profilePicture || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
  };

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'overview') {
        const stats = await adminService.getDashboardStats();
        if (stats.success) {
          setDashboardStats(stats.data);
        }
      } else if (activeTab === 'users') {
        const usersData = await adminService.getAllUsers();
        if (usersData.success) {
          setUsers(usersData.data || []);
        }
      } else if (activeTab === 'patients') {
        const patientsData = await adminService.getAllPatients();
        if (patientsData.success) {
          setPatients(patientsData.data || []);
        }
      } else if (activeTab === 'doctors') {
        const doctorsData = await adminService.getAllDoctors();
        if (doctorsData.success) {
          setDoctors(doctorsData.data || []);
        }
      } else if (activeTab === 'appointments') {
        const appointmentsData = await adminService.getAllAppointments();
        if (appointmentsData.success) {
          setAppointments(appointmentsData.data || []);
        }
      }
    } catch (err) {
      const errorMsg = errorHandler.getUserMessage(err);
      setError(errorMsg);
      errorHandler.logError('fetchDashboardData', err, { activeTab });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await adminService.deleteUser(userId);
        if (result.success) {
          // Refresh users list
          const usersData = await adminService.getAllUsers();
          if (usersData.success) {
            setUsers(usersData.data || []);
          }
        }
      } catch (err) {
        errorHandler.logError('handleDeleteUser', err);
      }
    }
  };

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {admin.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.role}</p>
              </div>
              <img
                src={admin.profilePicture}
                alt={admin.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'patients', label: 'Patients', icon: '🏥' },
            { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
            { id: 'appointments', label: 'Appointments', icon: '📅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardStats && (
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Patients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.totalPatients || 0}
                    </p>
                  </div>
                  <div className="text-4xl">🏥</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.totalDoctors || 0}
                    </p>
                  </div>
                  <div className="text-4xl">👨‍⚕️</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.totalAppointments || 0}
                    </p>
                  </div>
                  <div className="text-4xl">📅</div>
                </div>
              </motion.div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-semibold">{dashboardStats?.appointmentsPending || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmed</span>
                    <span className="font-semibold">{dashboardStats?.appointmentsConfirmed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold">{dashboardStats?.appointmentsCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-semibold">{dashboardStats?.appointmentsCancelled || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Specializations</h3>
                <div className="space-y-2">
                  {dashboardStats?.topSpecializations?.slice(0, 4).map((spec, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-600">{spec.specialization}</span>
                      <span className="font-semibold">{spec.count} doctors</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        u.userType === 'admin' ? 'bg-red-100 text-red-800' :
                        u.userType === 'doctor' ? 'bg-blue-100 text-blue-800' :
                        'bg-blue-100 text-indigo-800'
                      }`}>
                        {u.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${u.isEmailVerified ? 'text-indigo-600' : 'text-yellow-600'}`}>
                        {u.isEmailVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-600">No users found</div>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.bloodType || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="text-center py-8 text-gray-600">No patients found</div>
            )}
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{d.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{d.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{d.licenseNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {d.yearsOfExperience || 0} years
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && (
              <div className="text-center py-8 text-gray-600">No doctors found</div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {a.patientId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {a.doctorId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(a.date).toLocaleDateString()} {a.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        a.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        a.status === 'completed' ? 'bg-blue-100 text-indigo-800' :
                        a.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-600">No appointments found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
