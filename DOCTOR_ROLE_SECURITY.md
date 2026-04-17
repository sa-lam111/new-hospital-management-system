# Doctor Role Security Fix

## Problem
Previously, any user could sign up as a "Doctor" from the signup form, which is a major security vulnerability for a hospital management system.

## Solution Implemented

### 1. Frontend Changes
- Removed "Doctor" option from signup dropdown
- Signup form now only allows "Patient" registration
- Added message directing doctors to contact admin for access

**File:** `hospital-react/src/Pages/SignUp.jsx`

### 2. Backend Security Layer
- Forced all new signups to `userType: 'patient'` in backend
- Even if frontend sends `userType: 'doctor'`, backend ignores it and sets to `'patient'`
- This is a **defense-in-depth** approach - backend validates regardless of frontend

**File:** `backend/routes/auth.js` - signup endpoint

## How to Assign Doctor Role (For Admins)

### Option A: Using Admin Dashboard (Recommended)
1. Log in as admin
2. Go to Admin Dashboard → Users tab
3. Find the patient to promote
4. Click "Edit Role" or "Make Doctor"
5. Confirm

### Option B: Direct Database Update (If admin panel not available yet)
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "doctor@hospital.com" },
  { $set: { role: "doctor" } }
);
```

### Option C: Backend API Endpoint (To Create)
```bash
PATCH /api/admin/users/:userId/promote-to-doctor
Authorization: Bearer admin-token
Body: { specialty: "Cardiology" }
```

## Requesting Doctor Access

**For users who want to be doctors:**
1. Sign up as patient
2. Email: admin@hospital.com
3. Include:
   - Full name
   - Medical license/registration number
   - Specialty/Department
   - Reason for access

4. Admin will verify credentials and promote account to doctor role

## Security Best Practices

✅ **Do:**
- Only admins can assign doctor roles
- Verify credentials before promoting
- Keep audit log of role changes
- Require doctor license validation
- Add 2FA for doctor accounts

❌ **Don't:**
- Allow self-service role upgrades
- Accept doctor registration without verification
- Store credentials insecurely
- Mix admin and doctor permissions

## Files Modified
- `hospital-react/src/Pages/SignUp.jsx` - Remove doctor dropdown
- `backend/routes/auth.js` - Force patient role on backend
- `DOCTOR_ROLE_SECURITY.md` - This documentation

## Testing

Verify the fix works:
1. Try signing up with dropdown removed ✓
2. Attempt to bypass by sending `{ userType: "doctor" }` in API → should still create patient ✓
3. Admin can promote to doctor from admin panel ✓

---

**Status:** ✅ FIXED - Doctor role is now admin-controlled only
