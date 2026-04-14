/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date to validate
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate);
};

/**
 * Check if date is in the past
 * @param {string} date - Date to check
 * @returns {boolean}
 */
export const isDateInPast = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
};

/**
 * Check if date and time are in the past
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} time - Time (HH:mm)
 * @returns {boolean}
 */
export const isDateTimeInPast = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime < new Date();
};

/**
 * Sanitize user input (basic)
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^a-zA-Z0-9\s\-.,!?@]/g, ''); // Allow common characters
};

/**
 * Validate form data
 * @param {Object} data - Data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateFormData = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    // Check required
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      isValid = false;
      return;
    }

    // Check min length
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      isValid = false;
    }

    // Check max length
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
      isValid = false;
    }

    // Check pattern
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
      isValid = false;
    }

    // Check custom validator
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.customMessage || `${field} is invalid`;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Validate form data with yup schema
 * @param {Object} schema - Yup schema
 * @param {Object} data - Data to validate
 * @returns {Promise<Object>} - { isValid: boolean, errors: Object }
 */
export const validateWithSchema = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
    }
    return { isValid: false, errors };
  }
};

export default {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isValidDate,
  isDateInPast,
  isDateTimeInPast,
  sanitizeInput,
  validateFormData,
  validateWithSchema,
};
