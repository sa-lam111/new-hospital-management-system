/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

const config = {
  // API Base Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Hospital Management System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  },

  // Storage Keys
  storage: {
    token: 'hospital_auth_token',
    user: 'hospital_user_data',
    refreshToken: 'hospital_refresh_token',
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // API Endpoints
  endpoints: {
    // Authentication
    auth: {
      signup: '/auth/signup',
      login: '/auth/login',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh',
      profile: '/auth/me',
      updateProfile: '/auth/update-profile',
      changePassword: '/auth/change-password',
    },

    // Patients
    patients: {
      list: '/patients',
      create: '/patients',
      getById: '/patients/:id',
      getMe: '/patients/profile/me',
      update: '/patients/:id',
      delete: '/patients/:id',
      addMedicalHistory: '/patients/:id/medical-history',
      stats: '/patients/stats/overview',
    },

    // Doctors
    doctors: {
      list: '/doctors',
      getById: '/doctors/:id',
      getMe: '/doctors/profile/me',
      getBySpecialization: '/doctors/specialization/:specialization',
      getAppointments: '/doctors/:id/appointments',
      getAvailability: '/doctors/:id/availability/:date',
      create: '/doctors',
      update: '/doctors/:id',
      stats: '/doctors/stats/overview',
    },

    // Appointments
    appointments: {
      list: '/appointments',
      create: '/appointments/book',
      getById: '/appointments/:id',
      getPatientAppointments: '/appointments/patient/:patientId',
      getDoctorAppointments: '/appointments/doctor/:doctorId',
      updateStatus: '/appointments/:id/status',
      addMedicalNotes: '/appointments/:id/medical-notes',
      reschedule: '/appointments/:id/reschedule',
      cancel: '/appointments/:id/cancel',
      stats: '/appointments/stats/overview',
    },

    // Admin
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      deleteUser: '/admin/users/:id',
      patients: '/admin/patients',
      doctors: '/admin/doctors',
      appointments: '/admin/appointments',
      medicalRecords: '/admin/patients/:patientId/medical-records',
      reports: '/admin/reports/:type',
    },

    // Health Check
    health: '/health',
  },
};

export default config;
