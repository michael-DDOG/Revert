// Validation utilities for form inputs

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 6;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= PASSWORD_MIN_LENGTH;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizeText = (text: string): string => {
  return text.trim();
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateSignupForm = (
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Please enter your email address' };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!validatePassword(password)) {
    return { isValid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }

  if (!validatePasswordMatch(password, confirmPassword)) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Please enter your email address' };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!password) {
    return { isValid: false, error: 'Please enter your password' };
  }

  return { isValid: true };
};
