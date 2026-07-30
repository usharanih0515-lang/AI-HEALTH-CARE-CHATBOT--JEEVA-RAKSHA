-- =============================================================================
-- Jeeva Raksha — Database Schema
-- =============================================================================
-- Description : Complete MySQL schema for Module 01 (Auth & User Management)
--               Contains role-based separation (Patients, Doctors, Admins)
--               and tracking tables (UserSessions, OTPVerification).
-- =============================================================================

CREATE DATABASE IF NOT EXISTS jeeva_raksha;
USE jeeva_raksha;

-- ─── Users Table ─────────────────────────────────────────────────────────────
-- Core table handling common authentication and identity details for all roles.
CREATE TABLE IF NOT EXISTS users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid  VARCHAR(128) UNIQUE NOT NULL,
    role          ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    profile_photo VARCHAR(1024),
    language      VARCHAR(10) DEFAULT 'en',
    status        ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (firebase_uid),
    INDEX (email)
) ENGINE=InnoDB;

-- ─── Patients Table ──────────────────────────────────────────────────────────
-- Specific medical details for users with the 'patient' role.
CREATE TABLE IF NOT EXISTS patients (
    patient_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    blood_group     VARCHAR(5),
    height          DECIMAL(5,2), -- in cm
    weight          DECIMAL(5,2), -- in kg
    allergies       TEXT,
    medical_history TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB;

-- ─── Doctors Table ───────────────────────────────────────────────────────────
-- Specific professional details for users with the 'doctor' role.
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    specialization  VARCHAR(255) NOT NULL,
    license_number  VARCHAR(100) UNIQUE NOT NULL,
    hospital        VARCHAR(255),
    experience      INT, -- Years of experience
    availability    JSON, -- Working hours structure
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB;

-- ─── Admins Table ────────────────────────────────────────────────────────────
-- Specific details for system administrators.
CREATE TABLE IF NOT EXISTS admins (
    admin_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    designation     VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB;

-- ─── UserSessions Table ──────────────────────────────────────────────────────
-- Active session tracking for JWT management and security.
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    jwt_token   TEXT NOT NULL,
    device      VARCHAR(255),
    login_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB;

-- ─── OTPVerification Table ───────────────────────────────────────────────────
-- Manages OTP generation and validation for password resets and email verification.
CREATE TABLE IF NOT EXISTS otp_verifications (
    otp_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    otp         VARCHAR(100) NOT NULL, -- Hashed OTP
    expiry      TIMESTAMP NOT NULL,
    verified    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id)
) ENGINE=InnoDB;
