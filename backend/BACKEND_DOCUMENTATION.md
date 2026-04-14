# Hospital Management System - Backend MVP Documentation

## Overview
This is a complete **Hospital Management System MVP** built with **Node.js, Express, MongoDB & Mongoose** following **MVC architecture**.

## 📚 Project Structure

```
backend/
├── models/                  # Database schemas
│   ├── User.js             # User model (Admin, Doctor, Patient)
│   ├── Patient.js          # Patient profile model (NEW)
│   ├── Doctor.js           # Doctor profile model
│   ├── Appointment.js      # Appointment bookings (ENHANCED)
│   └── MedicalRecord.js    # Patient medical history (NEW)
├── controllers/            # Business logic (NEW DIRECTORY)
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   └── adminController.js
├── routes/                 # API endpoints
│   ├── auth.js
│   ├── patients.js         # Patient CRUD + medical history
│   ├── doctors.js          # Doctor management & availability
│   ├── appointments.js     # Appointment booking & management
│   └── admin.js            # Admin dashboard & reports
├── middleware/
│   └── auth.js             # JWT authentication & authorization
├── utils/
│   ├── errorHandler.js     # Error handling
│   └── validators.js       # Input validation
├── config/
│   └── email.js            # Email configuration
├── server.js               # Express app setup
└── .env.example            # Environment variables template
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features, user management, reports
- **Doctor**: View appointments, add medical notes, manage schedule
- **Patient**: Book appointments, view medical records, manage profile

### JWT Implementation
- Token issued on login/signup
- Token attached to Authorization header
- Middleware validates token and enforces role-based access control

## 📋 API Endpoints Overview

### 1. **Authentication** (`/api/auth`)
```
POST /api/auth/signup              # Register new user
POST /api/auth/login               # User login
POST /api/auth/verify-email        # Verify email
POST /api/auth/resend-verification # Resend verification email
GET  /api/auth/me                  # Get current user profile
PUT  /api/auth/update-profile      # Update profile
PUT  /api/auth/change-password     # Change password
```

### 2. **Patients** (`/api/patients`)
```
GET    /api/patients                              # Get all patients (Admin)
GET    /api/patients/stats/overview               # Patient statistics
GET    /api/patients/profile/me                   # Get my profile
GET    /api/patients/:id                          # Get single patient
POST   /api/patients                              # Create patient (Admin)
PUT    /api/patients/:id                          # Update patient profile
DELETE /api/patients/:id                          # Delete patient (Admin)
POST   /api/patients/:id/medical-history          # Add medical history
```

### 3. **Doctors** (`/api/doctors`)
```
GET    /api/doctors                               # Get all active doctors
GET    /api/doctors/stats/overview                # Doctor statistics (Admin)
GET    /api/doctors/specialization/:specialization # Get doctors by specialty
GET    /api/doctors/profile/me                    # Get my doctor profile
GET    /api/doctors/:id                           # Get doctor details
GET    /api/doctors/:id/availability/:date        # Check availability
GET    /api/doctors/:id/appointments              # Get doctor's appointments
POST   /api/doctors                               # Create doctor profile (Admin)
PUT    /api/doctors/:id                           # Update doctor profile
```

### 4. **Appointments** (`/api/appointments`)
```
GET    /api/appointments                          # Get all appointments (Admin)
GET    /api/appointments/stats/overview           # Appointment statistics
GET    /api/appointments/patient/:patientId       # Get patient's appointments
GET    /api/appointments/doctor/:doctorId         # Get doctor's appointments
GET    /api/appointments/:id                      # Get single appointment
POST   /api/appointments/book                     # Book appointment
PUT    /api/appointments/:id/status               # Update appointment (Doctor/Admin)
POST   /api/appointments/:id/medical-notes        # Add medical notes (Doctor)
PUT    /api/appointments/:id/reschedule           # Reschedule appointment
PUT    /api/appointments/:id/cancel               # Cancel appointment
```

### 5. **Admin Dashboard** (`/api/admin`)
```
GET /api/admin/dashboard                          # Dashboard statistics
GET /api/admin/users                              # Get all users
GET /api/admin/patients                           # Get all patients
GET /api/admin/doctors                            # Get all doctors
GET /api/admin/appointments                       # Get all appointments
GET /api/admin/patients/:patientId/medical-records # Patient medical records
DELETE /api/admin/users/:id                       # Delete user
GET /api/admin/reports/:type                      # Generate reports
```

## 🗂️ Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  userType: 'patient' | 'doctor' | 'admin',
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  createdAt: Date
}
```

