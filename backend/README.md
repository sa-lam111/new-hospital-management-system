# Hospital Management System - Backend Setup & Documentation

## 📋 Overview

This is a professional-grade Node.js/Express backend for a hospital management system with patient authentication, appointment booking, and doctor management features.

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-db
JWT_SECRET=your_very_secure_random_string_min_32_chars
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5174
```

### 3. Set Up Gmail for Emails
1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste into `EMAIL_PASS` in `.env`

### 4. Start the Server
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

Expected output:
```
✅ MongoDB connected: cluster001.ononacn.mongodb.net
🚀 Server running on port 5000 in development mode
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "dbStatus": "connected"
}
```

---

## 🔐 Authentication Routes

### 1. Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123",
  "userType": "patient"
}
```

Response:
```json
{
  "success": true,
  "message": "Signup successful! Please check your email to verify your account.",
  "user": {
    "id": "65f7c...",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "patient"
  }
}
```

### 2. Verify Email
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

### 3. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "userType": "patient"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65f7c...",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "patient"
  }
}
```

### 4. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### 5. Update Profile
```
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890"
}
```

### 6. Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### 7. Resend Verification Email
```
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

## 👨‍⚕️ Doctor Routes

### 1. Get All Doctors
```
GET /api/doctors
```

Response:
```json
{
  "success": true,
  "count": 5,
  "doctors": [
    {
      "_id": "65f7c...",
      "name": "Dr. Smith",
      "email": "smith@hospital.com",
      "specialization": "Cardiology",
      "experience": 10,
      "consultationFee": 100,
      "hospital": "Main Hospital"
    }
  ]
}
```

### 2. Get Doctor by ID
```
GET /api/doctors/:id
```

### 3. Get Doctors by Specialization
```
GET /api/doctors/specialization/Cardiology
```

### 4. Get Available Doctors
```
GET /api/doctors/available/true
```

---

## 📅 Appointment Routes

### 1. Book Appointment
```
POST /api/appointments/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor": "Dr. Smith",
  "specialization": "Cardiology",
  "date": "2024-03-20",
  "time": "14:30",
  "reason": "Regular checkup",
  "message": "Optional notes"
}
```

Response:
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "65f7c...",
    "doctor": "Dr. Smith",
    "date": "2024-03-20",
    "time": "14:30",
    "status": "pending"
  }
}
```

### 2. Get User's Appointments
```
GET /api/appointments
Authorization: Bearer <token>

# With status filter:
GET /api/appointments?status=pending
```

Response:
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    {
      "_id": "65f7c...",
      "doctor": "Dr. Smith",
      "date": "2024-03-20",
      "time": "14:30",
      "reason": "Regular checkup",
      "status": "pending"
    }
  ]
}
```

### 3. Get Single Appointment
```
GET /api/appointments/:id
Authorization: Bearer <token>
```

### 4. Update Appointment (Doctor)
```
PUT /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Please arrive 15 minutes early"
}
```

Status values: `pending`, `approved`, `completed`, `cancelled`

### 5. Cancel Appointment
```
DELETE /api/appointments/:id
Authorization: Bearer <token>
```

---

## 🛡️ Security Features

- ✅ **Password Hashing**: bcryptjs (10 salt rounds)
- ✅ **JWT Authentication**: 7-day expiration by default
- ✅ **Rate Limiting**: 100 requests per 15 minutes
- ✅ **CORS Protection**: Configured for frontend origin
- ✅ **Helmet.js**: HTTP headers security
- ✅ **Input Validation**: Email, phone, dates, times
- ✅ **XSS Protection**: Input sanitization
- ✅ **MongoDB Injection Protection**: Mongoose schema validation

