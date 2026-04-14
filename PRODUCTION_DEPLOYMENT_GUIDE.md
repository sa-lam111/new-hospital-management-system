# 🚀 Production Deployment Guide - Hospital Management System

## 1️⃣ MongoDB Connection - Keep It Alive Forever

### ✅ Current Setup Issues
Your current MongoDB connection doesn't have connection pooling configured properly.

### ✅ Production-Ready MongoDB Configuration

Update your `backend/server.js` with proper connection pooling:

```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-db', {
      // Connection pooling
      maxPoolSize: 10,        // Max connections in the pool
      minPoolSize: 5,         // Min connections always open
      maxIdleTimeMS: 45000,   // Close idle connections after 45 seconds
      waitQueueTimeoutMS: 10000,
      
      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Reliability
      retryWrites: true,
      w: 'majority',
      
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};
```

### ✅ Connection Pooling Benefits
- **maxPoolSize: 10** → Up to 10 connections always ready
- **minPoolSize: 5** → Minimum 5 connections always available
- **Automatic reconnection** if connection fails
- **Connection reuse** for better performance
- **Timeout management** prevents zombie connections

---

## 2️⃣ Sign In / Sign Up - Flawless Authentication

### ✅ Current Authentication Flow

1. User signs up → Email validation needed
2. User logs in → JWT token created
3. Token stored in localStorage
4. Protected routes check token validity

### ✅ Enhance Auth - Add These Features

#### A. Email Confirmation (Backend - `backend/routes/auth.js`)

Already implemented! ✓ But make sure email config is set:

```env
# .env (NEVER COMMIT THIS!)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### B. Token Refresh Strategy (Add to AuthContext)

```javascript
// Create a function to refresh tokens before expiry
const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh', {});
    const newToken = response.data.token;
    localStorage.setItem('authToken', newToken);
    return newToken;
  } catch (error) {
    logout(); // Force logout if refresh fails
  }
};

// Set up token refresh interval (every 6 days if 7d expiry)
useEffect(() => {
  const interval = setInterval(refreshToken, 6 * 24 * 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

#### C. Better Error Handling (Signup/Login Forms)

Add these validations to your frontend Sign Up/Login pages:

```javascript
const validateSignup = (formData) => {
  const errors = {};
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Password strength
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(formData.password)) {
    errors.password = 'Password must contain uppercase letter';
  }
  if (!/[0-9]/.test(formData.password)) {
    errors.password = 'Password must contain number';
  }
  if (!/[!@#$%^&*]/.test(formData.password)) {
    errors.password = 'Password must contain special character (!@#$%^&*)';
  }
  
  // Phone validation
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }
  
  return errors;
};
```

---

## 3️⃣ Deployment Options

### Option A: Vercel (Recommended for Frontend)
- **Frontend**: Deploy to Vercel (free tier available)
- **Backend**: Deploy to Render, Railway, or Heroku

**Steps:**
```bash
# Frontend
cd hospital-react
npm run build
# Deploy to Vercel via GitHub

# Backend
# Create account on render.com or railway.app
# Connect GitHub repo
# Set environment variables in platform
```

### Option B: All-in-One - Railway or Render
- **Cost**: $5-10/month
- **Platform**: Single dashboard for frontend + backend
- **Database**: MongoDB Atlas (free tier: 512MB)

**Steps:**
1. Create account on `railway.app`
2. Connect your GitHub repo
3. Add environment variables
4. Railway auto-deploys on git push

### Option C: AWS / Google Cloud
- **Cost**: Pay-as-you-go
- **Best for**: High traffic, enterprise
- Requires more setup

---

## 4️⃣ Environment Variables for Production

### `.env` Template (Backend)

```env
# Server
NODE_ENV=production
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-db?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=your-super-secret-random-string-min-32-chars
JWT_EXPIRE=7d

# Email (Gmail with App Password)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://yourdomain.com
```

### Generate Strong Secrets

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example: 8f3a8c9b2e1d4c6a7f9e2a3b5c8d1e4f
# Use this as JWT_SECRET
```

---

## 5️⃣ Pre-Deployment Checklist

### Backend
- [ ] Add connection pooling to MongoDB (see section 1)
- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Enable CORS for your domain only
- [ ] Add request validation
- [ ] Test all API endpoints
- [ ] Set up monitoring/logging
- [ ] Add error tracking (Sentry)

### Frontend
- [ ] Update API URLs to production backend
- [ ] Add error boundaries
- [ ] Test authentication flow end-to-end
- [ ] Test on mobile devices
- [ ] Optimize images/bundle size
- [ ] Add analytics
- [ ] Test all forms (signup, login, booking)

### Security
- [ ] Rotate all secrets/passwords
- [ ] Remove console.logs from production code
- [ ] Implement HTTPS everywhere
- [ ] Use environment variables for sensitive data
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Test for SQL injection/XSS vulnerabilities

---

## 6️⃣ Testing Auth Flow Locally

```bash
# 1. Start backend
cd backend
npm start

# 2. Start frontend
cd hospital-react
npm run dev

# 3. Test signup
# Go to http://localhost:5174/signup
# Fill form and submit
# Check email for verification link

# 4. Test login
# Go to http://localhost:5174/login
# Use credentials from signup
# Should redirect to dashboard

# 5. Check token storage
# Open DevTools → Application → LocalStorage
# Look for 'authToken' key
```

---

## 7️⃣ Monitoring & Maintenance

### Add Health Check Endpoint ✓ (Already in your code!)

```bash
curl https://your-api.com/api/health

# Response:
{
  "success": true,
  "message": "Backend is running",
  "dbStatus": "connected"
}
```

### Set Up Error Tracking

Add Sentry for error monitoring:

```javascript
// backend/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Monitor Database Backups

- MongoDB Atlas: Enable automated backups (free tier: 2 backups)
- Set up alerts for connection failures
- Monitor database size

---

## 8️⃣ Troubleshooting Common Issues

### Issue: "MongoDB Connection Timeout"
**Solution**: Increase `serverSelectionTimeoutMS` to 10000

### Issue: "Email Not Sending"
**Solution**: 
- Check Gmail App Password (16 chars, not regular password)
- Enable "Less secure app access" OR use App Passwords
- Check email config is correct

### Issue: "CORS Errors"
**Solution**: 
- Update `FRONTEND_URL` in .env
- Match exact domain in CORS config

### Issue: "JWT Token Expired Immediately"
**Solution**:
- Check JWT_SECRET is set correctly
- Verify `JWT_EXPIRE` format: `7d`, `24h`, `1440m`

---

## ✅ Summary

1. **MongoDB**: Use connection pooling for stability
2. **Auth**: Test signup → email → login → token flow
3. **Deployment**: Use Railway/Render for easiest setup
4. **Security**: Rotate all credentials, never commit `.env`
5. **Monitoring**: Set up health checks and error tracking

**Next Steps:**
1. Set up MongoDB Atlas (free tier)
2. Generate production JWT secret
3. Get Gmail App Password
4. Deploy to Railway/Render
5. Test entire auth flow in production

---

**Need Help?**
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Railway Deploy: https://docs.railway.app
- JWT Best Practices: https://tools.ietf.org/html/rfc7519
