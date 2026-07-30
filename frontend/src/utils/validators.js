/**
 * =============================================================================
 * Jeeva Raksha — Validators Utility (utils/validators.js)
 * =============================================================================
 * Description : Yup schemas and common regex definitions for form validation.
 * =============================================================================
 */
import * as yup from 'yup';

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Min 8 chars, at least one letter and one number
};

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').matches(REGEX.EMAIL, 'Enter a valid email'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required').min(2, 'Name too short'),
  email: yup.string().required('Email is required').matches(REGEX.EMAIL, 'Enter a valid email'),
  password: yup.string().required('Password is required').matches(REGEX.PASSWORD, 'Password must be at least 8 characters and contain a number'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  phone: yup.string().matches(REGEX.PHONE, 'Enter a valid phone number (e.g. +919876543210)').optional(),
  language: yup.string().default('en'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required('Email is required').matches(REGEX.EMAIL, 'Enter a valid email'),
});

export const otpSchema = yup.object().shape({
  otp: yup.string().required('OTP is required').length(6, 'OTP must be exactly 6 digits'),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().required('New password is required').matches(REGEX.PASSWORD, 'Password must be at least 8 characters and contain a number'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Confirm password is required'),
});