---

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  userType: 'patient' | 'doctor',
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  createdAt: Date
}
```

### Doctor Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  specialization: String,
  experience: Number,
  consultationFee: Number,
  hospital: String,
  availableDays: [String],
  bio: String,
  image: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId (ref: User),
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctor: String,
  specialization: String,
  date: String,
  time: String,
  reason: String,
  message: String,
  status: 'pending' | 'approved' | 'completed' | 'cancelled',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Validation Rules

### Email
- Must be valid email format
- Must be unique in database

### Phone
- Supports international formats
- Example: +1234567890, (123) 456-7890

### Password
- Minimum 6 characters
- Hashed with bcryptjs before storage

### Appointments
- Date must be in the future
- Time format: HH:MM (24-hour)
- Doctor must exist and be active
- Duplicate bookings are prevented

### Specializations
Cardiology, Neurology, Orthopedics, Gynecology, Dermatology, Pediatrics, General Practice, Psychiatry, Oncology, Urology, ENT, Ophthalmology

---

## 🚨 Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (access denied)
- **404**: Not Found (resource not found)
- **500**: Server Error

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment mode |
| MONGODB_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | Secret key for JWT (min 32 chars) |
| JWT_EXPIRE | No | 7d | JWT expiration time |
| EMAIL_SERVICE | Yes | gmail | Email service provider |
| EMAIL_USER | Yes | - | Email account |
| EMAIL_PASS | Yes | - | Email app password |
| EMAIL_FROM | No | noreply@hospital.com | Sender email |
| FRONTEND_URL | No | http://localhost:5174 | Frontend URL |
| RATE_LIMIT_WINDOW_MS | No | 900000 | Rate limit window in ms |
| RATE_LIMIT_MAX_REQUESTS | No | 100 | Max requests per window |

---

## 📦 Dependencies

- **express** (4.18.2): Web framework
- **mongoose** (7.5.0): MongoDB ODM
- **jsonwebtoken** (9.0.2): JWT authentication
- **bcryptjs** (2.4.3): Password hashing
- **nodemailer** (6.9.6): Email sending
- **validator** (13.11.0): Input validation
- **helmet** (7.0.0): Security headers
- **express-rate-limit** (7.0.0): Rate limiting
- **morgan** (1.10.0): HTTP logging
- **cors** (2.8.5): CORS handling
- **dotenv** (16.3.1): Environment variables

---

## 🧪 Testing the API

### Using cURL
```bash
# Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+1234567890","password":"pass123","confirmPassword":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### Using Postman
1. Set base URL: `http://localhost:5000/api`
2. Create requests in JSON format
3. Add `Authorization: Bearer <token>` header for protected routes

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI in .env
- Ensure MongoDB is running (local) or network access is allowed (Atlas)
- Verify credentials

### Email Not Sending
- Verify Gmail app password (16 chars, no spaces in .env)
- Enable "Less secure app access" if using regular password
- Check EMAIL_USER and EMAIL_PASS

### Token Errors
- Ensure JWT_SECRET is at least 32 characters
- Token expires after JWT_EXPIRE duration
- Include "Bearer " prefix in Authorization header

### Rate Limit Exceeded
- Wait 15 minutes or adjust RATE_LIMIT_WINDOW_MS
- Increase RATE_LIMIT_MAX_REQUESTS if needed

---

## 📞 API Integration Example

```javascript
// Frontend example (axios)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', {
    email,
    password,
    userType: 'patient'
  });
  localStorage.setItem('token', data.token);
  return data;
};

// Book appointment
const bookAppointment = async (appointmentData) => {
  const { data } = await api.post('/appointments/book', appointmentData);
  return data;
};
```

---

## 🔧 Development Tips

- Use `npm run dev` for auto-reload during development
- Check browser console and server logs for errors
- Use Postman or cURL to test endpoints
- Verify token expiration with debugged JWT (jwt.io)
- Monitor MongoDB Atlas for collection indexes

---

## 📄 License

This project is part of the Hospital Management System. All rights reserved.

---

## 🤝 Contributing

For bug reports or feature requests, please contact the development team.

Last Updated: March 7, 2026
