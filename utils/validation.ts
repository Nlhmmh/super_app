import { labelValuePair } from "@/model/models";
import {
  EMAIL_REGEX,
  MIN_PASSWORD_LENGTH,
  NUMBER_ONLY_REGEX,
  PHONE_REGEX,
  TIME_REGEX,
  URL_REGEX,
} from "@/utils/constants";

/**
 * Validates a required text field
 */
export const validateField = (
  value: string,
  fieldName: string
): { isValid: boolean; error: string } => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates email format
 */
export const validateEmail = (
  email: string,
  errorMessages?: Record<string, string>
): { isValid: boolean; error: string } => {
  if (!email) {
    return {
      isValid: false,
      error: errorMessages?.email_require || "Email is required",
    };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email" };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates phone number format
 */
export const validatePhone = (
  phone: string
): { isValid: boolean; error: string } => {
  const validation = validateField(phone, "Phone");
  if (!validation.isValid) return validation;
  if (!PHONE_REGEX.test(phone.trim())) {
    return { isValid: false, error: "Enter a valid phone number" };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates password strength
 */
export const validatePassword = (
  password: string,
  errorMessages?: Record<string, string>
): { isValid: boolean; error: string } => {
  if (!password) {
    return {
      isValid: false,
      error: errorMessages?.password_require || "Password is required",
    };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates password confirmation matches password
 */
export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): { isValid: boolean; error: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: "Confirm your password" };
  }
  if (confirmPassword !== password) {
    return { isValid: false, error: "Passwords do not match" };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates optional URL format
 */
export const validateURL = (
  url: string,
  fieldName?: string
): { isValid: boolean; error: string } => {
  if (url.trim() && !URL_REGEX.test(url.trim())) {
    return { isValid: false, error: "Enter a valid URL" };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates required URL format
 */
export const validateRequiredURL = (
  url: string,
  fieldName: string
): { isValid: boolean; error: string } => {
  const validation = validateField(url, fieldName);
  if (!validation.isValid) return validation;
  if (!URL_REGEX.test(url.trim())) {
    return { isValid: false, error: "Enter a valid URL" };
  }
  return { isValid: true, error: "" };
};