### Patient Model (NEW)
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  email: String (unique),
  phone: String,
  age: Number,
  gender: 'Male' | 'Female' | 'Other',
  bloodType: String,
  allergies: [String],
  medicalHistory: [String],
  address: {
    street, city, state, postalCode, country
  },
  emergencyContact: {
    name, phone, relationship
  },
  patientId: String (unique - auto-generated),
  status: 'Active' | 'Inactive',
  createdAt: Date
}
```

### Doctor Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  email: String (unique),
  phone: String,
  licenseNumber: String (unique),
  specialization: String,
  qualifications: [String],
  experience: Number,
  consultationFee: Number,
  bio: String,
  availability: {
    monday: {start, end},
    tuesday: {start, end},
    ...
  },
  status: 'Active' | 'Inactive',
  totalPatients: Number,
  totalAppointments: Number,
  completedAppointments: Number,
  createdAt: Date
}
```

### Appointment Model (ENHANCED)
```javascript
{
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctorName: String,
  specialization: String,
  date: String (YYYY-MM-DD),
  time: String (HH:MM),
  reason: String,
  message: String,
  status: 'pending' | 'approved' | 'completed' | 'cancelled',
  diagnosis: String,
  prescription: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MedicalRecord Model (NEW)
```javascript
{
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  appointmentId: ObjectId (ref: Appointment),
  visitDate: String,
  diagnosis: String,
  prescription: String,
  notes: String,
  symptoms: [String],
  tests: [String],
  medications: [String],
  followUp: {
    required: Boolean,
    date: String,
    notes: String
  },
  createdAt: Date
}
```

## 🚀 Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Ensure MongoDB is running
# Local: mongod
# Or use MongoDB Atlas connection string
```

### 4. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## ✅ Key Features Implemented

### 1. **Complete Authentication System**
- JWT-based login/signup
- Email verification
- Password hashing with bcryptjs
- Role-based access control

### 2. **Patient Management**
- Create/update patient profiles
- Auto-generated unique Patient ID
- Comprehensive medical history tracking
- Emergency contact information
- Blood type and allergy tracking

### 3. **Doctor Management**
- Doctor profiles with specialization
- Availability calendar
- Slot management
- Professional qualifications tracking
- Statistics (patients, appointments, completions)

### 4. **Appointment System**
- Book appointments with validation
- Check doctor availability
- Different statuses (pending, approved, completed, cancelled)
- Medical notes after appointment
- Reschedule functionality
- Appointment history

### 5. **Medical Records**
- Store visit history per patient
- Link to appointments and doctors
- Diagnosis, prescription, notes
- Follow-up tracking
- Test and medication records

### 6. **Admin Dashboard**
- Complete statistics overview
- User management
- View all patients, doctors, appointments
- Generate reports
- Medical record access

## 📊 Query Examples

### Book an Appointment
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "date": "2024-12-20",
    "time": "14:00",
    "reason": "Regular checkup"
  }'
```

### Get Doctor Availability
```bash
curl http://localhost:5000/api/doctors/doctor_id/availability/2024-12-20
```

### Add Medical Notes
```bash
curl -X POST http://localhost:5000/api/appointments/appointment_id/medical-notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis": "Common cold",
    "prescription": "Rest, fluids, antihistamine",
    "notes": "Patient advised to rest for 2-3 days"
  }'
```

## 🔒 Security Features

- **Helmet.js**: HTTP headers security
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Prevent brute force attacks
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Token**: Secure authentication
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Centralized error management

## 📝 Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## 🎯 Testing the API

Use Postman or similar tool with the provided `.env` configuration to test all endpoints.

## 🚀 Next Steps for Frontend Integration

1. Create patient dashboard with appointment booking
2. Create doctor dashboard with medical notes interface
3. Create admin panel with statistics
4. Implement real-time notifications (WebSocket)
5. Add file upload for medical documents

## 📞 Support

For issues or questions, refer to the API documentation or contact the development team.

---

**Status**: MVP Complete ✅
**Version**: 1.0.0
**Last Updated**: 2024
