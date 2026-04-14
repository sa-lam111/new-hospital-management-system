import validator from 'validator';

// Email validation
export const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Phone validation (basic international format)
export const isValidPhone = (phone) => {
  return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(phone);
};

// Password strength validation
export const isStrongPassword = (password) => {
  if (password.length < 6) return false;
  return true;
};

// Sanitize email
export const sanitizeEmail = (email) => {
  return validator.normalizeEmail(email);
};

// Validate appointment date
export const isValidAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return appointmentDate >= today;
};

// Validate appointment time
export const isValidAppointmentTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Validate user type
export const isValidUserType = (userType) => {
  return ['patient', 'doctor'].includes(userType);
};

// Validate appointment status
export const isValidAppointmentStatus = (status) => {
  return ['pending', 'approved', 'completed', 'cancelled'].includes(status);
};

// Validate specialization
export const isValidSpecialization = (specialization) => {
  const validSpecializations = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Gynecology',
    'Dermatology',
    'Pediatrics',
    'General Practice',
    'Psychiatry',
    'Oncology',
    'Urology',
    'ENT',
    'Ophthalmology'
  ];
  return validSpecializations.includes(specialization);
};

// Escape special characters for security
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.trim(validator.escape(input));
};
