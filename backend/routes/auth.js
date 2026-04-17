import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../config/email.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  sanitizeEmail,
  isValidUserType
} from '../utils/validators.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route POST /api/auth/signup
// @desc Register a new user and send verification email
export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  
  // SECURITY: Force all new signups to be 'patient' role
  // Doctor role must be assigned by admin only
  const userType = 'patient';

  // Validation
  if (!name || !email || !phone || !password || !confirmPassword) {
    throw new AppError('Please provide all required fields', 400);
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  // Validate phone format
  if (!isValidPhone(phone)) {
    throw new AppError('Please provide a valid phone number', 400);
  }

  // Validate user type
  if (!isValidUserType(userType)) {
    throw new AppError('Invalid user type', 400);
  }

  // Check name length
  if (name.length > 50) {
    throw new AppError('Name cannot be more than 50 characters', 400);
  }

  // Check password strength
  if (!isStrongPassword(password)) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Check if user already exists
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  // Create user
  const user = await User.create({
    name,
    email: sanitizedEmail,
    phone,
    password,
    userType,
    isEmailVerified: false,
    emailVerificationToken: verificationTokenHash,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken, user.name);
  } catch (emailError) {
    console.warn('⚠️ Email not sent:', emailError.message);
    // Continue anyway - email is optional for development
  }

  res.status(201).json({
    success: true,
    message: 'Signup successful! Please check your email to verify your account.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType
    }
  });
});

// @route POST /api/auth/verify-email
// @desc Verify email with token
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Verification token is missing', 400);
  }

  // Hash the token to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (err) {
    console.error('Welcome email error:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now login.'
  });
});

// @route POST /api/auth/login
// @desc Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password, userType = 'patient' } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new AppError('Please provide a valid email', 400);
  }

  // Validate user type
  if (!isValidUserType(userType)) {
    throw new AppError('Invalid user type', 400);
  }

  // Check if user exists
  const user = await User.findOne({ email: sanitizeEmail(email) }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if email is verified (in production)
  if (process.env.NODE_ENV === 'production' && !user.isEmailVerified) {
    throw new AppError('Please verify your email first. Check your inbox for verification link.', 401);
  }

  // Check user type
  if (user.userType !== userType) {
    throw new AppError(`Please use ${user.userType} login`, 401);
  }

  // Match password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType
    }
  });
});

// @route POST /api/auth/resend-verification
// @desc Resend verification email
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Please provide email', 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError('Please provide a valid email', 400);
  }

  const user = await User.findOne({ email: sanitizeEmail(email) });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  user.emailVerificationToken = verificationTokenHash;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken, user.name);
  } catch (emailError) {
    throw new AppError('Could not send verification email. Please try again.', 500);
  }

  res.status(200).json({
    success: true,
    message: 'Verification email sent. Please check your inbox.'
  });
});

// @route GET /api/auth/me
// @desc Get current logged-in user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    user
  });
});

// @route PUT /api/auth/update-profile
// @desc Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    throw new AppError('Please provide name and phone', 400);
  }

  if (name.length > 50) {
    throw new AppError('Name cannot be more than 50 characters', 400);
  }

  if (!isValidPhone(phone)) {
    throw new AppError('Please provide a valid phone number', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, phone },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType
    }
  });
});

// @route PUT /api/auth/change-password
// @desc Change user password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError('Please provide all required fields', 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError('New passwords do not match', 400);
  }

  if (!isStrongPassword(newPassword)) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Get user with password field
  const user = await User.findById(req.userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;

